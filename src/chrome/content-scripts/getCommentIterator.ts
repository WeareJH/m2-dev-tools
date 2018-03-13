export function getCommentIterator(document: Document) {
    return document.evaluate(
        '//comment()',
        document,
        null,
        XPathResult.ANY_TYPE,
        null,
    );
}