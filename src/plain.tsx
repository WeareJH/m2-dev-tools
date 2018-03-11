import {h, render} from 'preact';
import {App} from './components/App'
const nodes = require('../fixtures/large.json');
import {BehaviorSubject} from "rxjs/BehaviorSubject";
const event$ = new BehaviorSubject(nodes);

render((
    <App
        event$={event$}
        hover={(name: string) => {
            // chrome.runtime.sendMessage({type: 'hover', payload: name})
            // console.log('send hover');
        }}
        removeHover={(name: string) => {
            // console.log('remove hover');
        }}
    />
), document.querySelector('#app'));

