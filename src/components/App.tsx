declare var require;
import {h, Component} from 'preact';
import {NodeItem} from "../types";

const classnames = require('classnames');
const nodes = require('../../fixtures/large.json');

export class App extends Component<any, {selected: Set<string>}> {

    state = {
        selected: new Set<string>([]),
        message: null,
        root: {}
    }

    constructor(props) {
        super(props);

        this.state.root ={
            name: "$$root",
            children: nodes,
            data: {type: "root", name: "$$root"}
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div class="node-tree">
                <Node
                    node={this.state.root}
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
            </div>
        )
    }
}

export interface NodeProps {
    node: NodeItem,
    depth: number,
    selected: Set<string>,
    addHover(name: string): void,
    removeHover(name: string): void
}
export function Node(props: NodeProps) {
    const {node, depth, addHover, removeHover, selected} = props;
    const {children} = node;
    const hasNodes = children && (children.length > 0);
    const body = (hasNodes) && (
        <div class="nodes">
            {children.map(n => {
                const nextDepth = depth + 1;
                return <Node
                    node={n}
                    depth={nextDepth}
                    key={n.name}
                    selected={selected}
                    addHover={addHover}
                    removeHover={removeHover}
                />
            })}
        </div>
    );
    const indent = depth * 15;
    const isSelected = selected.has(node.name);
    const head = <NodeInfo
        node={node}
        hasChildren={hasNodes}
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
export interface NodeInfoProps {
    node: NodeItem,
    indent: number,
    isSelected: boolean,
    hasChildren: boolean,
    addHover(name: string): void,
    removeHover(name: string): void
}
function NodeInfo(props: NodeInfoProps) {
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

function NodeAttr(props: {data: any, attrName: string, dataKey: string}) {
    const {data, attrName, dataKey} = props;
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

export interface NodeEndProps {
    node: NodeItem,
    indent: number,
    addHover(name: string): void,
    removeHover(name: string): void
    hasChildren: boolean
    isSelected: boolean
}
function NodeEnd(props: NodeEndProps) {
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
