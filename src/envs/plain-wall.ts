import * as Msg from "../messages.types";
import {ChromeWall} from "./chrome-wall";
import {keyPress} from "../listeners/keypress";
import {Subject} from "rxjs/Subject";

declare var chrome;

//Created a port with background page for continuous message communication
export function createPlainWall(iframe): ChromeWall {

    const incoming$ = new Subject<Msg.PanelIncomingMessages>();
    const outgoing$ = new Subject<Msg.PanelOutgoingMessages>();

    keyPress().subscribe(x => incoming$.next(x));

    return {incoming$, outgoing$};
}

