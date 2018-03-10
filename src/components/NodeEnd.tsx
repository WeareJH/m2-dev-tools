declare var require;
import {h} from 'preact';
import {NodeItem} from "../types";
const classnames = require('classnames');

export interface NodeEndProps {
    node: NodeItem,
    indent: number,
    addHover(name: string): void,
    removeHover(name: string): void
    hasChildren: boolean
    isSelected: boolean
}
export function NodeEnd(props: NodeEndProps) {
    const {node, hasChildren, indent, isSelected, addHover, removeHover} = props;
    const classes = classnames({
        node_info: true,
        'node_info--hovered': isSelected
    });
    return hasChildren && (
        <div
            class={classes}
            style={{paddingLeft: String(indent) + 'px'}}
            onMouseLeave={() => removeHover(node.name)}
            onMouseEnter={() => addHover(node.name)}>
            <span class="token lt">&lt;</span>
            <span class="token">/{node.name}</span>
            <span class="token gt">&gt;</span>
        </div>
    )
}