import {NodeItem, NodePath} from "./types";

export function collectIds(nodes: NodeItem[]) {
    const names = [];
    nodes.forEach(par);
    return names;
    function par(node) {
        if (node.children && node.children.length) {
            names.push(node.id);
            node.children.forEach(par);
        }
    }
}

export function pullData(nodes: NodeItem[], path: NodePath): NodeItem['data'] {
    let match;
    nodes.forEach(par);
    return match ? match.data : {};
    function par(node) {
        if (node.name === name) {
            match = node;
            return;
        }
        if (node.children && node.children.length) {
            node.children.forEach(par);
        }
    }
}