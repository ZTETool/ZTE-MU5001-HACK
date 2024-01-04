if (!document.body.innerText.includes('ZTE-MU5001-HACK')) {
  var scriptElement = document.createElement('script');
  scriptElement.src = chrome.runtime.getURL('hack.js');
  scriptElement.onload = function() {
    console.log('ZTE-MU5001-HACK LOADED SUCCESSFULLY!');
  };
  scriptElement.onerror = function() {
    console.error('FAILED TO LOAD ZTE-MU5001-HACK!');
  };

  document.head.appendChild(scriptElement);
} else {
  console.log('ZTE-MU5001-HACK DETECTED, SKIPPING...');
}
