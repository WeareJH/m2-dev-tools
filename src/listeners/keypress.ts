import * as Msg from "../messages.types";
import {Observable} from "rxjs/Observable";

export function keyPress() {
    return Observable.create(obs => {

        const arrows = new Set([
            Msg.KeyCodes.Left,
            Msg.KeyCodes.Up,
            Msg.KeyCodes.Right,
            Msg.KeyCodes.Down,
        ]);

        window.addEventListener('keydown', function(evt) {
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
            evt.stopPropagation();

            const msg: Msg.KeyUp = {
                type: Msg.Names.KeyUp,
                payload: evt.keyCode
            };

            obs.next(msg);

        }, true);
    });
}
