import {NodeId, NodeItem, NodeItems, NodeItemShort, NodePath} from "./types";
import {App} from "./components/App";
const dlv = require("dlv");

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

    const root = {
        path: [],
        id: ROOT_ID,
        children: nodes.map(x => x.id),
        index: 0,
        parent: null,
        namePath: []
    };

    const output: NodeItems = {[ROOT_ID]: root};

    return flattenChildren(nodes, ROOT_ID, [], []), output;

    function flattenChildren(nodes: NodeItem[], parentId: string, path: NodePath, namePath: {name: string, type: string}[]) {
        nodes.forEach((node, index) => {
            const nextPath = path.concat(index);
            const newNode = {
                ...node,
                children: (node.children||[]).map(x => x.id),
                parent: parentId,
                index,
                namePath: namePath.concat({name: node.name, type: node.data.type})
            };
            output[node.id] = newNode;
            if (node.children && node.children.length) {
                flattenChildren(node.children, node.id, nextPath.concat('children'), namePath.concat({name: node.name, type: node.data.type}));
            }
        });
    }
}

export function getSearchNodes(searchTerm: string, flatNodes: App['state']['flatNodes'], nodes: NodeItem[]) {
    const matches = Object.keys(flatNodes)
        .filter(x => x!== ROOT_ID)
        .map(x => flatNodes[x])
        .map(x => dlv(nodes, x.path))
        .filter((node: NodeItem) => {
            const template_file = (node.data.template_file||"");
            const name = (node.data.name||"");
            return template_file.indexOf(searchTerm) > -1
                || name.indexOf(searchTerm) > -1
        });

    return matches;
}

export const ROOT_ID = '$$root';
export function getRootNode(): NodeItem {
    return {
        name: ROOT_ID,
        children: [],
        data: {type: "root", name: ROOT_ID},
        hasRelatedElement: false,
        path: [],
        id: ROOT_ID
    }
}