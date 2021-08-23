window.onmessage = function (e) {
  if (e.data.mes == "loginSuccess") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { mes: "injectCheck" },
        function (response) {
          if (response.status == "not") {
            chrome.runtime.sendMessage(
              { message: "loginSuccess" },
              function (response) {
                if (response === "success") console.log("SUCCESS");
              }
            );
          }
        }
      );
    });
  }
};
