if (!document.body.innerText.includes('ZTE MU5001 BROWSER HACK')) {
  var scriptElement = document.createElement('script');
  scriptElement.src = chrome.runtime.getURL('hack_v2.js');
  scriptElement.onload = function() {
    console.log('ZTE MU5001 BROWSER HACK LOADED SUCCESSFULLY!');
  };
  scriptElement.onerror = function() {
    console.error('FAILED TO LOAD ZTE MU5001 BROWSER HACK!');
  };

  document.head.appendChild(scriptElement);
} else {
  console.log('ZTE MU5001 BROWSER HACK DETECTED, SKIPPING...');
}
