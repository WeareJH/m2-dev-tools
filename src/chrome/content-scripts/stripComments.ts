import {getCommentIterator} from "./getCommentIterator";

export function removeComments(document: Document) {
    const coms = [];
    const x = getCommentIterator(document);

    let comment = x.iterateNext();
    while(comment) {
        coms.push(comment);
        comment = x.iterateNext();
    }
    coms.forEach(com => com.parentNode && com.parentNode.removeChild(com));
}