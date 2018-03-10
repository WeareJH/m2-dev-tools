namespace JhBlockLogger {
    const start = /^m2\((.+?)\) (.+?)$/;
    const end = /^\/m2/;

    export function parseComments(): [Map<any, any>, any[]] {
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
                };
                push(elem);
                elemstack.push(elem);

                // if (name === 'page.wrapper') {
                    if ((comment as HTMLElement).nextElementSibling) {
                        const siblings = [];
                        let node: any = (comment as HTMLElement);
                        while( node ) {
                            if (node.nodeType !== Node.TEXT_NODE) {
                                siblings.push( node );
                            }
                            node = node.nextSibling;
                        }

                        if (siblings[1].nodeType === Node.ELEMENT_NODE) {
                            elemMap.set(name, siblings[1]);
                        }
                    }
            }
            if (end.test(text)) {
                elemstack.pop();
            }
            comment = x.iterateNext();
        }
        return [elemMap, stack];
    }
}

const [elemMap, results] = JhBlockLogger.parseComments();

if (results && results.length) {
    chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
        switch(message.type) {
            case 'scrape': {
                chrome.extension.sendMessage({type: "ParsedComments", payload: results});
                break;
            }
            case 'hover': {
                if (elemMap.has(message.payload)) {
                    const element = elemMap.get(message.payload);
                    element.scrollIntoView();
                    // console.log('hover', elemMap.get(message.payload));
                    // elemMap.get(message.payload).style.borderColor = 'red';
                    // elemMap.get(message.payload).style.borderWidth = '10px';
                    // elemMap.get(message.payload).style.borderStyle = 'solid';
                }
            }
        }
    });
} else {
    console.log('no results found');
}

chrome.extension.sendMessage({type: 'Ping'});