import {down, up} from "../src/utils/tree-move";

import {deepEqual} from 'assert';

const data = {
    '$$root': {
        path: [], id: '$$root', children: ['0', '1'], index: 0
    },
    '0': {
        path: [0], id: '0', children: ['0.children.0', '0.children.1'], parent: '$$root', index: 0,
    },
    '0.children.0': {
        path: [0, 'children', 0], id: '0.children.0', parent: '0', index: 0,
    },
    '0.children.1': {
        path: [0, 'children', 0], id: '0.children.1', parent: '0', index: 1
    },
    '1': {
        path: [1],
        id: '1',
        index: 1,
        parent: '$$root'
    }
};

describe('up', function () {
    it('does nothing if no prevSiblings ($$root)', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const nextSelection = up(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('does nothing if no prevSiblings ($$root tail)', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['$$root'],
            head: false,
            tail: true
        };
        const expected = {
            node: data['1'],
            head: true,
            tail: false
        };
        const nextSelection = up(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('moves up if prevSibling exists', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['0.children.1'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0.children.0'],
            head: true,
            tail: false
        };
        const nextSelection = up(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('moves up to parent if prevSibling exists', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['0.children.0'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const nextSelection = up(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('skips children if collapsed', function () {
        const collapsed = new Set(['0']);
        const selected = {
            node: data['1'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const nextSelection = up(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('moves to last child when on a tail of non-collapsed node', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['0'],
            head: false,
            tail: true
        };
        const expected = {
            node: data['0.children.1'],
            head: true,
            tail: false
        };
        const nextSelection = up(selected, data, collapsed);
        // console.log(nextSelection);
        deepEqual(nextSelection, expected);
    });
});