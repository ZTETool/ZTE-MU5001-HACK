javascript: ftb();

// METRICS FUNCTIONS

function getStatus() {
  $.ajax({
    type: "GET",
    url: "/goform/goform_get_cmd_process",
    data: {
      cmd:
        "lte_pci,lte_pci_lock,lte_earfcn_lock,wan_ipaddr,wan_apn,pm_sensor_mdm,pm_modem_5g,nr5g_pci,nr5g_action_channel,nr5g_action_band,Z5g_SINR,Z5g_rsrp,wan_active_band,wan_active_channel,wan_lte_ca,lte_multi_ca_scell_info,cell_id,dns_mode,prefer_dns_manual,standby_dns_manual,network_type,rmcc,rmnc,lte_rsrq,lte_rssi,lte_rsrp,lte_snr,wan_lte_ca,lte_ca_pcell_band,lte_ca_pcell_bandwidth,lte_ca_scell_band,lte_ca_scell_bandwidth,lte_ca_pcell_arfcn,lte_ca_scell_arfcn,wan_ipaddr,static_wan_ipaddr,opms_wan_mode,opms_wan_auto_mode,ppp_status,loginfo",
      multi_data: "1",
    },
    dataType: "json",
    success: function (data) {
      for (signal = data, vars = [
          "lte_pci",
          "lte_pci_lock",
          "lte_earfcn_lock",
          "wan_ipaddr",
          "wan_apn",
          "pm_sensor_mdm",
          "pm_modem_5g",
          "nr5g_pci",
          "nr5g_action_band",
          "nr5g_action_channel",
          "Z5g_SINR",
          "Z5g_rsrp",
          "wan_active_channel",
          "wan_active_band",
          "lte_multi_ca_scell_info",
          "cell_id",
          "dns_mode",
          "prefer_dns_manual",
          "standby_dns_manual",
          "rmcc",
          "rmnc",
          "network_type",
          "wan_lte_ca",
          "lte_rssi",
          "lte_rsrp",
          "lte_snr",
          "lte_rsrq",
          "lte_ca_pcell_bandwidth",
          "lte_ca_pcell_band",
        ], i = 0; i < vars.length; i++) window[vars[i]] = data[vars[i]];

      if ($("#nr5rsrpb").parent().toggle("" != data.nr5g_action_band)) {
        $("#Z5g_SINR").parent().toggle("" != data.nr5g_action_band);
        setGraph("nr5rsrp", Z5g_rsrp, -130, -60);
        setGraph("rsrp", lte_rsrp, -130, -60);
        setGraph("rsrq", lte_rsrq, -16, -3);
      }

      cellId = parseInt(cell_id, 16);
      enbId = Math.trunc(cellId / 256);
      $("#earfcn_lock").html(lte_pci_lock + "/" + lte_earfcn_lock);

      plmn = rmcc.toString() + rmnc.toString();
      $("#enbid").html(enbId);

      if ("22201" == plmn) plmn = "2221";
      if ("22299" == plmn) plmn = "22288";
      if ("22250" == plmn && 6 == enbId.length) plmn = "22288";

      linkLte =
        "https://www.cellmapper.net/map?MCC=" + plmn + "." + enbId;
      $("#lteitaly").attr("href", linkLte);

      if ("ca_activated" == wan_lte_ca) {
        $("#ca").parent().parent().css("border-color", "red");
      } else {
        $("#ca").parent().parent().css("border-color", "#bbb");
      }

      if ("" != lte_multi_ca_scell_info) {
        caV = lte_multi_ca_scell_info.slice(0, -1).split(";");
        caTxt = "";
        for (var i = 0; i < caV.length; i++) {
          d = caV[i].split(",");
          b = d[3];
          w = d[5];
          caTxt +=
            '<span style="color:#b00;">B' +
            b +
            "</span>(@" +
            w +
            "Mhz)+";
        }
        lteCaPcellBand = "B" + lte_ca_pcell_band;
      } else {
        caTxt = "";
        lteCaPcellBand = wan_active_band;
      }

      if (data.nr5g_action_band) {
        caTxt +=
          '<span style="padding:5px;border-radius:3px;font-size:1.2em;background-color:#eef;color:red;font-weight:bold;">' +
          data.nr5g_action_band +
          "</span>";
      }

      caTxt = caTxt.slice(0, -1);
      lteMultiCaScellInfo = caTxt;

      if ("manual" == dns_mode) {
        dns_mode = prefer_dns_manual + " ," + standby_dns_manual;
      }

      dns_mode = dns_mode.replace(/,+$/, "");
      dns_mode = '<span style="color:#b00;">' + dns_mode + "</span>";

      lteCaPcellBandwidth =
        lte_ca_pcell_bandwidth && "(@" + lte_ca_pcell_bandwidth + "Mhz)";

      for (i = 0; i < vars.length; i++) {
        $("#" + vars[i]).html(window[vars[i]]);
      }
    },
  });
}

