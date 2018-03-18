import * as React from 'react';
import {pullData} from "../utils";
import {NodeItem} from "../types";
import {App} from "./App";
import * as dlv from "dlv";

export interface ActionBarProps {
    hovered: App['state']['hovered'],
    collapsed: App['state']['collapsed'],
    selected: App['state']['selected'],
    flatNodes: App['state']['flatNodes'],
    root: NodeItem,
    searchTerm: string,
    inspecting: boolean
    selectionOverlay: boolean
    clearSelected(): void
    expandAll(): void
    collapseAll(): void
    toggleInspecting(): void
    toggleSelectionOverlay(checked: boolean): void
    setSearchTerm(searchTerm: string): void
}

export function ActionBar(props: ActionBarProps) {
    const hasSelection = dlv(props, 'selected.node.id');
    const selectionOverlay = props.selectionOverlay;
    const data = (props.root && hasSelection)
        ? pullData(props.root.children, props.flatNodes, props.selected.node.id)
        : {};
    return (
        <div className="action-bar">
            {hasSelection && selectionOverlay && (
                <div className="info-window">
                    <button
                        type="button"
                        onClick={props.clearSelected}
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
                    onClick={props.expandAll}
                >Expand all
                </button>
                <button
                    type="button"
                    className="controls__button"
                    onClick={props.collapseAll}
                >Collapse all
                </button>
                <button
                    type="button"
                    className="controls__button"
                    onClick={props.toggleInspecting}
                >{props.inspecting ? 'Stop inspecting' : 'Inspect page'}</button>
                <label htmlFor="check">
                    <input
                        type="checkbox"
                        id="check"
                        onChange={(e) => {
                            const checked = e.target.checked;
                            props.toggleSelectionOverlay(checked);
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
                    value={props.searchTerm}
                    onChange={(e) => props.setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}