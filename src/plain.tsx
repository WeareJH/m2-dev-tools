import {h, render} from 'preact';
import {App} from './components/App'
const nodes = require('../fixtures/large.json');

render((
    <App data={nodes}/>
), document.querySelector('#app'));