function setGraph(graphId, value, lowerBound, upperBound) {
  var transformedValue = value;
  var percentage = ((value = (value = upperBound < value ? upperBound : value) < lowerBound ? lowerBound : value) - lowerBound) / (upperBound - lowerBound) * 100;

  if (percentage <= 30) {
    percentage = 30;
  }

  if (100 == percentage) {
    percentage = 30;
  }

  var widthString = String(percentage) + String.fromCharCode(37);
  var elementId = "#" + graphId + "b";

  $(elementId).animate({ width: widthString, speed: "fast" });
  $(elementId).html(graphId + " : " + transformedValue);

  if (percentage < 50) {
    $(elementId).css("background-color", "yellow").css("color", "black");
  } else {
    if (85 < percentage) {
      $(elementId).css("background-color", "orange");
    } else {
      $(elementId).css("background-color", "green");
    }
    $(elementId).css("color", "white");
  }
}

function softwareInfo() {
  $.ajax({
    type: "GET",
    url: "/goform/goform_get_cmd_process",
    data: {
      cmd: "hardware_version,web_version,wa_inner_version,cr_version,RD",
      multi_data: "1"
    },
    dataType: "json",
    success: function (res) {
      info = "HW version: " + res.hardware_version +
             "\nWEB version: " + res.web_version +
             "\nWA INNER version: " + res.wa_inner_version;

      alert(info);
    }
  });
}

function extraBandsInfo() {
  var bandsInfoText = wan_active_band + " - PCI,EARFCN:" + parseInt(lte_pci, 16) + "," + wan_active_channel;

  if ("" != signal.lte_multi_ca_scell_info) {
    var caInfoArray = signal.lte_multi_ca_scell_info.slice(0, -1).split(";");

    for (var i = 0; i < caInfoArray.length; i++) {
      var cellInfo = caInfoArray[i].split(",");
      var band = cellInfo[3];
      var earfcn = cellInfo[4];
      var pci = cellInfo[1];
      bandsInfoText += "\nB" + band + " - PCI,EARFCN:" + pci + "," + earfcn;
    }
  }

  bandsInfoText += "\n\n" + nr5g_action_band + " - PCI:" + nr5g_pci + " - EARFCN:" + nr5g_action_channel;
  alert(bandsInfoText);
}

// HIDDEN ACTIONS FUNCTIONS

function lteBandSelection() {
  var userInput = prompt(
    "Please input LTE bands number, separated by + char (example 1+3+20). If you want to use every supported band, write 'AUTO'.",
    "AUTO"
  );

  if (null != (userInput = userInput && userInput.toLowerCase()) && "" !== userInput) {
    var bandNumbers = userInput.split("+"),
      bandMask = 0;

    if (((allBands = "0xA3E2AB0908DF"), "AUTO" === userInput.toUpperCase())) {
      bandMask = allBands;
    } else {
      for (var i = 0; i < bandNumbers.length; i++) {
        bandMask += Math.pow(2, parseInt(bandNumbers[i]) - 1);
      }
      bandMask = "0x" + bandMask.toString(16);
    }

    $.ajax({
      type: "GET",
      url: "/goform/goform_get_cmd_process",
      data: { cmd: "wa_inner_version,cr_version,RD", multi_data: "1" },
      dataType: "json",
      success: function (res) {
        ad = hex_md5(hex_md5(res.wa_inner_version + res.cr_version) + res.RD);
        $.ajax({
          type: "POST",
          url: "/goform/goform_set_cmd_process",
          data: {
            isTest: "false",
            goformId: "BAND_SELECT",
            is_gw_band: 0,
            gw_band_mask: 0,
            is_lte_band: 1,
            lte_band_mask: bandMask,
            AD: ad,
          },
          success: function (res) {
            console.log(res);
          },
          error: handleCommunicationError,
        });
      },
    });
  }
}

