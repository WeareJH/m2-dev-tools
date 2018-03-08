import {h, render} from 'preact';
import {App} from './components/App'

render((
    <App />
), document.querySelector('#app'), (document.querySelector('#app') as any).firstChild);
