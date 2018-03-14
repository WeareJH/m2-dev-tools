import {Inputs} from "../inject";
import {Msg} from "../../messages.types";
import {Overlay} from "../Overlay";
import {removeComments} from "./stripComments";

/**
 * This function returns a handler for message coming from the background script.
 * @param {Inputs} inputs
 * @returns {(message: Msg.InjectIncomingActions) => void}
 */
export function incomingMessageHandler(inputs: Inputs) {

    let overlay;
    let inspect = false;

    window.addEventListener('mouseover', function(evt) {
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
    }, true);

    return function(message: Msg.InjectIncomingActions) {
        console.log(message);
        switch (message.type) {
            case Msg.Names.StripComments: {
                removeComments(document);
                break;
            }
            case Msg.Names.Scrape: {
                inputs.wall.emit({type: Msg.Names.ParsedComments, payload: inputs.results});
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
