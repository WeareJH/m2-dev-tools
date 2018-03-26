import {Msg} from "../messages.types";
import {Subject} from "../rx";
import {ChromeWall} from "./chrome-wall";
import {keyPress} from "../listeners/keypress";

declare var chrome;

//Created a port with background page for continuous message communication
export function createIframeWall(iframe): ChromeWall {

    const incoming$ = new Subject<Msg.PanelIncomingMessages>();
    const outgoing$ = new Subject<Msg.PanelOutgoingMessages>();

    keyPress().subscribe(x => incoming$.next(x));

    const wall = {
        listen(listener: (message: Msg.PanelIncomingMessages) => void) {
            iframe.addEventListener("message", listener, false);
        },
        emit(message: Msg.PanelOutgoingMessages) {
            iframe.postMessage(message, window.location.origin);
        }
    };

    wall.listen((event: any) => {
        incoming$.next(event.data);
    });

    outgoing$.subscribe((message) => {
        wall.emit(message);
    });

    return {incoming$, outgoing$};
}

