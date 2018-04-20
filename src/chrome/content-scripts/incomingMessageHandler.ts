import * as Msg from "../../messages.types";
import {Overlay} from "../Overlay";
import {removeComments} from "./stripComments";
import {parseComments} from "./parseComments";
import {Inputs} from "../../types";

/**
 * This function returns a handler for message coming from the background script.
 * @param {Inputs} inputs
 * @param transform
 */
export function incomingMessageHandler(inputs: Inputs, transform = (msg) => msg) {

    let overlay;
    let inspect = false;

    window.addEventListener('mouseover', function(evt) {
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
    }, true);

        // window.addEventListener('mouseover', function(evt) {
        //     // if (!inspect) {
        //     //     return;
        //     // }
        //     evt.preventDefault();
        //     evt.stopPropagation();
        //     evt.cancelBubble = true;
        //     if (inputs.reverseElemMap.has(evt.target)) {
        //         const data = inputs.reverseElemMap.get(evt.target);
        //         const msg: Msg.DomHover = {
        //             type: Msg.Names.DomHover,
        //             payload: data.id
        //         };
        //         if (!overlay) {
        //             overlay = new Overlay(window);
        //         }
        //         overlay.inspect(evt.target, data.type, data.name);
        //         inputs.wall.emit(msg);
        //     }
        // }, true);

    return function(input: Msg.InjectIncomingActions) {
        const message = transform(input);
        switch (message.type) {
            case Msg.Names.Scrape: {
                const [, , results] = parseComments(document);

                const msg: Msg.ParsedComments = {
                    type: Msg.Names.ParsedComments,
                    payload: results
                };
                inputs.wall.emit(msg);

                if (message.payload.stripComments) {
                    removeComments(document);
                }
                break;
            }
            case Msg.Names.Inspect: {
                inspect = message.payload;
                if (!inspect && overlay) {
                    overlay.remove();
                    overlay = null;
                }
                break;
            }
            case Msg.Names.Hover: {
                if (inputs.elemMap.has(message.payload)) {
                    const {element, data} = inputs.elemMap.get(message.payload);
                    if (!overlay) {
                        overlay = new Overlay(window);
                    }
                    overlay.inspect(element, data.type, data.name);
                } else {
                    if (overlay) {
                        overlay.remove();
                        overlay = null;
                    }
                }
                break;
            }
        }
    }
}
