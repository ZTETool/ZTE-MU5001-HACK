#!/bin/sh

stage_1_pending() {
  echo "*** CHECKING IF STAGE 1 IS DONE ***"

  grep -q 'STAGE_2_READY' /etc/config/wireless
}

enable_ssh() {
  echo "*** CREATING SSH FILE ON BOOT PARTITION TO ENABLE SSH ***"

  touch /boot/ssh
}

update_firewall() {
  echo "*** UPDATING FIREWALL CONFIG FOR STAGE 1 ***"

  file="/etc/config/firewall"
  temp_file="/tmp/firewall_temp"

  awk -v block="$block_name" '
    $1 == "config" && $2 == "zone" && $3 == "name" && $4 == block {
      in_block = 1
    }

    in_block && $1 == "option" && ($2 == "input" || $2 == "forward") && $3 == "'\''REJECT'\''" {
      $3 = "'\''ACCEPT'\''"
    }

    $1 == "config" && $2 == "zone" && $3 == "name" && in_block {
      in_block = 0
    }

    { print }
  ' "$file" > "$temp_file" && mv "$temp_file" "$file"
}

update_network() {
  echo "*** UPDATING NETWORK CONFIG FOR STAGE 1 ***"

  local config_content="
      option force_link '1'

config interface 'wwan'
      option proto 'dhcp'
      option peerdns '0'
      option dns '1.1.1.1 8.8.8.8'
"

  echo -e "$config_content" | tee -a "/etc/config/network" > /dev/null
}

update_wireless() {
  echo "*** UPDATING WIRELESS CONFIG FOR STAGE 1 ***"

  local config_content="
  config wifi-device 'radio0'
        option type 'mac80211'
        option path 'platform/soc/3f300000.mmc/mmc_host/mmc1/mmc1:0001/mmc1:0001:1'
        option channel '7'
        option htmode 'HT20'
        option hwmode '11g'
        option disabled '0'
        option short_gi_40 '0'

  config wifi-iface 'default_radio0'
        option device 'radio0'
        option network 'lan'
        option mode 'ap'
        option ssid 'OpenWrt'
        option encryption 'none'

# STAGE_2_READY
  "

  echo -e "$config_content" | tee "/etc/config/wireless" > /dev/null
}

commit_changes() {
  echo "*** COMMITING NETWORK CHANGES ***"

  uci commit firewall
  uci commit network
  uci commit wireless
  /etc/init.d/network restart
  wifi
}

check_internet() {
  echo "*** CHECKING INTERNET CONNECTION... ***"

  if ping -q -c 1 -W 1 google.com > /dev/null; then
    echo "Connected to the internet! Well done!"
    return 0
  else
    echo "Error: No internet, check if you connected correctly to your WIFI network before continuing..."
    echo "- Check config files in /etc/config/(firewall|network|wireless);"
    echo "- Check on LUCI if interface and AP are correctly configured;"
    echo "Check Stage 1 post instructions again:"
    post_install_message(1)
    exit 1
  fi
}

install_packages() {
  echo "*** UPDATING AND INSTALLING BASIC PACKAGES FOR USB CONNECTION AND DISK RESIZE. ***"

  opkg update
  opkg install kmod-usb-net-rndis kmod-usb-net-cdc-ncm kmod-usb-net-huawei-cdc-ncm \
               kmod-usb-net-cdc-eem kmod-usb-net-cdc-ether kmod-usb-net-cdc-subset \
               kmod-nls-base kmod-usb-core kmod-usb-net kmod-usb-net-cdc-ether \
               kmod-usb2 kmod-usb-net-ipheth usbmuxd libimobiledevice usbutils \
               parted losetup resize2fs
}

