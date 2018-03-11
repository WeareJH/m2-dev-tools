import {NodeItem} from "./types";

export function collectNames(nodes: NodeItem[]) {
    const names = [];
    nodes.forEach(par);
    return names;
    function par(node) {
        if (node.children && node.children.length) {
            names.push(node.name);
            node.children.forEach(par);
        }
    }
}

export function pullData(nodes: NodeItem[], name: string): NodeItem['data'] {
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