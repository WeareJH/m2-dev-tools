import {createWall} from "./chrome-wall";
import {createApp} from "./index";

const {incoming$, outgoing$} = createWall();
const app = createApp({incoming$, outgoing$});
