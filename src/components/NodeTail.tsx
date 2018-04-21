import {NodeInfoButton} from "./NodeInfoButton";

declare var require;
import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
import {ROOT_ID} from "../utils";
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
export class NodeTail extends React.PureComponent<NodeEndProps> {
    props: NodeEndProps;
    addHover = () => {
        this.props.addHover(this.props.node.id, this.props.node.path, {head: true, tail: false});
    };
    select = () => {
        this.props.select(this.props.node.id, this.props.node.path, {head: false, tail: true});
    };
    render() {
        const {props} = this;
        const {node, hasChildren, indent} = props;
        if (node.id === ROOT_ID) {
            return null;
        }
        const classes = classnames({
            node: true,
            'node--tail': true,
            'node--selected': props.isSelected
        });
        return hasChildren && (
            <div
                className={classes}
                style={{paddingLeft: String(indent) + 'px'}}
                onMouseEnter={this.addHover}
                onClick={this.select}
                id={`${node.id}-tail`}
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
