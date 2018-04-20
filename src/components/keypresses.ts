import * as Msg from "../messages.types";
import {App} from "./App";
import * as dlv from 'dlv';
import {down, left, up} from "../utils/tree-move";
import {Observable} from "rxjs/Observable";
import {map, mergeMap} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import {empty} from "rxjs/observable/empty";

interface IEventInputs {
    getState: () => App['state'],
    state$: Observable<App['state']>
}

export const keyPresses = {
    [Msg.KeyCodes.Left]: (xs: Observable<void>, inputs: IEventInputs) => {
        return xs.pipe(
            map(() => {
                const state = inputs.getState();
                const {selected, collapsed} = left(state.selected, state.flatNodes, state.collapsed);
                const node = selected.node;
                const head = selected.head;
                const tail = selected.tail;

                return prev => {
                    const preCollapsed = [...Array.from(prev.collapsed), ...collapsed];
                    return {
                        selected: {
                            node,
                            head,
                            tail
                        },
                        collapsed: new Set(preCollapsed)
                    }
                }
            })
        )
    },
    [Msg.KeyCodes.Right]: (xs: Observable<void>, inputs: IEventInputs) => {
        return xs.pipe(
            mergeMap(() => {
                const state: App['state'] = inputs.getState();
                const hasChildren: boolean = dlv(state.flatNodes, [state.selected.node.id, 'children'], []).length > 0;
                const isCollapsed = state.collapsed.has(state.selected.node.id);

                if (hasChildren) {
                    if (isCollapsed) {
                        return of((prev) => {
                            return {
                                collapsed: (prev.collapsed.delete(state.selected.node.id), prev.collapsed)
                            }
                        })
                    }
                }

                return empty();
            })
        );
    },
    [Msg.KeyCodes.Up]: (xs: Observable<void>, inputs: IEventInputs) => {
        return xs.pipe(
            map(() => {
                const state: App['state'] = inputs.getState();
                const nextSelected = up(state.selected, state.flatNodes, state.collapsed);
                return {
                    selected: nextSelected
                };
            })
        );
    },
    [Msg.KeyCodes.Down]: (xs: Observable<void>, inputs: IEventInputs) => {
        return xs.pipe(
            map(() => {
                const state: App['state'] = inputs.getState();
                const nextSelected = down(state.selected, state.flatNodes, state.collapsed);
                return {
                    selected: nextSelected
                };
            })
        );
    }
}
