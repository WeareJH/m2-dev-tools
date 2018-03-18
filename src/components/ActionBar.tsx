import * as React from 'react';
import {pullData} from "../utils";
import {NodeItem} from "../types";
import {App} from "./App";
import * as dlv from "dlv";
import {SelectionOverlay} from "./SelectionOverlay";

export interface ActionBarProps {
    hovered: App['state']['hovered'],
    collapsed: App['state']['collapsed'],
    selected: App['state']['selected'],
    flatNodes: App['state']['flatNodes'],
    root: NodeItem,
    searchTerm: string,
    inspecting: boolean
    selectionOverlay: boolean
    stripComments: boolean
    clearSelected(): void
    expandAll(): void
    collapseAll(): void
    toggleInspecting(): void
    toggleSelectionOverlay(checked: boolean): void
    toggleStripComments(checked: boolean): void
    setSearchTerm(searchTerm: string): void
}

export function ActionBar(props: ActionBarProps) {
    const selected = dlv(props, 'selected');
    const selectedId = selected.node ? selected.node.id : '';

    return (
        <div className="action-bar">
            <SelectionOverlay
                visible={selectedId && props.selectionOverlay}
                toggleSelectionOverlay={props.toggleSelectionOverlay}
                getItem={() => pullData(props.root.children, props.flatNodes, selectedId)}
            />
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
                {/*
                <button
                    type="button"
                    className="controls__button"
                    onClick={props.toggleInspecting}
                >{props.inspecting ? 'Stop inspecting' : 'Inspect page'}</button>
                */}
                <label htmlFor="strip-comments">
                    <input
                        type="checkbox"
                        id="strip-comments"
                        checked={props.stripComments}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            props.toggleStripComments(checked);
                        }}
                    />
                    Strip Comments
                </label>
                <label htmlFor="check">
                    <input
                        type="checkbox"
                        id="check"
                        checked={props.selectionOverlay}
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