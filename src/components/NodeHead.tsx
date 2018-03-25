import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
import {NodeAttr} from "./NodeAttr";
import * as  classnames from 'classnames';
import {NodeToggle} from "./NodeToggle";
import {NodeInfoButton} from "./NodeInfoButton";

export interface NodeInfoProps {
    node: NodeItem,
    indent: number,
    isHovered: boolean,
    isCollapsed: boolean,
    isSelected: boolean,
    hasChildren: boolean,
    searchTerm: string,
    toggle(id: NodeId): void,
    select(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    addHover(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    showOverlay(id: NodeId): void,
}

export class NodeHead extends React.PureComponent<NodeInfoProps> {
    props: NodeInfoProps;
    addHover = () => {
        this.props.addHover(this.props.node.id, this.props.node.path, {head: true, tail: false});
    };
    select = () => {
        this.props.select(this.props.node.id, this.props.node.path, {head: true, tail: false});
    };
    public render() {
        const {props} = this;
        const {node, indent, hasChildren, isCollapsed, isSelected} = props;
        if (node.id === '$$root') {
            return null;
        }
        const classes = classnames({
            node_info: true,
            'node_info--hovered': props.isHovered,
            'node_info--selected': props.isSelected
        });
        const nodeName = node.data && node.data.type;
        const renderAttrs = [
            'name',
            'template_file'
        ];
        const lineClasses = classnames({
            node__line: true,
            'node__line--sync': node.hasRelatedElement
        })
        return (
            <div style={{paddingLeft: String(indent) + 'px'}}
                 className={classes}
                 onMouseEnter={this.addHover}
                 onClick={this.select}
            >
                {isSelected && (
                    <NodeInfoButton
                        showOverlay={this.props.showOverlay}
                        id={node.id}
                    />
                )}
                <p className={lineClasses} data-label={`<${nodeName}`}>
                    {hasChildren && (
                        <NodeToggle
                            toggle={props.toggle}
                            id={node.id}
                            isSelected={isSelected}
                            isCollapsed={isCollapsed}
                        />
                    )}
                    {renderAttrs.map(attr => {
                        return <NodeAttr
                            key={attr}
                            data={this.props.node.data}
                            dataKey={attr}
                            attrName={attr}
                            searchTerm={this.props.searchTerm}
                        />
                    })}
                </p>
            </div>
        )
    }
}
