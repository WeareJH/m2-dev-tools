import {Msg} from "../messages.types";
import {Observable} from "../rx";
import {App} from "./App";
import * as dlv from "dlv";
import {down} from "../utils/tree-move";

export const keyPresses = {
    [Msg.KeyCodes.Left]: (xs, inputs) => {
        return xs.mergeMap((x) => {
            const state: App['state'] = inputs.getState();
            const node = state.selected.node;
            const hasChildren: boolean = dlv(state.flatNodes, [node.id, 'children'], []).length > 0;
            const isCollapsed = state.collapsed.has(node.id);
            const nextSelectedPath = node.path.slice(0, -1);
            const isRootNext = nextSelectedPath.length === 0;

            function id(incoming) {
                if (isRootNext) {
                    return '$$root'
                }
                return incoming;
            }

            if (nextSelectedPath[nextSelectedPath.length - 1] === 'children') {
                nextSelectedPath.pop();
            }

            if (!hasChildren) {
                return Observable.of({
                    selected: {
                        path: nextSelectedPath,
                        id: id(nextSelectedPath.join('.'))
                    }
                });
            }

            if (hasChildren && isCollapsed) {
                return Observable.of({
                    selected: {
                        path: nextSelectedPath,
                        id: id(nextSelectedPath.join('.'))
                    }
                });

            }

            if (hasChildren && !isCollapsed) {
                return Observable.of((prev) => {
                    return {
                        collapsed: (prev.collapsed.add(state.selected.node.id), prev.collapsed)
                    }
                });
            }

            return Observable.empty();
        })
    },
    [Msg.KeyCodes.Right]: (xs, inputs) => {
        return xs.mergeMap(x => {
            const state: App['state'] = inputs.getState();
            const hasChildren: boolean = dlv(state.flatNodes, [state.selected.node.id, 'children'], []).length > 0;
            const isCollapsed = state.collapsed.has(state.selected.node.id);

            if (hasChildren) {
                if (isCollapsed) {
                    return Observable.of((prev) => {
                        return {
                            collapsed: (prev.collapsed.delete(state.selected.node.id), prev.collapsed)
                        }
                    })
                }
            }

            return Observable.empty();
        });
    },
    [Msg.KeyCodes.Up]: (xs, done) => {
        return xs.do(x => console.log(x)).ignoreElements();
    },
    [Msg.KeyCodes.Down]: (xs, inputs) => {
        return xs.mergeMap(() => {
            const state: App['state'] = inputs.getState();
            const nextSelected = down(state.selected, state.flatNodes, state.collapsed);
            return Observable.of({
                selected: nextSelected
            });
        });
    }
}