function nrBandSelection() {
  var userInput,
    userPrompt = (userPrompt = prompt(
      "Please input 5G bands number, separated by + char (example 3+78). If you want to use every supported band, write 'AUTO'.",
      "AUTO"
    )) && userPrompt.toLowerCase();

  if (null != userPrompt && "" !== userPrompt) {
    userInput = userPrompt.split("+").join(",");

    if ("AUTO" === userPrompt.toUpperCase()) {
      userInput = "1,2,3,5,7,8,20,28,38,41,50,51,66,70,71,74,75,76,77,78,79,80,81,82,83,84";
    }

    $.ajax({
      type: "GET",
      url: "/goform/goform_get_cmd_process",
      data: { cmd: "wa_inner_version,cr_version,RD", multi_data: "1" },
      dataType: "json",
      success: function (res) {
        ad = hex_md5(hex_md5(res.wa_inner_version + res.cr_version) + res.RD);
        $.ajax({
          type: "POST",
          url: "/goform/goform_set_cmd_process",
          data: { isTest: "false", goformId: "WAN_PERFORM_NR5G_BAND_LOCK", nr5g_band_mask: userInput, AD: ad },
          success: function (res) {
            console.log(res);
          },
          error: handleCommunicationError,
        });
      },
    });
  }
}

function setDNS() {
  var userInput,
    userPrompt = (userPrompt = prompt(
      "Please input 2 DNS servers, separated by \",\" (example 1.1.1.1,1.0.0.1). If you want to use PROVIDER settings, write 'AUTO'.",
      "AUTO"
    )) && userPrompt.toLowerCase();

  if (null != userPrompt && "" !== userPrompt) {
    userInput = userPrompt.split(",");
    dnsMode = "auto" === userPrompt ? "auto" : "manual";

    $.ajax({
      type: "GET",
      url: "/goform/goform_get_cmd_process",
      data: { cmd: "wa_inner_version,cr_version,RD", multi_data: "1" },
      dataType: "json",
      success: function (res) {
        ad = hex_md5(hex_md5(res.wa_inner_version + res.cr_version) + res.RD);
        $.ajax({
          type: "POST",
          url: "/goform/goform_set_cmd_process",
          data: {
            isTest: "false",
            goformId: "APN_PROC_EX",
            wan_apn: signal.wan_apn,
            profile_name: "mslave",
            apn_action: "save",
            apn_mode: "manual",
            pdp_type: "IP",
            dns_mode: "manual",
            prefer_dns_manual: userInput[0],
            standby_dns_manual: userInput[1],
            index: 1,
            AD: ad
          },
          success: function (res) {
            $.ajax({
              type: "GET",
              url: "/goform/goform_get_cmd_process",
              data: { cmd: "wa_inner_version,cr_version,RD", multi_data: "1" },
              dataType: "json",
              success: function (res) {
                ad = hex_md5(hex_md5(res.wa_inner_version + res.cr_version) + res.RD);
                $.ajax({
                  type: "POST",
                  url: "/goform/goform_set_cmd_process",
                  data: {
                    isTest: "false",
                    goformId: "APN_PROC_EX",
                    apn_mode: "manual",
                    apn_action: "set_default",
                    set_default_flag: 1,
                    pdp_type: "IP",
                    pdp_type_roaming: "IP",
                    index: 1,
                    AD: ad
                  },
                  success: function () {
                    alert("DNS successfully changed!");
                  },
                  error: handleCommunicationError
                });
              },
              error: handleCommunicationError
            });
          },
          error: handleCommunicationError
        });
      },
      error: handleCommunicationError
    });
  }
}

function lockCell(ltePciLock, lteEarfcnLock) {
  $.ajax({
    type: "GET",
    url: "/goform/goform_get_cmd_process",
    data: { cmd: "wa_inner_version,cr_version,RD", multi_data: "1" },
    dataType: "json",
    success: function (res) {
      var ad = hex_md5(hex_md5(res.wa_inner_version + res.cr_version) + res.RD);
      $.ajax({
        type: "POST",
        url: "/goform/goform_set_cmd_process",
        data: {
          isTest: "false",
          goformId: "LTE_LOCK_CELL_SET",
          lte_pci_lock: ltePciLock,
          lte_earfcn_lock: lteEarfcnLock,
          AD: ad,
        },
        success: function (res) {
          console.log(res);
          var parsedResult = JSON.parse(res);
          if ("success" == parsedResult.res) {
            alert("Now you have to Reboot!");
          } else {
            alert("Error. Modem didn't like it!");
          }
        },
        error: handleCommunicationError,
      });
    },
  });
}

