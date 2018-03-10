import {Node} from "./Node";
declare var require;
import {h, Component} from 'preact';
import {collectNames} from "../utils";
import {NodeItem} from "../types";

export interface AppProps {
    data: NodeItem[]
}

export class App extends Component<AppProps, {selected: Set<string>}> {

    state = {
        selected: new Set<string>([]),
        collapsed: new Set<string>([]),
        message: null,
        root: {},
        searchTerm: ""
    }

    constructor(props: AppProps) {
        super(props);

        this.state.root ={
            name: "$$root",
            children: props.data,
            data: {type: "root", name: "$$root"}
        };

        // this.state.collapsed = new Set([...collectNames(props.data), '$$root'])
    }

    componentDidMount() {

    }

    render() {
        return (
            <div class="app">
                <div class="action-bar">
                        <div class="controls">
                            <button
                                type="button"
                                onClick={() => this.setState({collapsed: new Set([])})}
                            >Expand all</button>
                            <button
                                type="button"
                                onClick={() => {
                                    this.setState({collapsed: new Set([...collectNames(this.props.data), '$$root'])})
                                }}
                            >Collapse all</button>
                        </div>
                    <div class="search-bar">
                        <label for="Search">Search</label>
                        <input
                            type="text"
                            value={this.state.searchTerm}
                            onKeyup={(e) => this.setState({searchTerm: e.target.value})}
                        />
                    </div>
                </div>
                <div class="node-tree">
                    <Node
                        node={this.state.root}
                        depth={1}
                        selected={this.state.selected}
                        collapsed={this.state.collapsed}
                        searchTerm={this.state.searchTerm}
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
            </div>
        )
    }
}
