declare var chrome;

import {Inputs} from "../types";
import * as Msg from "../messages.types";
import {parseComments} from "./content-scripts/parseComments";
import {incomingMessageHandler} from "./content-scripts/incomingMessageHandler";

/**
 * Run over every page to collect comments
 */
const [elemMap, reverseElemMap, results] = parseComments(document);

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

const inputs: Inputs = {
    document,
    results,
    wall,
    elemMap,
    reverseElemMap
};

/**
 * Only add listeners if results were found
 */
wall.listen(incomingMessageHandler(inputs));

/**
 * Always ping dev-tools on every page load
 */
wall.emit({type: Msg.Names.Ping});
