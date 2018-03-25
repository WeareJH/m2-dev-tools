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

    wall.listen((message: Msg.BackgroundMessages) => {
        switch(message.type) {
            case Msg.Names.StripComments: {
                return wall.emitTab(message);
            }
            case Msg.Names.Ping: {
                wall.emitPanel(message);
                break;
            }
            case Msg.Names.DomHover: {
                wall.emitPanel(message);
                break;
            }
            case Msg.Names.Scrape: {
                return wall.emitTab(message);
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
