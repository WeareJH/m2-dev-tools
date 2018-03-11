chrome.extension.onConnect.addListener(function (port) {
    sendToTabs({type: "scrape"});
    chrome.extension.onMessage.addListener(function (message) {
        switch(message.type) {
            case "Ping": {
                return sendToTabs({type: "scrape"});
            }
            case "ParsedComments": {
                return port.postMessage(message);
            }
            case "hover": {
                return sendToTabs(message);
            }
            case "inspect": {
                // console.log(message);
                return sendToTabs(message);
            }
        }
    });
});

function sendToTabs(payload) {
    chrome.tabs.query({}, function (tabs) {
        for (let tab in tabs) {
            chrome.tabs.sendMessage(tabs[tab].id, payload);
        }
    });
}