create_resize_scripts() {
echo "*** CREATING DISK RESIZE SCRIPTS. ***"

cat << "EOF" > /etc/uci-defaults/70-rootpt-resize
if [ ! -e /etc/rootpt-resize ] \
&& type parted > /dev/null \
&& lock -n /var/lock/root-resize
then
  ROOT_BLK="$(readlink -f /sys/dev/block/"$(awk -e \
  '$9=="/dev/root"{print $3}' /proc/self/mountinfo)")"
  ROOT_DISK="/dev/$(basename "${ROOT_BLK%/*}")"
  ROOT_PART="${ROOT_BLK##*[^0-9]}"
  parted -f -s "${ROOT_DISK}" \
  resizepart "${ROOT_PART}" 100%
  mount_root done
  touch /etc/rootpt-resize
  reboot
fi
exit 1
EOF

cat << "EOF" > /etc/uci-defaults/80-rootfs-resize
if [ ! -e /etc/rootfs-resize ] \
&& [ -e /etc/rootpt-resize ] \
&& type losetup > /dev/null \
&& type resize2fs > /dev/null \
&& lock -n /var/lock/root-resize
then
  ROOT_BLK="$(readlink -f /sys/dev/block/"$(awk -e \
  '$9=="/dev/root"{print $3}' /proc/self/mountinfo)")"
  ROOT_DEV="/dev/${ROOT_BLK##*/}"
  LOOP_DEV="$(awk -e '$5=="/overlay"{print $9}' \
  /proc/self/mountinfo)"
  if [ -z "${LOOP_DEV}" ]
  then
    LOOP_DEV="$(losetup -f)"
    losetup "${LOOP_DEV}" "${ROOT_DEV}"
  fi
  resize2fs -f "${LOOP_DEV}"
  mount_root done
  touch /etc/rootfs-resize
  reboot
fi
exit 1
EOF

cat << "EOF" >> /etc/sysupgrade.conf
/etc/uci-defaults/70-rootpt-resize
/etc/uci-defaults/80-rootfs-resize
EOF
}

enable_usb0() {
  echo "*** ENABLING USB0 INTERFACE ***"

  usbmuxd -v
  sed -i -e "\$i usbmuxd" /etc/rc.local
  commit_changes
  ifconfig usb0 up
}

set_static_mac() {
  ip a
  echo "*** STATIC MAC SETTINGS ***"
  echo "Check the MAC Address on usb0 from the list above and use it, or use a different one."
  echo "Enter a valid MAC address for the usb0 device (e.g., 00:11:22:33:44:55): "
  read -r mac_address

  if [[ ! $mac_address =~ ^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$ ]]; then
    read -p "Error: Invalid MAC address format. Try again."
    set_static_mac
  fi

  local config_content="config device
  \toption name 'usb0'
  \toption macaddr '$mac_address'"

  echo -e "$config_content" | tee -a "/etc/config/network" > /dev/null
}

create_internal_ap() {
  echo "*** CREATING 5GHz AP USING DEFAULT INTERNAL NIC ***"

  local country_code
  local ssid
  local password

  read -p "Enter country code (e.g., GB): " country_code
  read -p "Enter AP SSID: " ssid
  read -p "Enter AP password: " password

  local config_content="
  config wifi-device 'radio0'
    option type 'mac80211'
    option channel '36'
    option hwmode '11a'
    option htmode 'VHT80'
    option vhtmode 'VHT80'
    option country '$country_code'

  config wifi-iface 'default_radio0'
    option device 'radio0'
    option mode 'ap'
    option network 'lan'
    option ssid '$ssid'
    option encryption 'psk2'
    option key '$password'
    option disabled '0'
  "

  echo -e "$config_content" | sudo tee "/etc/config/wireless" > /dev/null
  }


post_install_message() {
  if [ "$1" -eq 1 ]; then
    echo "*** STAGE 1 DONE ***"
    echo "POST INSTALL INSTRUCTIONS(MUST DO):"
    echo "Connect to the wifi OpenWrt and via GUI replace this connection for an existent WIFI to have internet for the next step"
    echo "Networks -> Wireless -> radio0(Scan) -> Select existent network, check 'Replace wireless configuration' -> Save and apply all changes."
    echo "The device is going to reboot now, after that, run the script again!"
  elif [ "$1" -eq 2 ]; then
    echo "*** STAGE 2 DONE ***"
    echo "POST INSTALL INSTRUCTIONS(OPTIONAL):"
    echo "Set MAC-IP binding on the modem(avoid changing the openwrt IP all the time)"
    echo "Add extra network interfaces as needed as by default you'll be able to create a single 5GHz AP using the internal NIC."
    echo "Stop main networks on ZTE and serve them on OpenWrt, leave visitors network as fallback in case of power outages."
    echo "The device is going to reboot now after resizing the sd to full capacity, enjoy your wireless freedom! :)"
  fi

  read -p "Press Enter to continue."
}

resize_root_script() {
  echo "*** CALLING RESIZE DISK SCRIPT ***"

  sh /etc/uci-defaults/70-rootpt-resize
}

if stage_1_pending; then
    echo "*** STAGE 1 STARTED ***"
    enable_ssh
    update_firewall
    update_network
    update_wireless
    commit_changes
    reboot
else
    echo "*** STAGE 2 STARTED ***"
    check_internet
    install_packages
    create_resize_scripts
    enable_usb0
    set_static_mac
    create_internal_ap
    commit_changes
    resize_root_script
fi
