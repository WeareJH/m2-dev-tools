import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App'
import {Msg} from "./messages.types";

const css = require("../scss/core.scss");

export function createApp(wall) {
    const {incoming$, outgoing$} = wall;
    return ReactDOM.render((
        <App
            incoming$={incoming$}
            outgoing$={outgoing$}
            hover={(name: string) => {
                const msg: Msg.Hover = {
                    type: Msg.Names.Hover,
                    payload: name
                };
                outgoing$.next(msg);
            }}
            removeHover={() => {
                outgoing$.next({type: Msg.Names.RemoveHover});
            }}
        />
    ), document.querySelector('#app'));
}

