chrome.browserAction.onClicked.addListener(function (tab) {
  // for the current tab, inject the "inject.js" file & execute it
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "loginSuccess") {
    chrome.tabs.executeScript({
      file: "./src/inject/libraries/jquery.min.js",
    });

    chrome.tabs.executeScript({
      file: "./src/inject/libraries/jquery-ui.min.js",
    });

    chrome.tabs.executeScript({
      file: "./src/inject/libraries/jquery.ui.touch-punch.min.js",
    });

    chrome.tabs.executeScript({
      file: "./src/inject/libraries/tweenMax.min.js",
    });

    chrome.tabs.executeScript({
      file: "./src/inject/libraries/popper.min.js",
    });

    // chrome.tabs.executeScript(tab.ib, {
    //   file: "./src/inject/libraries/jquery-3.3.1.slim.min.js",
    // });

    chrome.tabs.executeScript({
      file: "./src/inject/ui.js",
    });

    chrome.tabs.executeScript({
      file: "./src/inject/functions.js",
    });
    sendResponse("success");
    return true;
  }
  return true;
});
