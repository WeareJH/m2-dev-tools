import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App'
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pluck';
const incoming$ = new Subject();
const outgoing$ = new Subject();

declare var chrome;
//Created a port with background page for continuous message communication
var port = chrome.extension.connect({
    name: "Jh_BlockLogger" //Given a Name
});

port.onMessage.addListener(function (msg) {
    incoming$.next(msg);
});

outgoing$.subscribe((message) => {
    chrome.runtime.sendMessage(message);
});

ReactDOM.render((
    <App
        incoming$={incoming$}
        outgoing$={outgoing$}
        hover={(name: string) => {
            chrome.runtime.sendMessage({type: 'hover', payload: name})
        }}
        removeHover={(name: string) => {
            chrome.runtime.sendMessage({type: 'remove-hover'})
        }}
    />
), document.querySelector('#app'));
