function loadChartJs() {
  const chartScript = document.createElement('script');
  chartScript.src = chrome.runtime.getURL('chart.bundle.min.js');
  chartScript.onload = loadCss;
  chartScript.onerror = () => console.error('Error loading Chart.js');
  document.head.appendChild(chartScript);
}

function loadCss() {
  const cssLink = document.createElement('link');
  cssLink.href = chrome.runtime.getURL('chart.css');
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';
  document.head.appendChild(cssLink);
  loadHackJs();
}

function loadHackJs() {
  const hackScript = document.createElement('script');
  hackScript.src = chrome.runtime.getURL('hack.js');
  hackScript.onload = loadHtml;
  hackScript.onerror = () => console.error('Error loading hack.js');
  document.body.appendChild(hackScript);
}

function loadHtml() {
  fetch(chrome.runtime.getURL('chart.html'))
    .then(response => response.text())
    .then(data => {
      const div = document.createElement('div');
      div.innerHTML = data;
      document.body.insertBefore(div, document.body.firstChild);
      initializeChart();
    })
    .catch(error => console.error('Error loading chart.html:', error));
}

function initializeChart() {
  if (typeof setChart === 'function') {
    setChart();
    console.log('ZTE-MU5001-HACK LOADED SUCCESSFULLY!');
  } else {
    console.error('setChart function not found.');
  }
}

if (!document.body.innerText.includes('ZTE-MU5001-HACK')) {
  console.log("INITIALIZING ZTE-MU5001-HACK...");
  loadChartJs();
} else {
  console.log('ZTE-MU5001-HACK DETECTED, SKIPPING...');
}
