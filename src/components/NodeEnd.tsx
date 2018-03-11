declare var require;
import * as React from 'react';
import {NodeItem} from "../types";
const classnames = require('classnames');

export interface NodeEndProps {
    node: NodeItem,
    indent: number,
    isSelected: boolean,
    select(name: string): void,
    addHover(name: string): void,
    removeHover(name: string): void
    hasChildren: boolean
    isHovered: boolean
}
export function NodeEnd(props: NodeEndProps) {
    const {node, hasChildren, indent, isHovered, addHover, removeHover} = props;
    const classes = classnames({
        node_info: true,
        'node_info--hovered': props.isHovered,
        'node_info--selected': props.isSelected
    });
    return hasChildren && (
        <div
            className={classes}
            style={{paddingLeft: String(indent) + 'px'}}
            onMouseLeave={() => removeHover(node.name)}
            onMouseEnter={() => addHover(node.name)}
            onClick={() => props.select(node.name)}>
            <span className="token lt">&lt;</span>
            <span className="token">/{node.name}</span>
            <span className="token gt">&gt;</span>
        </div>
    )
}