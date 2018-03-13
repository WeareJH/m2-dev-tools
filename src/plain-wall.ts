import {Msg} from "./messages.types";
import {Subject} from "./rx";
import {ChromeWall} from "./chrome-wall";

declare var chrome;

//Created a port with background page for continuous message communication
export function createWall(): ChromeWall {

    const incoming$ = new Subject<Msg.PanelIncomingMessages>();
    const outgoing$ = new Subject<Msg.PanelOutgoingMessages>();

    return {incoming$, outgoing$};
}

