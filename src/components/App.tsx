import {Node} from "./Node";
declare var require;
import {h, Component} from 'preact';
const nodes = require('../../fixtures/large.json');

function collectNames(nodes) {
    const names = [];
    nodes.forEach(par);
    return names;
    function par(node) {
        if (node.children && node.children.length) {
            names.push(node.name);
            node.children.forEach(par);
        }
    }
}

export class App extends Component<any, {selected: Set<string>}> {

    state = {
        selected: new Set<string>([]),
        collapsed: new Set<string>([]),
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

        this.state.collapsed = new Set([...collectNames(nodes)])
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
                    collapsed={this.state.collapsed}
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
                    toggle={(label) => {
                        this.setState(prev => {
                            if (prev.collapsed.has(label)) {
                                return {
                                    collapsed: (prev.collapsed.delete(label), prev.collapsed)
                                }
                            } else {
                                return {
                                    collapsed: (prev.collapsed.add(label), prev.collapsed)
                                }
                            }
                        })
                    }}
                />
            </div>
        )
    }
}
