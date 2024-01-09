var version = "V3.0.2";
var signal = "";
var chart;
var memory = {
    time: [],
    NR5RSRP: [],
    SINR5G: [],
    RSRP: [],
    SINR: [],
    RSRQ: [],
    RSSI: [],
};
var maxDataPoints = 300;

function createLineChart(chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 255, 0, 0.2)');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: memory.time,
            datasets: [],
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            second: 'H:mm:ss',
                            minute: 'H:mm',
                            hour: 'H:mm',
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                    },
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                }],
                yAxes: [{
                    beginAtZero: false,
                    min: -120,
                    max: 30,
                    stepSize: 20,
                    ticks: {
                        color: '#ffffff',
                        maxRotation: 0,
                        callback: function(value, index, values) {
                            return `${value} dBm`;
                        }
                    },
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                }]
            },
            legend: {
                position: 'right',
                labels: {
                    fontColor: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    generateLabels: function (chart) {
                      return Chart.defaults.global.legend.labels.generateLabels(chart).map(label => {
                          const data = chart.data.datasets[label.datasetIndex].data;
                          const value = data.length ? parseFloat(data[data.length - 1].y).toFixed(2) : 'N/A';
                          label.text = `${label.text} (${value} dBm)`;
                          return label;
                      });
                  },
                }
            },
            tooltips: {
                callbacks: {
                    label: function(context) {
                        const datasetLabel = context.dataset.label || '';
                        const yLabel = context.parsed.y + ' dBm';
                        return `${datasetLabel}: ${yLabel}`;
                    },
                    title: function(tooltipItems) {
                        return `Time: ${tooltipItems[0].label}`;
                    }
                }
            },
            elements: {
                point: {
                    pointStyle: 'circle',
                },
                line: {
                    backgroundColor: gradient,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                }
            }
        }
    });
}

function updateChartData(chart, metricName, data, color) {
    const currentTime = new Date();

    memory[metricName].push({ time: currentTime, value: data });

    if (memory[metricName].length > maxDataPoints) {
        memory[metricName].shift();
    }

    const datasetIndex = chart.data.datasets.findIndex(ds => ds.label === metricName);
    if (datasetIndex !== -1) {
        chart.data.datasets[datasetIndex].data = memory[metricName].map(point => ({ x: point.time, y: point.value }));
    } else {
        chart.data.datasets.push({
            label: metricName,
            data: memory[metricName].map(point => ({ x: point.time, y: point.value })),
            fill: false,
            borderColor: color,
            borderWidth: 2,
            backgroundColor: color,
        });
    }

    chart.update();
}

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

      pm_modem_5g = Math.abs(parseFloat(pm_modem_5g));
      network_type = getMobileNetworkSymbol(network_type);

      updateChartData(chart, "NR5RSRP", Z5g_rsrp, 'rgba(50, 205, 50, 1)');
      updateChartData(chart, "SINR5G", Z5g_SINR, 'rgba(245, 155, 39, 0.8)');
      updateChartData(chart, "RSRP", lte_rsrp, 'rgba(148, 0, 211, 1)');
      updateChartData(chart, "SINR", lte_snr, 'rgba(245, 236, 39, 0.8)');
      updateChartData(chart, "RSRQ", lte_rsrq, 'rgba(67, 147, 221, 0.8)');
      updateChartData(chart, "RSSI", lte_rssi, 'rgba(231, 69, 238, 0.8)');

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

      // fix the ids below

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

function getMobileNetworkSymbol(network_type) {
    const networkSymbols = {
        '2G': '2G',
        '3G': '3G',
        '4G': '4G',
        '4G+': '4G+',
        '5G': '5G',
        'LTE': '4G',
        'LTE-NSA': '4G+',
        'ENDC': '5G',
    };

    if (networkSymbols.hasOwnProperty(network_type)) {
        return networkSymbols[network_type];
    } else {
        return network_type;
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

function lteBandSelection() {
  var userInput = prompt(
    "Please input LTE bands number, separated by + char (example 3+28+20+7+1). If you want to use every supported band, write 'AUTO'.",
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
      "Please input 5G bands number, separated by + char (example 79+77+78+89+88). If you want to use every supported band, write 'AUTO'.",
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

function readCurrentDNS() {
  return new DOMParser().parseFromString(dns_mode, 'text/html').body.textContent;
}

function setDNS() {
  var userInput,
    userPrompt = (userPrompt = prompt(
      "Please input 2 DNS servers, separated by \",\" (example 1.1.1.1,1.0.0.1). If you want to use PROVIDER settings, write 'AUTO'.",
      readCurrentDNS()
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
            profile_name: "custom_dns_apn_profile",
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

function handleCommunicationError(xhr, textStatus, errorThrown) {
  alert("Communication Error");
  console.log(xhr);
  console.log(textStatus);
  console.log(errorThrown);
}

function scrowDown() {
  window.scroll({
    top: window.innerHeight,
    behavior: 'smooth'
  });
}

function setChart() {
  if (typeof window.createLineChart === 'function') {
    chart = window.createLineChart("metricsChart");
    setInterval(() => {
      window.getStatus();
    }, 1000);
    console.error('chart set');
  } else {
    console.error('createLineChart function not defined');
  }
}
