import {App} from "../components/App";
import {NodeItems} from "../types";

export function down(selection: App['state']['selected'], data: NodeItems, collapsed: App['state']['collapsed']) {
    const {node, head} = selection;
    if (!node) {
        return;
    }
    const current = data[node.id];
    const parent = data[current.parent];
    const nextSibling = getNextSibling(node.id, data);
    const isCollapsed = collapsed.has(node.id);
    const hasChildren = current.children && current.children.length > 0;

    if (head && hasChildren && !isCollapsed) {
        const firstChild = node.path.concat('children', 0).join('.');
        return {
            node: data[firstChild],
            head: true,
            tail: false
        }
    }

    if (nextSibling) {
        return {
            node: nextSibling,
            head: true,
            tail: false
        }
    } else {
        return {
            node: parent,
            head: false,
            tail: true,
        }
    }
}

export function getNextSibling(id, data) {
    const current = data[id];
    const parent = data[current.parent];
    if (!parent) {
        return false;
    }
    const hasNextSibling = (parent.children || []).length > current.index + 1;
    if (hasNextSibling) {
        return data[parent.children[current.index + 1]];
    }
    return null;
}