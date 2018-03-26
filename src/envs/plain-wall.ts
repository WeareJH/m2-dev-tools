import {Msg} from "../messages.types";
import {Subject} from "../rx";
import {ChromeWall} from "./chrome-wall";
import {keyPress} from "../listeners/keypress";

declare var chrome;

//Created a port with background page for continuous message communication
export function createPlainWall(iframe): ChromeWall {

    const incoming$ = new Subject<Msg.PanelIncomingMessages>();
    const outgoing$ = new Subject<Msg.PanelOutgoingMessages>();

    keyPress().subscribe(x => incoming$.next(x));

    return {incoming$, outgoing$};
}

