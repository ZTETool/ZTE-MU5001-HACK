# OpenWrt RaspberryPI USB Ethernet - ZTE COMPATIBLE

# INTRO

This doc intends to provide a guide on how to configure an OpenWrt router that gets its internet via the ZTE usb port while charging it. This gives total control over the network and allows hardware improvements like better wifi antennas.

This script was tested on a Raspberry Pi B 3+ (minimum requirement) and might need adjustments for other models, if needed open an issue on github.

# INSTALATION

- Copy the script to root partition after burning the image:

```bash
cp openwrt/install.sh /SD_CARD_LOCATION/boot/openwrt_install.sh
```

- Boot the PI and run it via CLI(Don't use ssh as it loses connection during the process):

```bash
./boot/openwrt_install.sh
```

Read the instructions carefully, the first SSID/PASSWORD combination are from an existent network in order to download the necessary packages, the second one is for the new 5GHz network.

# POST INSTALL

- Set MAC-IP binding on the modem(avoid changing the openwrt IP all the time)

- Add extra network interfaces as needed as by default you'll be able to create a single 5GHz AP using the internal NIC.(for the future the idea is to create auxiliary scripts to setup specific models of antennas with their drivers in a modular way, this can be perhaps even be called in the main script after the basic setup is done, but it need to be done manually for now)

- Stop main networks on ZTE and serve them on OpenWrt, leave guests network as fallback in case of power outages.
