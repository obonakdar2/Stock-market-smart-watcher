chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.mes == "injectCheck") {
    const preel = document.getElementById("chortkeSidebar");
    if (!preel) {
      sendResponse({ status: "not" });
    } else {
      sendResponse({ status: "yes" });
    }
  }
});
