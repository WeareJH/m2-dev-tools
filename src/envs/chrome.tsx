import {createChromeWall} from "./chrome-wall";
import {createApp} from "../index";

const {incoming$, outgoing$} = createChromeWall();
const app = createApp({incoming$, outgoing$});
