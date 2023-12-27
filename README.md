# ZTE-MU5001-HACK

## ABOUT

This fork of [ZTE-MU5001-BROWSER-HACK](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK]) improves front-end menu, documentation regarding available menus, provides the original approach of copy-paste from the V1 and adds an experimental Firefox extension as a V2, the code was also refactored in order to be more readable and make it easier for any further extension or modifications.


## INSTALATION

- For the V1 just copy and paste the code in the browser console as usual(works in any browser).

- For the V2, load it as an unpacked extension in Firefox. Open the `about:debugging` page, click "This Firefox" on the left, and then click "Load Temporary Add-on." Select the `manifest.json` file in your extension directory where you downloaded this project. The extension will run automatically when the active tab is `http://192.168.0.1/*`.


## FEATURES

V1 screenshot
![V1](https://i.ibb.co/12WwG4Q/Screenshot-24.png)

V2 screenshot
![V2](TODO AFTER FE CHANGES)

### HIDDEN MENUS

- **Network Info** (Current network status)
- **Debug** (PS No Service Restart Set)
- **FastBoot** (If enable Fast Boot function, your device will start in a short time.)
- **Power Save** (Set PCIE power consumption. Turning on the switch will enable PCIE L1/L1SS and enable ASPM energy saving function.)
- **Vpn client** (Connects to the private network established on the public network for secure communication and supports L2TP and PPTP types.)
- **Temp Status** (Temperature Control Status)
- **Temp Settings** (Temperature Control Settings)
- **MEC Settings** (MEC coordination feature needs support of customized edge computing server. For details, please contact your 5G service provider.)
- **Wifi** (Wi-Fi Settings)

## HIDDEN ACTIONS

- **SET 4G** (Input LTE bands number, separated by + char (example 1+3+20).If you want to use every supported band, write 'AUTO'.)
- **SET 5G** (Input 5G bands number, separated by + char (example 3+78).If you want to use every supported band, write 'AUTO'.)
- **DNS MODE** (Input 2 dns servers, separated by ","  (example 1.1.1.1,1.0.0.1).If you want to use PROVIDER settings, write 'AUTO'.)
- **INFO** (Show PCI, EARFCN and bands info)
- **CELL LOCK** (Input PCI,EARFCN, separated by ',' char (example 116,3350). Leave default for lock on current main band.)
- **REBOOT** (NO CONFIRMATION, BE CAREFUL)
- **VER** (Show firmware versions)

### LIVE METRICS

- nr5rsrp
- RSRP
- RSRQ
- RSSI
- SINR
- 5SINR
- network type: ENDC, etc..
- ENB ID
- CELL ID

- BANDS INFORMATION

- WAN IP
- Temp 4G
- temp 5G


## ORIGINAL CREDITS AND FURTHER RESOURCES

- [ZTE-MU5001 OFFICIAL INSTALLATION GUIDE](https://oss.ztedevices.com/prod/cn/direct/hk/mu5001/MU5001%20User%20Guide%20-0115-1.pdf)
- [ZTE-MU5001 OFFICIAL Quick Start Guide](https://oss.ztedevices.com/prod/cn/direct/hk/mu5001/MU5001%20User%20Guide%20-0115-1.pdf)
- [Forked from ZTE-MU5001-BROWSER-HACK](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK)
- [Thread on Adslgr.com(Greek)](https://www.adslgr.com/forum/threads/1220156-%CE%9Cifi-mu5001-Secret-settings/page3/)
- [Old repo for ZTE-MU5001-BROWSER-HACK(404)](https://github.com/sklavosit/ZTE-MU5001-BROWSER-HACK)
