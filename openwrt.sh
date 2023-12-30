# download image for target raspberry pi model https://openwrt.org/toh/views/toh_fwdownload
# flash to SD using balena etecher
# touch empty ssh file in boot partition
# copy this script to /etc/config root partition

# configure WLAN via CLI

## cd /etc/config
## vim network
##> LAN -> option force_link '1'
##> config interface 'wwan'
##>         option proto 'dhcp'
##>         option peerdns '0'
##>         option dns '1.1.1.1 8.8.8.8'

##vim firewall
##> WAN -> REJECT to ACCEPT

## reboot
## cd /etc/config
## vim wireless
##> option channel '7'
##> option hwmode '11g'
##> option htmode 'HT20'
##> option disabled '0'
##> option short_gi_40 '0'

## uci commit wireless
## wifi

# connect to wifi network via GUI (replace connection)
# test connection with ping google.com

opkg update
opkg install kmod-usb-net-rndis kmod-usb-net-cdc-ncm \
             kmod-usb-net-huawei-cdc-ncm kmod-usb-net-cdc-eem \
             kmod-usb-net-cdc-ether kmod-usb-net-cdc-subset kmod-nls-base \
             kmod-usb-core kmod-usb-net kmod-usb-net-cdc-ether kmod-usb2 \
             kmod-usb-net-ipheth usbmuxd libimobiledevice usbutils

usbmuxd -v

sed -i -e "\$i usbmuxd" /etc/rc.local

uci set network.wan.ifname="usb0"
uci set network.wan6.ifname="usb0"
uci commit network
/etc/init.d/network restart

# set usb0 interface
ifconfig usb0 up
reboot
# run this script
# ADD INTERFACE FOR USB0 VIA CLI wan group
# test without WWLAN interface via GUI????
# remove WWLAN interface via GUI

# create APs...

# resize disk
