import {h} from 'preact';
import {NodeItem} from "../types";
import {NodeInfo} from "./NodeInfo";
import {NodeEnd} from "./NodeEnd";

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