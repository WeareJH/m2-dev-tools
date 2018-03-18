import {NodeId, NodeItem, NodeItems, NodeItemShort, NodePath} from "./types";

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

export interface NodeMetaData {
    data: NodeItem['data']
    node: NodeItemShort,
}

export function pullData(nodes: NodeItem[], data: NodeItems | null, id: NodeId): NodeMetaData {
    let match;
    nodes.forEach(par);
    return {
        data: match ? match.data : {},
        node: data[match ? match.id : null],
    };
    function par(node) {
        if (node.id === id) {
            match = node;
            return;
        }
        if (node.children && node.children.length) {
            node.children.forEach(par);
        }
    }
}

export function flattenObjectByProp(nodes, prop = 'id') {
    const obj = {};
    return flatten(nodes), obj;
    function flatten(nodes: NodeItem[]) {
        nodes.forEach((node) => {
            obj[node[prop]] = node;
            if (node.children && node.children.length) {
                flatten(node.children);
            }
        })
    }
}

export function flattenNodes(nodes: NodeItem[]): NodeItems {

    const root: NodeItemShort = {
        path: [],
        id: '$$root',
        children: nodes.map(x => x.id),
        index: 0,
        parent: null,
        namePath: []
    };

    const output: NodeItems = {'$$root': root};

    return flattenChildren(nodes, '$$root', []), output;

    function flattenChildren(nodes: NodeItem[], parentId: string, namePath: string[]) {
        nodes.forEach((node, index) => {
            const newNode: NodeItemShort = {
                children: (node.children||[]).map(x => x.id),
                id: node.id,
                path: node.path,
                parent: parentId,
                index,
                namePath: namePath.concat(node.name)
            };
            output[node.id] = newNode;
            if (node.children && node.children.length) {
                flattenChildren(node.children, node.id, namePath.concat(node.name));
            }
        });
    }
}