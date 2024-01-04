# OpenWrt RaspberryPI - ZTE USB COMPATIBLE

# INTRO

This doc intends to provide a guide on how to configure an OpenWrt router that gets its internet via the ZTE usb port while charging it. This gives total control over the network and allows hardware improvements like better wifi antennas.

This script was tested on a Raspberry Pi B 3+ (minimum requirement) and might need adjustments for other models, if needed open an issue on github.

This script works in two stages:

- **Stage 1**: Create configs for ssh, and a open network to connect in order to do the next step;
- **Stage 1.5(MANUAL)**: Via GUI replace this new connection for an existent WIFI to have internet for the next step;
- **Stage 2**: Download necessary packages, enable usb0, resize disk, set static MAC, replace WIFI settings for a new AP.

# INSTALATION

- Copy the script to root partition after burning the image:

```bash
cp openwrt/install.sh /etc/config/openwrt_install.sh
```

- Boot the PI and run it via CLI(Don't use ssh as it loses connection during the process):

```bash
./etc/config/openwrt_install.sh
```

- After the first reboot connect to the OpenWrt wifi, access the webpage(LUCI), go to interfaces, click scan on your wireless interface, find your WIFI network and connect to it, this will allow the second stage to run as it needs internet.

- Run it again after connecting to an existent wifi network, it should do the last configs and resize the sdcard to its full size, if no internet is available try to restart the PI again.

- After the previous reboot you should be able to connect via SSH and also the usb0 should be up and running, if so remove any remaining unused interface/network.

# POST INSTALL

- Set MAC-IP binding on the modem(avoid changing the openwrt IP all the time)

- Add extra network interfaces as needed as by default you'll be able to create a single 5GHz AP using the internal NIC.(for the future the idea is to create auxiliary scripts to setup specific models of antennas with their drivers in a modular way, this can be perhaps even be called in the main script after stage 2, but it need to be done manually for now)

- Stop main networks on ZTE and serve them on OpenWrt, leave visitors network as fallback in case of power outages.
