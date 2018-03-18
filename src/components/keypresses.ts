import {Msg} from "../messages.types";
import {Observable} from "../rx";
import {App} from "./App";
import * as dlv from "dlv";
import {down, left, up} from "../utils/tree-move";

export const keyPresses = {
    [Msg.KeyCodes.Left]: (xs, inputs) => {
        return xs.mergeMap((x) => {
            const state: App['state'] = inputs.getState();
            const hasChildren: boolean = dlv(state.flatNodes, [state.selected.node.id, 'children'], []).length > 0;
            const isCollapsed = state.collapsed.has(state.selected.node.id);
            const {selected, collapsed} = left(state.selected, state.flatNodes, state.collapsed);
            const node = selected.node;
            const head = selected.head;
            const tail = selected.tail;

            return Observable.of(prev => {
                const preCollapsed = [...Array.from(prev.collapsed), ...collapsed];
                return {
                    selected: {
                        node,
                        head,
                        tail
                    },
                    collapsed: new Set(preCollapsed)
                }
            })
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
    [Msg.KeyCodes.Up]: (xs, inputs) => {
        return xs.mergeMap(() => {
            const state: App['state'] = inputs.getState();
            const nextSelected = up(state.selected, state.flatNodes, state.collapsed);
            return Observable.of({
                selected: nextSelected
            });
        });
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