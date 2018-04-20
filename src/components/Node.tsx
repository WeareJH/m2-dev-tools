import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
import {NodeHead} from "./NodeHead";
import {NodeEnd} from "./NodeEnd";
import {App} from "./App";
import * as dlv from 'dlv';

export interface NodeProps {
    key?: string|number,
    node: NodeItem,
    depth: number,
    collapsed: App['state']['collapsed'],
    searchTerm: App['state']['searchTerm'],
    selected: App['state']['selected'],
    select(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    addHover(id: NodeId): void,
    toggle(id: NodeId): void,
    showOverlay(id: NodeId): void
}

export class Node extends React.PureComponent<NodeProps> {
    props: NodeProps;
    render() {
        const {props} = this;
        const {node, depth, addHover, searchTerm} = props;
        const {children} = node;
        const hasNodes = children && (children.length > 0);
        const isCollapsed = props.collapsed.has(node.id);
        const headIsSelected = props.selected.head && dlv(props, 'selected.node.id') === node.id;
        const body = (hasNodes && !isCollapsed) && (
            <>
                {children.map(n => {
                    const nextDepth = depth + 1;
                    return <Node
                        node={n}
                        depth={nextDepth}
                        key={n.id}
                        addHover={addHover}
                        toggle={props.toggle}
                        collapsed={props.collapsed}
                        searchTerm={searchTerm}
                        selected={props.selected}
                        select={props.select}
                        showOverlay={props.showOverlay}
                    />
                })}
            </>
        );
        const indent = depth * 15;
        const head = <NodeHead
            node={node}
            hasChildren={hasNodes}
            indent={indent}
            addHover={addHover}
            isCollapsed={isCollapsed}
            toggle={props.toggle}
            searchTerm={searchTerm}
            isSelected={headIsSelected}
            select={props.select}
            showOverlay={props.showOverlay}
        />;
        const tailIsSelected = props.selected.tail && dlv(props, 'selected.node.id') === node.id;
        const tail = (!isCollapsed) && (
            <NodeEnd
                node={node}
                hasChildren={hasNodes}
                indent={indent}
                addHover={addHover}
                isSelected={tailIsSelected}
                select={props.select}
                showOverlay={props.showOverlay}
            />
        );
        return (
            <>
                {head}
                {body}
                {tail}
            </>
        );
    }
}
