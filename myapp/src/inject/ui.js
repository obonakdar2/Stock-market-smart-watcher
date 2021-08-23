console.log("omid UI Preparing...");
// Append CSS File to head
$("head").append(
  '<link href="' +
    chrome.extension.getURL("src/inject/ui/css/style.css") +
    '" rel="stylesheet">'
);
$("head").append(
  '<link href="' +
    chrome.extension.getURL("src/inject/ui/css/jquery-ui.css") +
    '" rel="stylesheet">'
);

var omid;

$(document).ready(function (event) {
  if (!omid) {
    omid = true;
    $.get(
      chrome.extension.getURL("src/inject/ui/sidebar.html"),
      function (data) {
        $("body").append(data);
      }
    );
  } else {
    return;
  }
});

// Inject HTML Content
// Append sidebar
