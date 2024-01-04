# ZTE-MU5001-HACK

## ABOUT

This fork of [ZTE-MU5001-BROWSER-HACK](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK]) improves front-end menu, documentation regarding available menus, provides the original approach of copy-paste from the V1 and adds a Firefox extension as a V2, the code was also refactored in order to be more readable and make it easier for any further modifications.


## INSTALATION

- For the V1 approach just copy and paste the code from [src/hack.js](src/hack.js) in the browser console as usual(works in any browser). Also can be obfuscated and saved as a favorite as before, but obfuscated version is not released yet.

- For the V2 approach, go to the [releases page](https://github.com/the-harry/ZTE-MU5001-HACK/releases), download the xpi file in the assets section, install in your browser, allow incognito if needed. The extension will run automatically when the active tab is `http(s)://192.168.0.1/*` or `http(s)://ufi.ztedevice.com/*`.

No support for new browser extensions will be provided as they're more annoying than Firefox to work with and you can just copy and paste it.

If you wish to also install OpenWrt in a raspberry PI to use it as main router and connect the ZTE as a modem [check this doc](openwrt/README.md).

## FEATURES

#### New V2.4.3 screenshots

![v2.4.3-1](https://github.com/the-harry/ZTE-MU5001-HACK/assets/38408536/7896909f-537e-4cef-9548-c940f2e998e3)
![v2.4.3-2](https://github.com/the-harry/ZTE-MU5001-HACK/assets/38408536/ffbb882e-56d7-4877-90bd-be0f6dee19d4)

- Live metrics
- All available menus of the router(hidden ones and the regular ones)
- Hidden actions are listed as a menu item to be more transparent for the user

## MANUALLY SIGNING FIREFOX EXT

```bash
export MOZILLA_API_KEY="user:333333333:000"
export MOZILLA_API_SECRET=="HUAEHUEHUAEHUAHEUHEAUE"

docker-compose down && docker-compose up --build

# xpi file should be available under src/web-ext-artifacts once the container exits
```

## ROADMAP/TODO

[ZTE-MU5001-HACK Kanban](https://github.com/users/the-harry/projects/4)

Do you have any idea, suggestion or complaint? Or perhaps found a missing menu item or action? [Please open an issue here!](https://github.com/the-harry/ZTE-MU5001-HACK/issues)


## ORIGINAL CREDITS AND FURTHER RESOURCES

- [ZTE-MU5001 OFFICIAL INSTALLATION GUIDE](https://oss.ztedevices.com/prod/cn/direct/hk/mu5001/MU5001%20User%20Guide%20-0115-1.pdf)
- [ZTE-MU5001 OFFICIAL Quick Start Guide](https://oss.ztedevices.com/prod/cn/direct/hk/mu5001/MU5001%20User%20Guide%20-0115-1.pdf)
- [ZTE-MU5001 FCC DOCS](https://fcc.report/FCC-ID/SRQ-MU5001)
- [Forked from ZTE-MU5001-BROWSER-HACK](https://github.com/githubxbox/ZTE-MU5001-BROWSER-HACK)
- [Thread on Adslgr.com(Greek)](https://www.adslgr.com/forum/threads/1220156-%CE%9Cifi-mu5001-Secret-settings/page3/)
- [Old repo for ZTE-MU5001-BROWSER-HACK(404)](https://github.com/sklavosit/ZTE-MU5001-BROWSER-HACK)
- [mifi-mu5001-lib firmware(reverse engineered)](https://github.com/DarkNikGr/mifi-mu5001-lib/)
