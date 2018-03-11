import {Overlay} from './Overlay';

namespace JhBlockLogger {
    const start = /^m2\((.+?)\) (.+?)$/;
    const end = /^\/m2/;

    export function parseComments(): [Map<any, any>, Map<any, any>, any[]] {
        const x = document.evaluate(
            '//comment()',
            document,
            null,
            XPathResult.ANY_TYPE,
            null,
        );

        let comment = x.iterateNext();
        let lastElementAdded;

        const stack = [];
        const elemstack = [];
        const elemMap = new Map();
        const reverseElemMap = new Map();

        function push(element) {
            const parent = elemstack[elemstack.length - 1]
                ? elemstack[elemstack.length - 1].children
                : stack;
            parent.push(element);
            lastElementAdded = element;
        }

        while (comment) {
            const text = comment.textContent.trim();
            if (start.test(text)) {
                const [, name, json] = text.match(start);
                const data = json && JSON.parse(json);
                const elem = {
                    name,
                    json,
                    data,
                    children: [],
                    hasRelatedElement: false,
                };

                // if (name === 'page.wrapper') {
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
                        elemMap.set(name, {element: siblings[1], data});
                        reverseElemMap.set(siblings[1], data);
                    }
                }

                push(elem);
                elemstack.push(elem);
            }
            if (end.test(text)) {
                elemstack.pop();
            }
            comment = x.iterateNext();
        }
        return [elemMap, reverseElemMap, stack];
    }
}

const [elemMap, reverseElemMap, results] = JhBlockLogger.parseComments();

if (results && results.length) {
    let overlay;
    let inspect = false;
    chrome.extension.onMessage.addListener(function (message) {
        switch (message.type) {
            case 'scrape': {
                chrome.extension.sendMessage({type: "ParsedComments", payload: results});
                break;
            }
            case 'inspect': {
                inspect = message.payload;
                break;
            }
            case 'hover': {
                if (elemMap.has(message.payload)) {
                    const {element, data} = elemMap.get(message.payload);
                    if (!overlay) {
                        overlay = new Overlay(window);
                    }
                    overlay.inspect(element, data.type, data.name);
                } else {
                    if (overlay) {
                        overlay.remove();
                        overlay = null;
                    }
                }
                break;
            }
        }
    });

    window.addEventListener('mouseover', function(evt) {
        if (!inspect) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        evt.cancelBubble = true;
        if (reverseElemMap.has(evt.target)) {
            const data = reverseElemMap.get(evt.target);
            if (!overlay) {
                overlay = new Overlay(window);
            }
            overlay.inspect(evt.target, data.type, data.name);
        }
    }, true);

} else {
    console.log('no results found');
}

chrome.extension.sendMessage({type: 'Ping'});