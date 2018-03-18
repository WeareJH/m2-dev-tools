import {deepEqual} from 'assert';
import {flattenNodes} from "../src/utils";

const json = require('../fixtures/dump.json');

const expected = {
    "0": {
        "children": ["0.children.0", "0.children.1"],
        "id": "0",
        "path": [0],
        "parent": "$$root",
        "index": 0
    },
    "1": {"children": ["1.children.0"], "id": "1", "path": [1], "parent": "$$root", "index": 1},
    "2": {"children": [], "id": "2", "path": [2], "parent": "$$root", "index": 2},
    "$$root": {"path": [], "id": "$$root", "children": ["0", "1", "2"], "index": 0, "parent": null},
    "0.children.0": {"children": [], "id": "0.children.0", "path": [0, "children", 0], "parent": "0", "index": 0},
    "0.children.1": {"children": [], "id": "0.children.1", "path": [0, "children", 1], "parent": "0", "index": 1},
    "1.children.0": {"children": [], "id": "1.children.0", "path": [1, "children", 0], "parent": "1", "index": 0}
};

describe('flattens tree to lookup table', function() {
    it('does work', function() {
        const actual = flattenNodes(json);
        deepEqual(actual, expected);
    });
});