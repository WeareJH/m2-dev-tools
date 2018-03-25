import {NodeInfoButton} from "./NodeInfoButton";

declare var require;
import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
const classnames = require('classnames');

export interface NodeEndProps {
    node: NodeItem,
    indent: number,
    isSelected: boolean,
    hasChildren: boolean
    showOverlay(id: NodeId): void,
    select(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    addHover(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
}
export class NodeEnd extends React.PureComponent<NodeEndProps> {
    props: NodeEndProps;
    addHover = () => {
        this.props.addHover(this.props.node.id, this.props.node.path, {head: true, tail: false});
    };
    select = () => {
        this.props.select(this.props.node.id, this.props.node.path, {head: false, tail: true});
    };
    render() {
        const {props} = this;
        const {node, hasChildren, indent, addHover} = props;
        if (node.id === '$$root') {
            return null;
        }
        const classes = classnames({
            node_info: true,
            'node_info--tail': true,
            'node_info--selected': props.isSelected
        });
        return hasChildren && (
            <div
                className={classes}
                style={{paddingLeft: String(indent) + 'px'}}
                onMouseEnter={this.addHover}
                onClick={this.select}
            >
                {props.isSelected && (
                    <NodeInfoButton
                        showOverlay={this.props.showOverlay}
                        id={node.id}
                    />
                )}
                {node.name}
            </div>
        )
    }
}