function cellLock() {
  var defaultLockValues = parseInt(lte_pci, 16) + "," + wan_active_channel;
  var userInput = prompt(
    "Please input PCI,EARFCN, separated by ',' char (example 116,3350). Leave default for lock on the current main band.",
    defaultLockValues
  );

  if (userInput !== null && userInput !== "") {
    var inputValues = userInput.split(",");
    var confirmation = prompt("If you cell lock, you have to RESET your router to take the lock away! If you are sure, type YES (UPPERCASE)");

    if (confirmation === "YES") {
      lockCell(inputValues[0], inputValues[1]);
    }
  }
}

function reboot() {
  const userConfirmed = window.confirm("Are you sure you want to reboot?");
  if (userConfirmed) {
    $.ajax({
      type: "GET",
      url: "/goform/goform_get_cmd_process",
      data: { cmd: "wa_inner_version,cr_version,RD", multi_data: "1" },
      dataType: "json",
      success: function (res) {
        ad = hex_md5(hex_md5(res.wa_inner_version + res.cr_version) + res.RD);
        $.ajax({
          type: "POST",
          url: "/goform/goform_set_cmd_process",
          data: { isTest: "false", goformId: "REBOOT_DEVICE", AD: ad },
          success: function (res) {
            console.log(res);
          },
          error: handleCommunicationError,
        });
      },
    });
  }
}

// FE & INTERNAL FUNCTIONS

function handleCommunicationError(xhr, textStatus, errorThrown) {
  alert("Communication Error");
  console.log(xhr);
  console.log(textStatus);
  console.log(errorThrown);
}

function openTab(event, tabName) {
  var tabs, tabLinks, i;
  tabs = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  tabLinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}

function scrowDown() {
  window.scroll({
    top: window.innerHeight,
    behavior: 'smooth'
  });
}

