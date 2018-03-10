namespace JhBlockLogger {
    const start = /^m2\((.+?)\) (.+?)$/;
    const end = /^\/m2/;

    export function parseComments() {
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
            }
            if (end.test(text)) {
                const last = elemstack.pop();
            }
            // if (template.test(text)) {
            //     const parts = text.match(template);
            //     if (lastElementAdded) {
            //         lastElementAdded.element = (comment as any).nextElementSibling;
            //         lastElementAdded.template = parts[1];
            //     }
            // }
            comment = x.iterateNext();
        }
        return stack;
    }
}
const results = JhBlockLogger.parseComments();

if (results && results.length) {
    chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
        chrome.extension.sendMessage({type: "ParsedComments", payload: results});
    });
}

chrome.extension.sendMessage({type: 'Ping'});