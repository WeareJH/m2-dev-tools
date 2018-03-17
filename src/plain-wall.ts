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

    window.addEventListener('keyup', function(evt) {
        if (window.document.activeElement !== window.document.body) {
            return;
        }

        if (evt.shiftKey || evt.metaKey) {
            return;
        }

        if (!arrows.has(evt.keyCode)) {
            return;
        }

        evt.preventDefault();

        const msg: Msg.KeyUp = {
            type: Msg.Names.KeyUp,
            payload: evt.keyCode
        };

        incoming$.next(msg);

    }, true);

    return {incoming$, outgoing$};
}

