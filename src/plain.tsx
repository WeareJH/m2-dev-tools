import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App'
const nodes = require('../fixtures/large.json');
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pluck';
const incoming$ = new Subject();
const outgoing$ = new Subject();
const event$ = new BehaviorSubject(nodes);

ReactDOM.render((
    <App
        event$={event$}
        incoming$={incoming$}
        outgoing$={outgoing$}
        hover={(name: string) => {
            // chrome.runtime.sendMessage({type: 'hover', payload: name})
            // console.log('send hover');
        }}
        removeHover={(name: string) => {
            // console.log('remove hover');
        }}
        componentDidCatch={(err) => {
            console.log(err);
        }}
    />
), document.querySelector('#app'));

incoming$.next({type: 'ParsedComments', payload: nodes});
