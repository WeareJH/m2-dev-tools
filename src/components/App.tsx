import * as React from 'react';
import {Node} from "./Node";

declare var require;
import {collectIds, flattenNodes, getRootNode, getSearchNodes, ROOT_ID} from "../utils";
import {NodeId, NodeItem, NodeItems, NodeItemShort, NodePath} from "../types";
import * as Msg from "../messages.types";
import {ActionBar} from "./ActionBar";
import {keyPresses} from "./keypresses";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {merge} from "rxjs/observable/merge";
import {of} from "rxjs/observable/of";
import {filter} from "rxjs/operators/filter";
import {pluck} from "rxjs/operators/pluck";
import {tap} from "rxjs/operators/tap";
import {groupBy, mergeMap} from "rxjs/operators";

export interface AppProps {
    incoming$: Subject<Msg.PanelIncomingMessages>,
    outgoing$: Subject<Msg.PanelOutgoingMessages>,
}

export interface AppState {
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
}

export class App extends React.Component<AppProps, AppState> {
    props: AppProps;
    sub: Subscription | null;
    ref: any;
    state: AppState = {
        inspecting: false,
        collapsed: new Set<NodeId>([]),
        selected: {node: null, head: false, tail: false},
        root: getRootNode(),
        searchTerm: "",
        selectionOverlay: false,
        stripComments: true,
        flatNodes: null,
        baseNodes: [],
        baseFlatNodes: null,
    };

    componentDidMount() {
        this.sendScrape();
        this.sub = merge(
            this.props.incoming$.pipe(
                filter(x => x.type === Msg.Names.ParsedComments)
                , pluck('payload')
                , tap((nodes: NodeItem[]) => {
                    this.setState({
                        baseNodes: nodes,
                        baseFlatNodes: flattenNodes(nodes)
                    }, () => {
                        this.resetNodes(nodes, {collapseAll: true, clearSelection: true});
                    });
                })
            ),
            this.props.incoming$.pipe(
                filter(x => x.type === Msg.Names.KeyUp)
                , filter(() => this.state.baseNodes.length > 0)
                , groupBy(x => x.payload)
                , mergeMap(obs => {
                    return keyPresses[obs.key as number](obs, {
                        state$: of(this.state),
                        getState: () => this.state
                    });
                })
                , tap(x => {
                    this.setState(x);
                })
            ),
            this.props.incoming$.pipe(
                filter(x => x.type === Msg.Names.Ping)
                , tap(() => this.sendScrape())
            )
        ).subscribe();
    }

    sendScrape = () => {
        const config: Msg.ScrapeConfiguration = {
            stripComments: this.state.stripComments,
        };
        const scrapeMessage: Msg.Scrape = {type: Msg.Names.Scrape, payload: config};
        this.props.outgoing$.next(scrapeMessage);
    };

    resetNodes(nodes: NodeItem[], opts?: {collapseAll: boolean, clearSelection: boolean}) {
        this.setState((prev: App['state']) => {
            const root = {
                ...prev.root,
                children: nodes,
            };
            const flattened = flattenNodes(nodes);
            const collapsed = opts.collapseAll
                ? new Set(Object.keys(flattened).filter(x => x !== ROOT_ID))
                : prev.collapsed;
            const selected = opts.clearSelection
                ? {
                    node: null,
                    head: false,
                    tail: false,
                } : prev.selected;
            return {
                collapsed: collapsed,
                selected,
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
        const rootHasChildren = this.state.baseNodes.length > 0;
        const rootNode = this.state.root;

        return (
            <div className="app" ref={(ref) => {
                this.ref = ref;
            }}>
                <ActionBar
                    disabled={this.state.baseNodes.length === 0}
                    collapsed={this.state.collapsed}
                    selected={this.state.selected}
                    root={this.state.root}
                    searchTerm={this.state.searchTerm}
                    inspecting={this.state.inspecting}
                    flatNodes={this.state.flatNodes}
                    selectionOverlay={this.state.selectionOverlay}
                    stripComments={this.state.stripComments}
                    clearSelected={() => this.setState({selected: {node: null, head: false, tail: false}})}
                    expandAll={() => this.setState({collapsed: new Set([])})}
                    collapseAll={() => {
                        this.setState(() => ({
                            collapsed: new Set([...collectIds(this.state.root.children)])
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
                            this.resetNodes(this.state.baseNodes, {clearSelection: false, collapseAll: false});
                        } else {
                            this.resetNodes(
                                getSearchNodes(searchTerm, this.state.baseFlatNodes, this.state.baseNodes),
                                {clearSelection: false, collapseAll: true}
                            );
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
                            showOverlay={() => {
                                this.setState({selectionOverlay: true});
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
                )}
            </div>
        )
    }
}
