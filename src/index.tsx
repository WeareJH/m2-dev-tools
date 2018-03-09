import {h, render} from 'preact';
import {App} from './components/App'

declare var chrome;
//Created a port with background page for continuous message communication
var port = chrome.extension.connect({
    name: "Sample Communication" //Given a Name
});

let root;

port.onMessage.addListener(function (msg) {
    if (msg.type === "ParsedComments") {
        render((
            <App data={msg.payload}/>
        ), document.querySelector('#app'), root);
    } else {
        render((
            <p>Waiting for a page to be scraped</p>
        ), document.querySelector('#app'), root);
    }
});

