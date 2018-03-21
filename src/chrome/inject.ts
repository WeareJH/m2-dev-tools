declare var chrome;

import {NodeItem} from "../types";
import {Msg} from "../messages.types";
import {parseComments} from "./content-scripts/parseComments";
import {incomingMessageHandler} from "./content-scripts/incomingMessageHandler";

/**
 * Run over every page to collect comments
 */
const [elemMap, , results] = parseComments(document);

/**
 * Common communication interface with typed messages
 */
const wall = {
    listen(listener: (message: Msg.InjectIncomingActions) => void) {
        chrome.extension.onMessage.addListener(listener);
    },
    emit(message: Msg.InjectOutgoingActions) {
        chrome.extension.sendMessage(message);
    }
};

/**
 * Side effecting items to pass to functions
 */
export interface Inputs {
    document: Document,
    results: NodeItem[],
    wall: {listen: any, emit: any}
    elemMap: any
}

const inputs: Inputs = {
    document,
    results,
    wall,
    elemMap,
};

/**
 * Only add listeners if results were found
 */
if (results && results.length) {
    wall.listen(incomingMessageHandler(inputs));
}

/**
 * Always ping dev-tools on every page load
 */
wall.emit({type: Msg.Names.Ping});

// if (results && results.length) {
// window.addEventListener('mouseover', function(evt) {
//     if (!inspect) {
//         return;
//     }
//     evt.preventDefault();
//     evt.stopPropagation();
//     evt.cancelBubble = true;
//     if (reverseElemMap.has(evt.target)) {
//         const data = reverseElemMap.get(evt.target);
//         if (!overlay) {
//             overlay = new Overlay(window);
//         }
//         overlay.inspect(evt.target, data.type, data.name);
//     }
// }, true);
// } else {
//     console.log('no results found');
// }
