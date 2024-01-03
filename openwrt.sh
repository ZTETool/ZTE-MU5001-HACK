# 1 - download image for target raspberry pi model https://openwrt.org/toh/views/toh_fwdownload

# 2 - format the sdcard to ext4 and flash to SD using balena etecher
# 3-  touch empty ssh file in boot partition
# 4 - copy this script to /etc/config root partition


# 5 - vim /etc/config/firewall
##> WAN -> REJECT to ACCEPT
# uci commit firewall

# 6 - vim /etc/config/network
# ...
##> LAN -> option force_link '1'

##> config interface 'wwan'
##>         option proto 'dhcp'
##>         option peerdns '0'
##>         option dns '1.1.1.1 8.8.8.8'

# uci commit network

# 7 - vim /etc/config/wireless
##
## config wifi-device 'radio0'
##       option type 'mac80211'
##       option path 'platform/soc/3f300000.mmc/mmc_host/mmc1/mmc1:0001/mmc1:0001:1'
##       option channel '7'
##       #option band '5g'
##       option htmode 'HT20'
##       option hwmode '11g'
##       option disabled '0'
##       option short_gi_40 '0'
##
## config wifi-iface 'default_radio0'
##        option device 'radio0'
##        option network 'lan'
##        option mode 'ap'
##        option ssid 'OpenWrt'
##        option encryption 'none'

## uci commit wireless
## wifi
# reboot


# 8 - connect to wifi network via GUI (replace connection)
# test connection with ping google.com

opkg update && opkg install kmod-usb-net-rndis kmod-usb-net-cdc-ncm \
             kmod-usb-net-huawei-cdc-ncm kmod-usb-net-cdc-eem \
             kmod-usb-net-cdc-ether kmod-usb-net-cdc-subset kmod-nls-base \
             kmod-usb-core kmod-usb-net kmod-usb-net-cdc-ether kmod-usb2 \
             kmod-usb-net-ipheth usbmuxd libimobiledevice usbutils \
             parted losetup resize2fs

# Configure startup scripts to resize disk
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

usbmuxd -v

sed -i -e "\$i usbmuxd" /etc/rc.local

# uci set network.wan.ifname="usb0"
# uci set network.wan6.ifname="usb0"
uci commit network
/etc/init.d/network restart

# set usb0 interface
ifconfig usb0 up

sh /etc/uci-defaults/70-rootpt-resize

# run this script

# create APs
#
# config wifi-device 'radio0'
#     option type 'mac80211'
#     option channel '36'
#     option hwmode '11a'
#     option htmode 'VHT80'
#     option vhtmode 'VHT80'
#     option country 'GB'
#
# config wifi-iface 'default_radio0'
#     option device 'radio0'
#     option mode 'ap'
#     option network 'lan'
#     option ssid 'SSID'
#     option encryption 'psk2'
#     option key 'PASS'
#     option disabled '0'


# test without WWLAN interface via
# remove WWLAN interface via GUI
