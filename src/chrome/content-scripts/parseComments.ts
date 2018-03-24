import {getCommentIterator} from "./getCommentIterator";
import {NodeItem} from "../../types";

export function parseComments(document: Document): [Map<any, any>, Map<any, any>, NodeItem[]] {
    const end = /^\/m2/;
    const start = /^m2\((.+?)\) (.+?)$/;
    const x = getCommentIterator(document);

    let comment = x.iterateNext();
    let lastElementAdded;

    const stack = [];
    const paths = [];
    const elemstack = [];
    const elemMap = new Map();
    const reverseElemMap = new Map();

    function push(element) {
        const prevStack = elemstack[elemstack.length - 1];
        const parent = prevStack
            ? prevStack.children
            : stack;

        paths.push(parent.length);
        element.path = paths.slice();
        element.id = element.path.join('.');

        parent.push(element);
        lastElementAdded = element;
    }

    while (comment) {
        const text = comment.textContent.trim();
        if (start.test(text)) {
            const [, name, json] = text.match(start);
            const data = json && JSON.parse(json);
            const elem: NodeItem = {
                name,
                json,
                data,
                children: [],
                hasRelatedElement: false,
                path: null,
                id: ""
            };

            push(elem);
            elemstack.push(elem);
            paths.push('children');

            if ((comment as HTMLElement).nextElementSibling) {
                const siblings = [];
                let node: any = (comment as HTMLElement);
                while (node) {
                    if (node.nodeType !== Node.TEXT_NODE) {
                        siblings.push(node);
                    }
                    node = node.nextSibling;
                }

                if (siblings[1].nodeType === Node.ELEMENT_NODE) {
                    elem.hasRelatedElement = true;
                    elemMap.set(elem.id, {element: siblings[1], data});
                    reverseElemMap.set(siblings[1], data);
                }
            }
        }
        if (end.test(text)) {
            elemstack.pop();
            paths.pop();
            paths.pop();
        }
        comment = x.iterateNext();
    }
    return [elemMap, reverseElemMap, stack];
}