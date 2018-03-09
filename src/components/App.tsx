import {Node} from "./Node";
declare var require;
import {h, Component} from 'preact';
const nodes = require('../../fixtures/large.json');

export class App extends Component<any, {selected: Set<string>}> {

    state = {
        selected: new Set<string>([]),
        message: null,
        root: {}
    }

    constructor(props) {
        super(props);

        this.state.root ={
            name: "$$root",
            children: nodes,
            data: {type: "root", name: "$$root"}
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div class="node-tree">
                <Node
                    node={this.state.root}
                    depth={1}
                    selected={this.state.selected}
                    addHover={(label) => {
                        this.setState(prev => ({
                            selected: (prev.selected.add(label), prev.selected)
                        }))
                    }}
                    removeHover={(label) => {
                        this.setState(prev => ({
                            selected: (prev.selected.delete(label), prev.selected)
                        }))
                    }}
                />
            </div>
        )
    }
}
