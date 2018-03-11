import * as React from 'react';
import {Node} from "./Node";

declare var require;
import {collectNames, pullData} from "../utils";
import {NodeItem} from "../types";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";


export interface AppProps {
    incoming$: Subject<{ type: string, payload: any }>,
    outgoing$: Subject<{ type: string, payload: any }>,

    hover(name: string): void

    removeHover(name: string): void
}

export class App extends React.Component<any, any> {
    props: AppProps;
    sub: Subscription | null;
    state: {
        hovered: Set<string>,
        collapsed: Set<string>,
        selected: Set<string>,
        root: NodeItem,
        searchTerm: string,
        inspecting: boolean
        selectionOverlay: boolean
    } = {
        inspecting: false,
        hovered: new Set<string>([]),
        collapsed: new Set<string>([]),
        selected: new Set<string>([]),
        root: {
            name: "$$root",
            children: [],
            data: {type: "root", name: "$$root"},
            hasRelatedElement: false,
        },
        searchTerm: "",
        selectionOverlay: false
    };

    componentDidMount() {
        this.sub = this.props.incoming$
            .filter(x => x.type === 'ParsedComments')
            .pluck('payload')
            .subscribe((nodes: NodeItem[]) => {
                this.setState(prev => {
                    return {
                        hovered: new Set<string>([]),
                        collapsed: new Set<string>([]),
                        selected: new Set<string>([]),
                        inspecting: false,
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

    selectByName = (label: string) => {
        this.setState((prev) => {
            if (prev.selected.has(label)) {
                return { selected: (prev.selected.delete(label), prev.selected) }
            }
            // todo multiple selections?
            return { selected: new Set([label]) }
        });
    }

    render() {
        const hasSelection = this.state.selected.size > 0;
        const selectionOverlay = this.state.selectionOverlay;
        const data = (this.state.root && hasSelection)
            ? pullData(this.state.root.children, Array.from(this.state.selected)[0])
            : {};

        return (
            <div className="app">
                <div className="action-bar">
                    {hasSelection && selectionOverlay && (
                        <div className="info-window">
                            <button
                                type="button"
                                onClick={() => {
                                    this.setState({selected: new Set([])})
                                }}
                            >
                                Close
                            </button>
                            <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
                        </div>
                    )}
                    <div className="controls">
                        <button
                            type="button"
                            className="controls__button"
                            onClick={() => this.setState(() => ({collapsed: new Set([])}))}
                        >Expand all
                        </button>
                        <button
                            type="button"
                            className="controls__button"
                            onClick={() => {
                                this.setState(() => ({
                                    collapsed: new Set([...collectNames(this.state.root.children), '$$root'])
                                }));
                            }}
                        >Collapse all
                        </button>
                        <button
                            type="button"
                            className="controls__button"
                            onClick={() => {
                                this.setState((prev) => {
                                    return {
                                        inspecting: !prev.inspecting
                                    }
                                }, () => this.props.outgoing$.next({type: 'inspect', payload: this.state.inspecting}));

                            }}
                        >{this.state.inspecting ? 'Stop inspecting' : 'Inspect page'}</button>
                        <label htmlFor="check">
                            <input
                                type="checkbox"
                                id="check"
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    this.setState({selectionOverlay: checked});
                                }}
                            />
                            Selection Overlay
                        </label>
                    </div>
                    <div className="search-bar">
                        <label htmlFor="search" className="search-bar__label">Search</label>
                        <input
                            type="text"
                            id="search"
                            value={this.state.searchTerm}
                            onChange={(e: any) => this.setState({searchTerm: e.target.value} as any)}
                        />
                    </div>
                </div>
                <div className="node-tree">
                    <Node
                        node={this.state.root}
                        depth={1}
                        hovered={this.state.hovered}
                        collapsed={this.state.collapsed}
                        searchTerm={this.state.searchTerm}
                        selected={this.state.selected}
                        select={this.selectByName}
                        addHover={(label: string) => {
                            this.props.hover(label);
                            this.setState(prev => ({
                                hovered: (prev.hovered.add(label), prev.hovered)
                            }))
                        }}
                        removeHover={(label) => {
                            this.props.removeHover(label);
                            this.setState(prev => ({
                                hovered: (prev.hovered.delete(label), prev.hovered)
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
