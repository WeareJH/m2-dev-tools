import {createPlainWall} from "./plain-wall";
import {createApp} from "../index";
import {Msg} from "../messages.types";
const iframe = window.frames[0];
const {incoming$, outgoing$} = createPlainWall(iframe);
const app = createApp({incoming$, outgoing$});

// console.log(app);
const nodes = require('../../fixtures/large.json');
const msg: Msg.ParsedComments = {
    type: Msg.Names.ParsedComments,
    payload: nodes
};
setTimeout(() => incoming$.next(msg), 1000);
// incoming$.next(msg);
