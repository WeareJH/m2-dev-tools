import {down} from "../src/utils/tree-move";

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

describe('down', function () {
    it('skips children if collapsed', function () {
        const collapsed = new Set(['0']);
        const selected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['1'],
            head: true,
            tail: false
        };
        const nextSelection = down(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('descends to first child if not collapsed', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0.children.0'],
            head: true,
            tail: false
        };
        const nextSelection = down(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('can go down if no siblings', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['0.children.1'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: false,
            tail: true
        };
        const nextSelection = down(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('can decend from $$root to first child', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const nextSelection = down(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('can descend TO $$root from no selections', function () {
        const collapsed = new Set([]);
        const selected = {
            node: null,
            head: false,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const nextSelection = down(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
    it('does not go past the final node tail', function () {
        const collapsed = new Set([]);
        const selected = {
            node: data['$$root'],
            head: false,
            tail: true
        };
        const expected = {
            node: data['$$root'],
            head: false,
            tail: true
        };
        const nextSelection = down(selected, data, collapsed);
        deepEqual(nextSelection, expected);
    });
});
