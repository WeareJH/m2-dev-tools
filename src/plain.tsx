import {createWall} from "./plain-wall";
import {createApp} from "./index";
import {Msg} from "./messages.types";
// const nodes = require('../fixtures/large.json');
const iframe = window.frames[0];
const {incoming$, outgoing$} = createWall(iframe);
const app = createApp({incoming$, outgoing$});
// console.log(app);

// const msg: Msg.ParsedComments = {
//     type: Msg.Names.ParsedComments,
//     payload: []
// };

// setTimeout(() => incoming$.next(msg), 1000);

// incoming$.next(msg);
