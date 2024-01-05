#!/bin/sh

enable_ssh() {
  echo "*** CREATING SSH FILE ON BOOT PARTITION TO ENABLE SSH ***"

  touch /boot/ssh
}

update_firewall() {
  uci set firewall.@zone[1].input='ACCEPT'
  uci set firewall.@zone[1].network='wan wan6 usb0'
}

update_network() {
  echo "*** UPDATING NETWORK CONFIG FOR STAGE 1 ***"

  local config_content="\
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

  local ssid
  local password

  read -p "Enter AP SSID: " ssid
  read -p "Enter AP password: " password

  local config_content=$(cat <<-EOF
config wifi-device 'radio0'
  option type 'mac80211'
  option path 'platform/soc/3f300000.mmcnr/mmc_host/mmc1/mmc1:0001/mmc1:0001:1'
  option channel '7'
  option htmode 'HT20'
  option hwmode '11g'
  option disabled '0'
  option short_gi_40 '0'
  option cell_density '0'

config wifi-iface 'default_radio0'
  option device 'radio0'
  option mode 'sta'
  option network 'wwan'
  option ssid '$ssid'
  option encryption 'psk2'
  option key '$password'

EOF
)

  echo "$config_content" > "/etc/config/wireless"
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

  sleep 30

  if ping -q -c 1 -W 1 openwrt.org > /dev/null; then
    echo "Connected to the internet! Well done!"
    return 0
  else
    echo "Error: No internet, check if you connected correctly to your WIFI network before continuing..."
    echo "- Check config files in /etc/config/(wireless) and double-check SSID and PASSWORD;"
    check_internet
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

  local config_content="config device
  \toption name 'usb0'
  \toption macaddr '$mac_address'

  \tconfig interface 'usb0'
        \toption proto 'dhcp'
        \toption device 'usb0'
        \toption type 'bridge'
"

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
    option path 'platform/soc/3f300000.mmcnr/mmc_host/mmc1/mmc1:0001/mmc1:0001:1'
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

  echo -e "$config_content" | tee "/etc/config/wireless" > /dev/null
}

post_install_message() {
  echo "POST INSTALL INSTRUCTIONS(OPTIONAL):"
  echo "Set MAC-IP binding on the modem(avoid changing the openwrt IP all the time)"
  echo "Add extra network interfaces as needed as by default you'll be able to create a single 5GHz AP using the internal NIC."
  echo "Stop main networks on ZTE and serve them on OpenWrt, leave visitors network as fallback in case of power outages."
  echo "The device is going to reboot now after resizing the sd to full capacity, enjoy your wireless freedom! :)"

  read -p "Press Enter to continue."
}

resize_root_script() {
  echo "*** CALLING RESIZE DISK SCRIPT ***"

  /bin/sh /etc/uci-defaults/70-rootpt-resize
}

enable_ssh
update_firewall
update_network
update_wireless
commit_changes

check_internet
install_packages
create_resize_scripts
enable_usb0
set_static_mac
create_internal_ap
commit_changes
post_install_message
resize_root_script
