import {Msg} from "./messages.types";
import {Subject} from "./rx";
import {ChromeWall} from "./chrome-wall";

declare var chrome;

//Created a port with background page for continuous message communication
export function createWall(): ChromeWall {

    const incoming$ = new Subject<Msg.PanelIncomingMessages>();
    const outgoing$ = new Subject<Msg.PanelOutgoingMessages>();

    const body = document.body;
    const arrows = new Set([
        Msg.KeyCodes.Left,
        Msg.KeyCodes.Up,
        Msg.KeyCodes.Right,
        Msg.KeyCodes.Down,
    ]);

    document.addEventListener('keyup', function(evt) {
        if (arrows.has(evt.keyCode)) {
            if (evt.target === body) {
                const msg: Msg.KeyUp = {
                    type: Msg.Names.KeyUp,
                    payload: evt.keyCode
                }
                incoming$.next(msg);
            }
        }
    }, true);

    return {incoming$, outgoing$};
}

