import * as React from 'react';
import {Node} from "./Node";

declare var require;
import {collectIds, flattenNodes, flattenObjectByProp} from "../utils";
import {NodeId, NodeItem, NodeItems, NodeItemShort, NodePath} from "../types";
import {Observable} from "../rx";
import {Subject, Subscription} from "../rx";
import {Msg} from "../messages.types";
import {ActionBar} from "./ActionBar";
import * as dlv from "dlv";
import {keyPresses} from "./keypresses";

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
        collapsed: Set<string>,
        hovered: {
            node: NodeItemShort | null,
            head: boolean,
            tail: boolean,
        } | null,
        selected: {
            node: NodeItemShort | null,
            head: boolean,
            tail: boolean,
        } | null,
        root: NodeItem,
        searchTerm: string,
        inspecting: boolean
        selectionOverlay: boolean,
        flatNodes: NodeItems | null
    } = {
        inspecting: false,
        collapsed: new Set<NodeId>([]),
        hovered: {node: null, head: false, tail: false},
        selected: {node: null, head: false, tail: false},
        root: {
            name: "$$root",
            children: [],
            data: {type: "root", name: "$$root"},
            hasRelatedElement: false,
            path: [],
            id: "$$root"
        },
        searchTerm: "",
        selectionOverlay: false,
        flatNodes: null
    };

    componentDidMount() {
        this.sub = Observable.merge(
            this.props.incoming$
                .filter(x => x.type === Msg.Names.ParsedComments)
                .pluck('payload')
                .do((nodes: NodeItem[]) => {
                    this.setState((prev: App['state']) => {
                        const root = {
                            ...prev.root,
                            children: nodes,
                        };
                        return {
                            hovered: {
                                node: null,
                                head: false,
                                tail: false,
                            },
                            collapsed: new Set<string>(nodes.map(x => x.id)),
                            selected: {
                                node: null,
                                head: false,
                                tail: false,
                            },
                            inspecting: false,
                            flatNodes: flattenNodes(nodes),
                            root,
                        }
                    })
                }),
            this.props.incoming$
                .filter(x => x.type === Msg.Names.KeyUp)
                .groupBy(x => x.payload)
                .mergeMap(obs => {
                    return keyPresses[obs.key as number](obs, {
                        state$: Observable.of(this.state),
                        getState: () => this.state
                    });
                })
                .do(x => {
                    this.setState(x);
                })
        ).subscribe();

    }

    componentWillUnmount() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }

    selectById = (id: NodeId, path: NodePath, pos: { head: boolean, tail: boolean }) => {
        this.setState((prev: App['state']) => {
            const subject = prev.flatNodes[id];
            return {
                selected: {
                    node: subject,
                    ...pos
                }
            }
        });
    }

    hoverById = (id: NodeId, path: NodePath, pos: { head: boolean, tail: boolean }) => {
        this.setState((prev: App['state']) => {
            const subject = prev.flatNodes[id];
            return {
                hovered: {
                    node: subject,
                    ...pos
                }
            }
        });
    }

    render() {
        return (
            <div className="app" ref={(ref) => {
                this.ref = ref;
            }}>
                <ActionBar
                    hovered={this.state.hovered}
                    collapsed={this.state.collapsed}
                    selected={this.state.selected}
                    root={this.state.root}
                    searchTerm={this.state.searchTerm}
                    inspecting={this.state.inspecting}
                    flatNodes={this.state.flatNodes}
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
                        select={this.selectById}
                        addHover={this.hoverById}
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
