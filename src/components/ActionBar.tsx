import * as React from 'react';
import {pullData} from "../utils";
import {NodeItem} from "../types";
import {App} from "./App";
import * as dlv from 'dlv';
import {SelectionOverlay} from "./SelectionOverlay";

export interface ActionBarProps {
    collapsed: App['state']['collapsed'],
    selected: App['state']['selected'],
    flatNodes: App['state']['flatNodes'],
    root: NodeItem,
    searchTerm: string,
    disabled: boolean,
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

export class ActionBar extends React.PureComponent<ActionBarProps> {
    props: ActionBarProps;
    render() {
        const {props} = this;
        const selected = dlv(props, 'selected');
        const selectedId = selected.node ? selected.node.id : '';

        return (
            <div className="action-bar">
                {props.disabled && (
                    <div className="action-bar__mask" />
                )}
                <SelectionOverlay
                    visible={selectedId && props.selectionOverlay}
                    toggleSelectionOverlay={props.toggleSelectionOverlay}
                    getItem={() => pullData(props.root.children, props.flatNodes, selectedId)}
                />
                <div className="controls">
                    <div className="controls__buttons">
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
                    </div>
                    {/*
                    <button
                        type="button"
                        className="controls__button"
                        onClick={props.toggleInspecting}
                    >{props.inspecting ? 'Stop inspecting' : 'Inspect page'}</button>
                    */}
                    <div className="controls__checkboxes">
                        <label htmlFor="strip-comments" className="controls__checkbox">
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
                    </div>
                </div>
                <div className="search-bar">
                    <input
                        type="search"
                        id="search"
                        placeholder="search for Block, Container, or Template names"
                        value={props.searchTerm}
                        className="search-bar__input"
                        onChange={(e) => props.setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        )
    }
}
