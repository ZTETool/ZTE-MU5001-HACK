# ZTE-MU5001-HACK

## ABOUT

This fork of [ZTE-MU5001-BROWSER-HACK](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK]) improves front-end menu, documentation regarding available menus, provides the original approach of copy-paste from the V1 and adds an experimental Firefox extension as a V2, the code was also refactored in order to be more readable and make it easier for any further extension or modifications.


## INSTALATION

- For the V1 approach just copy and paste the code in the browser console as usual(works in any browser).

- For the V2 approach, load it as an unpacked extension in Firefox. Open the `about:debugging` page, click "This Firefox" on the left, and then click "Load Temporary Add-on." Select the `manifest.json` file in your extension directory where you downloaded this project. The extension will run automatically when the active tab is `http://192.168.0.1/*`.


## FEATURES

#### Old V1 screenshot
![V1](https://github.com/the-harry/ZTE-MU5001-HACK/assets/38408536/38f1e026-44fd-47ce-b73e-691672588918)

#### New V2 screenshot
![V2.pt1](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK/assets/38408536/2ba7470e-36bf-4abf-bf2d-390def86d689)
![V2.pt2](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK/assets/38408536/ddfb3c74-778d-4982-bdc0-6722e93c7577)
![v2.pt3](https://github.com/the-harry/ZTE-MU5001-HACK/assets/38408536/5232b58b-d567-4688-bca4-9137299df70e)
![V2.pt4](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK/assets/38408536/68dd2d43-1e42-4dcd-a28f-ebfdfffc7437)

### LIVE METRICS

- **SOFTWARE VERSION INFO** (Show firmware versions)

- **SIGNAL STRENGTH**
  - nr5rsrp
  - RSRP
  - RSRQ

- **WAN**
  - External IP
  - DNS Servers

- **4g/5g Metrics***
  - RSRP
  - RSRQ
  - RSSI
  - SINR
  - 5SINR
  - NETWORK TYPE
  - ENB ID
  - CELL ID

- **BANDS INFO**
  - MAIN
  - CA
  - CELL LOCK MODE
  - EXTRA BANDS INFO
  - FULL NETWORK INFORMATION

- **TEMPERATURE METRICS**
  - Temperature 4G modem
  - Temperature 5G modem
  - FULL TEMPERATURE METRICS

### HIDDEN MENUS

- **Debug** (PS No Service Restart Set)
- **FastBoot** (If enable Fast Boot function, your device will start in a short time.)
- **Power Save** (Set PCIE power consumption. Turning on the switch will enable PCIE L1/L1SS and enable ASPM energy saving function.)
- **VPN client** (Connects to the private network established on the public network for secure communication and supports L2TP and PPTP types.)
- **MEC Settings** (MEC coordination feature needs support of customized edge computing server. For details, please contact your 5G service provider.)
- **Temperature Control Settings** (Sensors Temperature Control Settings)
- **WIFI** (Wi-Fi Settings)

## HIDDEN ACTIONS

- **SET 4G** (Input LTE bands number, separated by + char (example 1+3+20).If you want to use every supported band, write 'AUTO'.)
- **SET 5G** (Input 5G bands number, separated by + char (example 3+78).If you want to use every supported band, write 'AUTO'.)
- **SET CUSTOM DNS** (Input 2 dns servers, separated by ","  (example 1.1.1.1,1.0.0.1).If you want to use PROVIDER settings, write 'AUTO'.)
- **CELL LOCK** (Input PCI,EARFCN, separated by ',' char (example 116,3350). Leave default for lock on current main band.)
- **REBOOT** (Reboots after confirmation)

## ORIGINAL CREDITS AND FURTHER RESOURCES

- [ZTE-MU5001 OFFICIAL INSTALLATION GUIDE](https://oss.ztedevices.com/prod/cn/direct/hk/mu5001/MU5001%20User%20Guide%20-0115-1.pdf)
- [ZTE-MU5001 OFFICIAL Quick Start Guide](https://oss.ztedevices.com/prod/cn/direct/hk/mu5001/MU5001%20User%20Guide%20-0115-1.pdf)
- [ZTE-MU5001 FCC DOCS](https://fcc.report/FCC-ID/SRQ-MU5001)
- [Forked from ZTE-MU5001-BROWSER-HACK](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK)
- [Thread on Adslgr.com(Greek)](https://www.adslgr.com/forum/threads/1220156-%CE%9Cifi-mu5001-Secret-settings/page3/)
- [Old repo for ZTE-MU5001-BROWSER-HACK(404)](https://github.com/sklavosit/ZTE-MU5001-BROWSER-HACK)
- [mifi-mu5001-lib firmware(reverse engineered)](https://github.com/DarkNikGr/mifi-mu5001-lib/)
