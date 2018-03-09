import {h} from 'preact';
import {NodeItem} from "../types";
import {NodeAttr} from "./NodeAttr";
const classnames = require('classnames');

export interface NodeInfoProps {
    node: NodeItem,
    indent: number,
    isSelected: boolean,
    hasChildren: boolean,
    addHover(name: string): void,
    removeHover(name: string): void
}

export function NodeInfo(props: NodeInfoProps) {
    const {node, indent, addHover, removeHover, hasChildren} = props;
    const classes = classnames({
        node_info: true,
        'node_info--hovered': this.props.isSelected
    });
    const nodeName = node.data && node.data.type;
    return (
        <div style={{paddingLeft: String(indent) + 'px'}}
             class={classes}
             onMouseLeave={() => removeHover(node.name)}
             onMouseEnter={() => addHover(node.name)}>
            <p>
                <span class="token lt">&lt;</span>
                <span class="token">{nodeName}</span>
                <NodeAttr data={node.data} dataKey={'name'} attrName={'name'}/>
                <NodeAttr data={node.data} dataKey={'template_file'} attrName={'template'}/>
                {!hasChildren && (
                    <span class="token gt">{' /'}</span>
                )}
                <span class="token gt">&gt;</span>
            </p>
            <div class="node__props">
                {node.data && Object.keys(node.data).map(key => {
                    const value = node.data[key];
                    if (typeof value === 'string') {
                        return (
                            <p>
                                <span class="token token--key">{key}:</span>
                                {' '}
                                <span class="token token--value">{node.data[key]}</span>
                            </p>
                        )
                    }
                })}
            </div>
        </div>
    )
}