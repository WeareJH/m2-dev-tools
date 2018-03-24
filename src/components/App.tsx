import * as React from 'react';
import {Node} from "./Node";
import * as dlv from "dlv";

declare var require;
import {collectIds, flattenNodes, getSearchNode, getSearchNodes} from "../utils";
import {NodeId, NodeItem, NodeItems, NodeItemShort, NodePath} from "../types";
import {Observable} from "../rx";
import {Subject, Subscription} from "../rx";
import {Msg, ScrapeConfiguration} from "../messages.types";
import {ActionBar} from "./ActionBar";
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
        selected: {
            node: NodeItemShort | null,
            head: boolean,
            tail: boolean,
        } | null,
        root: NodeItem,
        searchTerm: string,
        inspecting: boolean
        selectionOverlay: boolean,
        stripComments: boolean,
        flatNodes: NodeItems | null,
        baseNodes: NodeItem[],
        baseFlatNodes: NodeItems | null,

    } = {
        inspecting: false,
        collapsed: new Set<NodeId>([]),
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
        stripComments: true,
        flatNodes: null,
        baseNodes: [],
        baseFlatNodes: null,
    };

    componentDidMount() {
        this.sendScrape();
        this.sub = Observable.merge(
            this.props.incoming$
                .filter(x => x.type === Msg.Names.ParsedComments)
                .pluck('payload')
                .do((nodes: NodeItem[]) => {
                    this.setState({
                        baseNodes: nodes,
                        baseFlatNodes: flattenNodes(nodes)
                    }, () => {
                        this.resetNodes(nodes);
                    });
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
                }),
            this.props.incoming$
                .filter(x => x.type === Msg.Names.Ping)
                .do(() => this.sendScrape())
        ).subscribe();

    }

    sendScrape = () => {
        const config: ScrapeConfiguration = {
            stripComments: this.state.stripComments,
        };
        const scrapeMessage: Msg.Scrape = {type: Msg.Names.Scrape, payload: config};
        this.props.outgoing$.next(scrapeMessage);
    };

    resetNodes(nodes: NodeItem[]) {
        this.setState((prev: App['state']) => {
            const root = {
                ...prev.root,
                children: nodes,
            };
            const flattened = flattenNodes(nodes);
            const collapsedIds = Object.keys(flattened).filter(x => x!== '$$root');
            return {
                collapsed: new Set<string>(collapsedIds),
                selected: {
                    node: null,
                    head: false,
                    tail: false,
                },
                inspecting: false,
                flatNodes: flattened,
                root,
            }
        })
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

    hoverById = (id: NodeId) => {
        const msg: Msg.Hover = {
            type: Msg.Names.Hover,
            payload: id
        };
        this.props.outgoing$.next(msg);
    }

    render() {
        const rootHasChildren = this.state.root.children.length > 0;
        // const hasSearchTerm = this.state.searchTerm.length > 0;
        const rootNode = this.state.root;

        return (
            <div className="app" ref={(ref) => {
                this.ref = ref;
            }}>
                <ActionBar
                    collapsed={this.state.collapsed}
                    selected={this.state.selected}
                    root={this.state.root}
                    searchTerm={this.state.searchTerm}
                    inspecting={this.state.inspecting}
                    flatNodes={this.state.flatNodes}
                    selectionOverlay={this.state.selectionOverlay}
                    stripComments={this.state.stripComments}
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
                    toggleStripComments={(checked: boolean) => {
                        this.setState({stripComments: checked});
                    }}
                    toggleSelectionOverlay={(checked: boolean) => {
                        this.setState({selectionOverlay: checked});
                    }}
                    setSearchTerm={(searchTerm: string) => {
                        if (searchTerm === '') {
                            this.resetNodes(this.state.baseNodes);
                        } else {
                            this.resetNodes(getSearchNodes(searchTerm, this.state.baseFlatNodes, this.state.baseNodes));
                        }
                        this.setState({searchTerm});
                    }}
                />
                {!rootHasChildren && (
                    <div className="node-tree-pending">
                        <p>Waiting for nodes...</p>
                    </div>
                )}
                {rootHasChildren && (
                    <div className="node-tree">
                        <Node
                            node={rootNode}
                            depth={1}
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
                )}
            </div>
        )
    }
}
