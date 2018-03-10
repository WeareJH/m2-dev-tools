import {h} from 'preact';
import {NodeItem} from "../types";
import {NodeHead} from "./NodeHead";
import {NodeEnd} from "./NodeEnd";

export interface NodeProps {
    node: NodeItem,
    depth: number,
    selected: Set<string>,
    collapsed: Set<string>,
    searchTerm: string,
    addHover(name: string): void,
    toggle(name: string): void,
    removeHover(name: string): void
}

export function Node(props: NodeProps) {
    const {node, depth, addHover, removeHover, selected, searchTerm} = props;
    const {children} = node;
    const hasNodes = children && (children.length > 0);
    const isCollapsed = props.collapsed.has(node.name);
    const body = (hasNodes && !isCollapsed) && (
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
                    toggle={props.toggle}
                    collapsed={props.collapsed}
                    searchTerm={searchTerm}
                />
            })}
        </div>
    );
    const indent = depth * 15;
    const isSelected = selected.has(node.name);
    const head = <NodeHead
        node={node}
        hasChildren={hasNodes}
        indent={indent}
        addHover={addHover}
        removeHover={removeHover}
        isSelected={isSelected}
        isCollapsed={isCollapsed}
        toggle={props.toggle}
        searchTerm={searchTerm}
    />;
    const tail = (!isCollapsed) && (
        <NodeEnd
            node={node}
            hasChildren={hasNodes}
            indent={indent}
            addHover={addHover}
            removeHover={removeHover}
            isSelected={isSelected}
        />
    );
    return (
        <div class="node">
            {head}
            {body}
            {tail}
        </div>
    );
}