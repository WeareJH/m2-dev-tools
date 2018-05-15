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

    const msg: Msg.DomHover = {
        type: Msg.Names.DomHover,
        payload: '1.children.0'
    };

    const msg2: Msg.DomHover = {
        type: Msg.Names.DomHover,
        payload: '2.children.1.children.4.children.0.children.1'
    };

    // setTimeout(() => {
    //     incoming$.next(msg);
    // }, 2000);
    // setTimeout(() => {
    //     incoming$.next(msg2);
    // }, 4000);


    return {incoming$, outgoing$};
}

