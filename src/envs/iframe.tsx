import {createApp} from "../index";
import {createIframeWall} from "./iframe-wall";
const iframe = window.frames[0];
const {incoming$, outgoing$} = createIframeWall(iframe);
const app = createApp({incoming$, outgoing$});

// console.log(app);
// const nodes = require('../fixtures/large.json');
// const msg: Msg.ParsedComments = {
//     type: Msg.Names.ParsedComments,
//     payload: []
// };
// setTimeout(() => incoming$.next(msg), 1000);
// incoming$.next(msg);
