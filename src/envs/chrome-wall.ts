import * as Msg from "../messages.types";
import {keyPress} from "../listeners/keypress";
import {Subject} from "rxjs/Subject";

declare var chrome;
//Created a port with background page for continuous message communication

export interface ChromeWall {
    incoming$: Subject<Msg.PanelIncomingMessages>
    outgoing$: Subject<Msg.PanelOutgoingMessages>
}
export function createChromeWall(): ChromeWall {

    const incoming$ = new Subject<Msg.PanelIncomingMessages>();
    const outgoing$ = new Subject<Msg.PanelOutgoingMessages>();

    keyPress().subscribe(x => incoming$.next(x));

    var port = chrome.extension.connect({
        name: "Jh_BlockLogger" //Given a Name
    });

    const wall = {
        listen(listener: (message: Msg.PanelIncomingMessages) => void) {
            port.onMessage.addListener(listener);
        },
        emit(message: Msg.PanelOutgoingMessages) {
            chrome.runtime.sendMessage(message);
        }
    };

    wall.listen((message: Msg.PanelIncomingMessages) => {
        incoming$.next(message);
    });

    outgoing$.subscribe((message) => {
        wall.emit(message);
    });

    return {incoming$, outgoing$};
}

