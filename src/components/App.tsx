import * as React from 'react';
import {Node} from "./Node";
declare var require;
import {collectIds} from "../utils";
import {NodeId, NodeItem, NodePath} from "../types";
import {Subject, Subscription} from "../rx";
import {Msg} from "../messages.types";
import {ActionBar} from "./ActionBar";
import * as dlv from "dlv";
import {Observable} from "../rx";

export interface AppProps {
    incoming$: Subject<Msg.PanelIncomingMessages>,
    outgoing$: Subject<Msg.PanelOutgoingMessages>,
    hover(name: string): void
    removeHover(name: string): void
}

export class App extends React.Component<AppProps, any> {
    props: AppProps;
    sub: Subscription | null;
    setState: (...args) => void;
    ref: any;
    state: {
        hovered: Set<string>,
        collapsed: Set<string>,
        selected: {
            id: NodeId | null,
            path: NodePath | null,
        },
        root: NodeItem,
        searchTerm: string,
        inspecting: boolean
        selectionOverlay: boolean
    } = {
        inspecting: false,
        hovered: new Set<NodeId>([]),
        collapsed: new Set<NodeId>([]),
        selected: {id: null, path: null},
        root: {
            name: "$$root",
            children: [],
            data: {type: "root", name: "$$root"},
            hasRelatedElement: false,
            path: [],
            id: "$$root"
        },
        searchTerm: "",
        selectionOverlay: false
    };

    componentDidMount() {
        this.sub = Observable.merge(
            this.props.incoming$
                .filter(x => x.type === Msg.Names.ParsedComments)
                .pluck('payload')
                .do((nodes: NodeItem[]) => {
                    this.setState((prev: App['state']) => {
                        return {
                            hovered: new Set<string>([]),
                            collapsed: new Set<string>([]),
                            selected: {
                                id: null,
                                path: null
                            },
                            inspecting: false,
                            root: {
                                ...prev.root,
                                children: nodes,
                            }
                        }
                    })
                }),
            this.props.incoming$
                .filter(x => x.type === Msg.Names.KeyUp)
                .do(x => console.log(x))
        ).subscribe();

    }

    componentWillUnmount() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }

    selectByName = (id: NodeId, path: NodePath) => {
        this.setState(() => {
            return {
                selected: {
                    id, path,
                }
            }
        });
    }

    render() {
        return (
            <div className="app" ref={(ref) => {this.ref = ref;}}>
                <ActionBar
                    hovered={this.state.hovered}
                    collapsed={this.state.collapsed}
                    selected={this.state.selected}
                    root={this.state.root}
                    searchTerm={this.state.searchTerm}
                    inspecting={this.state.inspecting}
                    selectionOverlay={this.state.selectionOverlay}
                    clearSelected={() => this.setState({selected: {id: null, path: null}})}
                    expandAll={() => this.setState({collapsed: new Set([])})}
                    collapseAll={() => {
                        this.setState(() => ({
                            collapsed: new Set([...collectIds(this.state.root.children), '$$root'])
                        }));
                    }}
                    toggleInspecting={() => {
                        this.setState((prev) => {
                            return {
                                inspecting: !prev.inspecting
                            }
                        }, () => {
                            const msg: Msg.Inspect = {
                                type: Msg.Names.Inspect,
                                payload: this.state.inspecting
                            };
                            this.props.outgoing$.next(msg);
                        });
                    }}
                    toggleSelectionOverlay={(checked: boolean) => {
                        this.setState({selectionOverlay: checked});
                    }}
                    setSearchTerm={(searchTerm: string) => {
                        // console.log(searchTerm);
                        this.setState({searchTerm});
                    }}
                />

              <div className="node-tree">
                    <Node
                        node={this.state.root}
                        depth={1}
                        hovered={this.state.hovered}
                        collapsed={this.state.collapsed}
                        searchTerm={this.state.searchTerm}
                        selected={this.state.selected}
                        select={this.selectByName}
                        addHover={(id: NodeId) => {
                            this.props.hover(id);
                            this.setState(prev => ({
                                hovered: (prev.hovered.add(id), prev.hovered)
                            }))
                        }}
                        removeHover={(id: NodeId) => {
                            this.props.removeHover(id);
                            this.setState(prev => ({
                                hovered: (prev.hovered.delete(id), prev.hovered)
                            }))
                        }}
                        toggle={(id: NodeId) => {
                            this.setState(prev => {
                                if (prev.collapsed.has(id)) {
                                    return {
                                        collapsed: (prev.collapsed.delete(id), prev.collapsed)
                                    }
                                } else {
                                    return {
                                        collapsed: (prev.collapsed.add(id), prev.collapsed)
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
