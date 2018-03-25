import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
import {NodeAttr} from "./NodeAttr";
import * as  classnames from 'classnames';
import {NodeToggle} from "./NodeToggle";
import {NodeInfoButton} from "./NodeInfoButton";
import * as memoize from "lodash.memoize";

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
    getAttr: any
    constructor(props) {
        super(props);
        this.getAttr = memoize(attr => this.getAttrNode(attr))
    }
    getAttrNode(key) {
        return (
            <NodeAttr
                key={key}
                data={this.props.node.data}
                dataKey={key}
                attrName={key}
                searchTerm={this.props.searchTerm}
            />
        )
    }
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
                <p className="node__line" data-label={`<${nodeName}`}>
                    {hasChildren && (
                        <NodeToggle
                            toggle={props.toggle}
                            id={node.id}
                            isSelected={isSelected}
                            isCollapsed={isCollapsed}
                        />
                    )}
                    {renderAttrs.map(attr => {
                        return this.getAttr(attr);
                    })}
                </p>
            </div>
        )
    }
}

function SyncIcon() {
    return (
        <svg height="10px" version="1.1" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g fill="#777777" id="Group" transform="translate(-192.000000, -192.000000)">
                    <path d="M201,205.917042 C203.512502,205.49553 205.495527,203.512505 205.917042,201 L203,201 L203,199 L205.917042,199 C205.495527,196.487495 203.512502,194.50447 201,194.082958 L201,197 L199,197 L199,194.082958 C196.487498,194.50447 194.504473,196.487495 194.082958,199 L197,199 L197,201 L194.082958,201 C194.504473,203.512505 196.487498,205.49553 199,205.917042 L199,203 L201,203 Z M200,208 C195.581722,208 192,204.418278 192,200 C192,195.581722 195.581722,192 200,192 C204.418278,192 208,195.581722 208,200 C208,204.418278 204.418278,208 200,208 Z M200,208"/>
                </g>
            </g>
        </svg>
    )
}
