declare var chrome;
import {Msg} from "../messages.types";

chrome.extension.onConnect.addListener(function (port) {
    const wall = {
        listen(listener: (message: Msg.BackgroundMessages) => void) {
            chrome.extension.onMessage.addListener(listener);
        },
        emitPanel(message: Msg.PanelIncomingMessages) {
            port.postMessage(message);
        },
        emitTab(message: Msg.BackgroundToContent) {
            chrome.tabs.query({}, function (tabs) {
                for (let tab in tabs) {
                    chrome.tabs.sendMessage(tabs[tab].id, message);
                }
            });
        }
    };

    const msg: Msg.Scrape = {type: Msg.Names.Scrape};
    wall.emitTab(msg);
    wall.listen((message: Msg.BackgroundMessages) => {
        switch(message.type) {
            case Msg.Names.StripComments: {
                return wall.emitTab(message);
            }
            case Msg.Names.Ping: {
                const msg: Msg.Scrape = {type: Msg.Names.Scrape};
                wall.emitTab(msg);
                wall.emitPanel(message);
                break;
            }
            case Msg.Names.ParsedComments: {
                return wall.emitPanel(message);
            }
            case Msg.Names.Hover: {
                return wall.emitTab(message);
            }
            case Msg.Names.Inspect: {
                return wall.emitTab(message);
            }
        }
    });
});