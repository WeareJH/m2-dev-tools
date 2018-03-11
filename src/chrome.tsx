import {h, render} from 'preact';
import {App} from './components/App'
import {Subject} from 'rxjs/Subject';
const event$ = new Subject();

declare var chrome;
//Created a port with background page for continuous message communication
var port = chrome.extension.connect({
    name: "Jh_BlockLogger" //Given a Name
});

port.onMessage.addListener(function (msg) {
    if (msg.type === "ParsedComments") {
        event$.next(msg.payload);
    }
});

event$.subscribe((message) => {
    if (message.type === 'inspect') {
        chrome.runtime.sendMessage(message);
    }
})

render((
    <App
        event$={event$}
        hover={(name: string) => {
            chrome.runtime.sendMessage({type: 'hover', payload: name})
        }}
        removeHover={(name: string) => {
            chrome.runtime.sendMessage({type: 'remove-hover'})
        }}
    />
), document.querySelector('#app'));
