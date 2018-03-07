import {h, Component} from 'preact';

const classnames = require('classnames');
const node = require('../../fixtures/dump.json');

export class App extends Component<any, any> {

    state = {
        selected: new Set([])
    }

    render() {
        return (
            <Node
                node={node}
                depth={1}
                selected={this.state.selected}
                addHover={(label) => {
                    this.setState(prev => ({
                        selected: (prev.selected.add(label), prev.selected)
                    }))
                }}
                removeHover={(label) => {
                    this.setState(prev => ({
                        selected: (prev.selected.delete(label), prev.selected)
                    }))
                }}
            />
        )
    }
}

export function Node({node, depth, selected, addHover, removeHover}) {
    const {nodes} = node;
    const hasNodes = nodes && (nodes.length > 0);
    const body = (hasNodes) && (
        <div class="nodes">
            {nodes.map(n => {
                const nextDepth = depth + 1;
                return <Node
                    node={n}
                    depth={nextDepth}
                    key={n.label}
                    selected={selected}
                    addHover={addHover}
                    removeHover={removeHover}
                />
            })}
        </div>
    );
    const indent = depth * 15;
    const isSelected = selected.has(node.label);
    const head = <NodeInfo
        node={node}
        indent={indent}
        addHover={addHover}
        removeHover={removeHover}
        isSelected={isSelected}
    />;
    const tail = <NodeEnd
        node={node}
        hasChildren={hasNodes}
        indent={indent}
        addHover={addHover}
        removeHover={removeHover}
        isSelected={isSelected}
    />;
    return (
        <div class="node">
            {head}
            {body}
            {tail}
        </div>
    );
}

class NodeInfo extends Component<any, any> {
    state = {
        hovered: false
    };

    render() {
        const {node, indent, addHover, removeHover} = this.props;
        const classes = classnames({
            node_info: true,
            'node_info--hovered': this.props.isSelected
        });
        return (
            <div style={{paddingLeft: String(indent) + 'px'}}
                 class={classes}
                 onmouseleave={() => removeHover(node.label)}
                 onmouseenter={() => addHover(node.label)}>
                <p>
                    <span class="token lt">&lt;</span>
                    <span class="token">{node.label}</span>
                    <NodeAttr data={node.data} dataKey={'template_file'} attrName={'template'}/>
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
}

function NodeAttr({data, attrName, dataKey}) {
    if (!data) return null;
    if (!data[dataKey]) return null;
    return (
        <span>
            {' '}
            <span class="token token--attr">{attrName}</span>
            <span class="token token--attr">=</span>
            <span class="token token--string">{data[dataKey]}</span>
        </span>
    );
}

function NodeEnd({node, hasChildren, indent, isSelected}) {
    const classes = classnames({
        node_info: true,
        'node_info--hovered': isSelected
    });
    return hasChildren && (
        <p class={classes} style={{paddingLeft: String(indent) + 'px'}}>
            <span class="token lt">&lt;</span><span class="token">/{node.label}</span><span class="token gt">&gt;</span>
        </p>
    )
}