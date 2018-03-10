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