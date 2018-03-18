declare var require;
import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
const classnames = require('classnames');

export interface NodeEndProps {
    node: NodeItem,
    indent: number,
    isSelected: boolean,
    hasChildren: boolean
    isHovered: boolean
    select(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    addHover(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    removeHover(id: NodeId): void
}
export function NodeEnd(props: NodeEndProps) {
    const {node, hasChildren, indent, addHover} = props;
    const classes = classnames({
        node_info: true,
        'node_info--selected': props.isSelected
    });
    return hasChildren && (
        <div
            className={classes}
            style={{paddingLeft: String(indent) + 'px'}}
            onMouseEnter={() => addHover(node.id, node.path, {head: false, tail: true})}
            onClick={() => props.select(node.id, node.path, {head: false, tail: true})}>
            <span className="token lt">&lt;</span>
            <span className="token">/{node.name}</span>
            <span className="token gt">&gt;</span>
        </div>
    )
}