chrome.extension.onConnect.addListener(function (port) {
    chrome.tabs.query({}, function (tabs) {
        for (var tab in tabs) {
            chrome.tabs.sendMessage(tabs[tab].id, { name: "scrape" });
        }
    });
    chrome.extension.onMessage.addListener(function (message) {
        port.postMessage(message);
    });
});
