chrome.extension.onConnect.addListener(function (port) {
    requestDataFromAll();
    chrome.extension.onMessage.addListener(function (message) {
        console.log('Background message received:', message);
        switch(message.type) {
            case "Ping": {
                return requestDataFromAll();
            }
            case "ParsedComments": {
                return port.postMessage(message);
            }
        }
    });
});

function requestDataFromAll() {
    chrome.tabs.query({}, function (tabs) {
        for (let tab in tabs) {
            chrome.tabs.sendMessage(tabs[tab].id, {name: "scrape"});
        }
    });
}