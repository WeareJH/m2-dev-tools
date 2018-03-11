import {Node} from "./Node";
declare var require;
import {h, Component} from 'preact';
import {collectNames} from "../utils";
import {NodeItem} from "../types";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

export interface AppProps {
    event$: Subject<NodeItem[]>,
    hover(name: string): void
    removeHover(name: string): void
}

export class App extends Component<AppProps, {selected: Set<string>}> {

    sub: Subscription|null;
    state: {
        selected: Set<string>,
        collapsed: Set<string>,
        root: NodeItem,
        searchTerm: string
    } = {
        selected: new Set<string>([]),
        collapsed: new Set<string>([]),
        root: {
            name: "$$root",
            children: [],
            data: {type: "root", name: "$$root"},
            hasRelatedElement: false,
        },
        searchTerm: ""
    };

    componentDidMount() {
        this.sub = this.props.event$.subscribe((nodes: NodeItem[]) => {
            this.setState(prev => {
                return {
                    root: {
                        ...prev.root,
                        children: nodes,
                    }
                }
            })
        });
    }

    componentWillUnmount() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }

    render() {
        return (
            <div class="app">
                <div class="action-bar">
                        <div class="controls">
                            <button
                                type="button"
                                onClick={() => this.setState(prev => ({collapsed: new Set([])}))}
                            >Expand all</button>
                            <button
                                type="button"
                                onClick={() => {
                                    this.setState(prev => ({
                                        collapsed: new Set([...collectNames(this.state.root.children), '$$root'])
                                    }));
                                }}
                            >Collapse all</button>
                        </div>
                    <div class="search-bar">
                        <label for="Search">Search</label>
                        <input
                            type="text"
                            value={this.state.searchTerm}
                            onKeyUp={(e: any) => this.setState({searchTerm: e.target.value} as any)}
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
                        addHover={(label: string) => {
                            this.props.hover(label);
                            this.setState(prev => ({
                                selected: (prev.selected.add(label), prev.selected)
                            }))
                        }}
                        removeHover={(label) => {
                            this.props.removeHover(label);
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
