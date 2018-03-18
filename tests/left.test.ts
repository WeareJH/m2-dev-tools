import {left} from "../src/utils/tree-move";

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

describe('left', function () {
    it('collapse current item if on head with children', function () {
        const currentCollapsed = new Set([]);
        const currentSelection = {
            node: data['0'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const {selected, collapsed} = left(currentSelection, data, currentCollapsed);
        deepEqual(selected, expected);
        deepEqual(collapsed, ['0']);
    });
    it('can collapse root', function () {
        const currentCollapsed = new Set([]);
        const currentSelection = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const {selected, collapsed} = left(currentSelection, data, currentCollapsed);
        deepEqual(selected, expected);
        deepEqual(collapsed, ['$$root']);
    });
    it('can move out from child->parent', function () {
        const currentCollapsed = new Set([]);
        const currentSelection = {
            node: data['0.children.0'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };
        const {selected, collapsed} = left(currentSelection, data, currentCollapsed);
        deepEqual(selected, expected);
    });
    it('can move back from collasped head to parent', function () {
        const currentCollapsed = new Set(['0']);
        const currentSelection = {
            node: data['0'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const {selected, collapsed} = left(currentSelection, data, currentCollapsed);
        deepEqual(selected, expected);
    });
    it('can close root', function () {
        const currentCollapsed = new Set([]);
        const currentSelection = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const expected = {
            node: data['$$root'],
            head: true,
            tail: false
        };
        const {selected, collapsed} = left(currentSelection, data, currentCollapsed);

        deepEqual(selected, expected);
        deepEqual(collapsed, ['$$root']);
    });
    it('skips from tail -> head on head', function () {
        const currentCollapsed = new Set([]);
        const currentSelection = {
            node: data['$$root'],
            head: false,
            tail: true
        };
        const expected = {
            node: data['$$root'],
            head: true,
            tail: false
        };

        const {selected} = left(currentSelection, data, currentCollapsed);

        deepEqual(selected, expected);
    });
    it('skips from tail -> head on any element', function () {
        const currentCollapsed = new Set([]);
        const currentSelection = {
            node: data['0'],
            head: false,
            tail: true
        };
        const expected = {
            node: data['0'],
            head: true,
            tail: false
        };

        const {selected} = left(currentSelection, data, currentCollapsed);

        deepEqual(selected, expected);
    });
});