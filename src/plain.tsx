import {createWall} from "./plain-wall";
import {createApp} from "./index";

const {incoming$, outgoing$} = createWall();
const app = createApp({incoming$, outgoing$});

// incoming$.next({type: 'ParsedComments', payload: nodes});
