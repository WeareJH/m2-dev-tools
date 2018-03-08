var JhBlockLogger;
(function (JhBlockLogger) {
    var start = /^m2\((.+?)\) (.+?)$/;
    var end = /^\/m2/;
    function parseComments() {
        var x = document.evaluate('//comment()', document, null, XPathResult.ANY_TYPE, null);
        var comment = x.iterateNext();
        var lastElementAdded;
        var stack = [];
        var elemstack = [];
        function push(element) {
            var parent = elemstack[elemstack.length - 1]
                ? elemstack[elemstack.length - 1].children
                : stack;
            parent.push(element);
            lastElementAdded = element;
        }
        while (comment) {
            var text = comment.textContent.trim();
            if (start.test(text)) {
                var _a = text.match(start), name_1 = _a[1], json = _a[2];
                var data = json && JSON.parse(json);
                var elem = {
                    name: name_1,
                    json: json,
                    data: data,
                    children: []
                };
                push(elem);
                elemstack.push(elem);
            }
            if (end.test(text)) {
                var last = elemstack.pop();
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
    JhBlockLogger.parseComments = parseComments;
})(JhBlockLogger || (JhBlockLogger = {}));
var results = JhBlockLogger.parseComments();
if (results && results.length) {
    chrome.runtime.sendMessage({ type: "ParsedComments", payload: results });
}