function menuHtmlBody() {
  return `
    <style>
      .clear {
        clear: both;
        width: 100%;
      }
      .action{
        background-color: #cc0000;
        padding: 10px;
        border-radius:10px;
        color: white;
        font-weight:bolder;
        margin-right: 5px;
        margin-left: 5px;
      }
      .action:hover{
        color: white;
      }
      li span{
        margin-left: 5px;
      }
      #lte_ca_pcell_bandwidth{
        margin-left:0;
      }
      #lte_rsrq, #lte_rsrp, #lte_rssi, #enbid, #lte_snr, #Z5g_SINR, #cell_id, #lte_ca_pcell_band, #pm_sensor_mdm, #pm_modem_5g, #earfcn_lock, #wan_ipaddr {
        color: #b00;
        font-weight: strong;
      }
      .f {
        float: left;
        border: 1px solid #bbb;
        border-radius: 5px;
        padding: 10px;
        line-height: 2em;
        margin: 5px;
      }
      .f ul {
        margin: 0;
        padding: 0;
      }
      .f ul li {
        display: inline;
        margin-right: 5px;
        margin-left: 5px;
      }
      #network_type {
        margin-right: 0 !important;
      }
      #enbid {
        font-weight: bold;
        text-decoration: underline;
      }
      .p {
        border-bottom: 1px solid #ccc;
        width: auto;
        height: 20px;
      }
      .v {
        height: 100%25;
        border-right:1px solid #ccc;
      }
      .sb {
        padding: 10px;
        border-radius: 10px;
        display: inline-block;
        margin: 10px 0 10px 10px;
      }
      .v {
        padding-left: 20px;
      }
      #hack_menu {
        margin-right: 12vw !important;
        margin-left: 12vw !important;
      }
    .hidden_menu_button {
      background-color: #04AA6D;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
    .hidden_action_button {
      background-color: #b00;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
    .project_button {
      background-color: #008CBA;
      color: white;
    }
    /* Style the tab */
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }

    /* Style the buttons inside the tab */
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 14px 16px;
      transition: 0.3s;
      font-size: 17px;
    }

    /* Change background color of buttons on hover */
    .tab button:hover {
      background-color: #ddd;
    }

    /* Create an active/current tablink class */
    .tab button.active {
      background-color: #ccc;
    }

    /* Style the tab content */
    .tabcontent {
      display: none;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
    }
    </style>
    <div id="hack_menu">
    <h2>
      <center>
        <a href="https://github.com/the-harry/ZTE-MU5001-HACK" target="_blank">
          ZTE-MU5001-HACK V2
        </a>
      </center>
    </h2>
    <div class="tab">
      <button class="tablinks" onclick="openTab(event, 'METRICS')">METRICS</button>
      <button class="tablinks" onclick="openTab(event, 'HIDDEN_MENUS')">HIDDEN MENUS</button>
      <button class="tablinks" onclick="openTab(event, 'HIDDEN_ACTIONS')">HIDDEN ACTIONS</button>
    </div>

    <div id="METRICS" class="tabcontent">
      <hr>
      <center><a onclick="softwareInfo()">SOFTWARE VERSION INFO</a></center>
      <hr>
      <center><code>Signal strength</code></center>
      <div id="signal_bar">
        <div class="p">
          <div class="v" id="nr5rsrpb"></div>
        </div>
        <div class="p">
          <div class="v" id="rsrpb"></div>
        </div>
        <div class="p">
          <div class="v" id="rsrqb"></div>
        </div>
      </div>
      <hr>
      <center><code>WAN</code></center>
      <ul>
        <li>External IP: <span id="wan_ipaddr"></span></li>
        <li>DNS SERVERS: <span id="dns_mode"></span></li>
      </ul>
      <hr>
      <center><code>4g/5g Metrics</code></center>
      <ul>
        <li>RSRP:<span id="lte_rsrp"></span>dBm</li>
        <li>RSRQ:<span id="lte_rsrq"></span>dB</li>
        <li>RSSI:<span id="lte_rssi"></span>dBm</li>
        <li>SINR:<span id="lte_snr"></span>dB</li>
        <li>5SINR:<span id="Z5g_SINR"></span>dB</li>
        <li>NETWORK TYPE: <span id="network_type">NETWORK TYPE</span></li>
        <li>ENB ID:<a id="lteitaly" target="lteitaly" href="#"><span id="enbid">#</span></a></li>
        <li>CELL ID:<span id="cell_id">#</span></li>
        <br>
        <li>MAIN:<span id="lte_ca_pcell_band"></span><span id="lte_ca_pcell_bandwidth"></span></li>
        <li id="ca">CA:<span id="lte_multi_ca_scell_info"></span></li>
        <li>CELL LOCK MODE: <span id="earfcn_lock"></span></li>
        <li> <a onclick="extraBandsInfo()">EXTRA BANDS INFO</a> </li>
        <li><a href="#network_info" onclick="scrowDown()">View Full Network Information</a></li>
      </ul>
      <hr>
      <center><code>Temperature Metrics</code></center>
      <ul>
        <li>4G:<span id="pm_sensor_mdm"></span>°</li>
        <br>
        <li>5G:<span id="pm_modem_5g"></span>°</li>
        <br>
        <li><a href="#temp_status" onclick="scrowDown()">View Full Temperature Metrics</a></li>
      </ul>
      </hr>
    </div>

    <div id="HIDDEN_MENUS" class="tabcontent f clear">
      <hr>
      <ul>
        <li><a href="#debug_page" class="hidden_menu_button">Debug</a></li>
        <li><a href="#fastboot" class="hidden_menu_button">FastBoot</a></li>
        <li><a href="#pcie_powersave" class="hidden_menu_button">Power Save</a></li>
        <li><a href="#vpn_client" class="hidden_menu_button">VPN client</a></li>
        <li><a href="#mec_setting" class="hidden_menu_button">MEC Settings</a></li>
        <li><a href="#wifi_main" class="hidden_menu_button">WIFI</a></li>
      </ul>
      <hr>
    </div>

    <div id="HIDDEN_ACTIONS" class="tabcontent f clear">
      <hr>
      <ul>
        <li><a class="action hidden_action_button" onclick="lteBandSelection()">SET 4G</a></li>
        <li><a class="action hidden_action_button" onclick="nrBandSelection()">SET 5G</a></li>
        <li><a class="action hidden_action_button" onclick="setDNS()">SET CUSTOM DNS</a></li>
        <li> <a class="action hidden_action_button" onclick="cellLock()">CELL LOCK</a></li>
        <li> <a class="action hidden_action_button" onclick="reboot()">REBOOT</a> </li>
      </ul>
      <hr>
    </div>
    <div>
    <br><hr>
  `
}

function ftb() {
  $(".color_background_blue").css("background-color", "#456");
  $(".headcontainer").hide();
  $("body").prepend(menuHtmlBody());
}

signal = "";
version = "V2";

$("#txtUserName").attr("maxlength", "100");
console.log("INITIALIZING ZTE-MU5001-HACK " + version + "...");

window.setInterval(getStatus, 200);
$("#change").prop("disabled", false);
