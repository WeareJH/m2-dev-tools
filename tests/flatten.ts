import {deepEqual} from 'assert';
import {flattenNodes} from "../src/utils";

const json = require('../fixtures/dump.json');

const expected = {
    "0": {
        "name": "main.wrapper",
        "children": ["0.children.0", "0.children.1"],
        "path": [0],
        "id": "0",
        "data": {"name": "main.wrapper", "type": "container"},
        "parent": "$$root",
        "index": 0,
        "namePath": [{"name": "main.wrapper", "type": "container"}]
    },
    "1": {
        "name": "wrapper.site-header",
        "children": ["1.children.0"],
        "path": [1],
        "id": "1",
        "data": {"name": "wrapper.site-header", "type": "container"},
        "parent": "$$root",
        "index": 1,
        "namePath": [{"name": "wrapper.site-header", "type": "container"}]
    },
    "2": {
        "name": "widget-static-block",
        "children": [],
        "path": [2],
        "id": "2",
        "data": {"name": "widget-static-block", "type": "container"},
        "parent": "$$root",
        "index": 2,
        "namePath": [{"name": "widget-static-block", "type": "container"}]
    },
    "$$root": {"path": [], "id": "$$root", "children": ["0", "1", "2"], "index": 0, "parent": null, "namePath": []},
    "0.children.0": {
        "name": "nav.item-renderer",
        "children": [],
        "path": [0, "children", 0],
        "id": "0.children.0",
        "data": {"name": "nav.item-renderer", "type": "block"},
        "parent": "0",
        "index": 0,
        "namePath": [{"name": "main.wrapper", "type": "container"}, {"name": "nav.item-renderer", "type": "block"}]
    },
    "0.children.1": {
        "name": "nav.item-renderer",
        "children": [],
        "path": [0, "children", 1],
        "id": "0.children.1",
        "data": {"name": "nav.item-renderer", "type": "block"},
        "parent": "0",
        "index": 1,
        "namePath": [{"name": "main.wrapper", "type": "container"}, {"name": "nav.item-renderer", "type": "block"}]
    },
    "1.children.0": {
        "name": "wrapper.site-header.controls",
        "children": [],
        "path": [1, "children", 0],
        "id": "1.children.0",
        "data": {"name": "wrapper.site-header.controls", "type": "block"},
        "parent": "1",
        "index": 0,
        "namePath": [{"name": "wrapper.site-header", "type": "container"}, {
            "name": "wrapper.site-header.controls",
            "type": "block"
        }]
    }
};

describe('flattens tree to lookup table', function() {
    it.skip('does work', function() {
        const actual = flattenNodes(json);
        deepEqual(actual, expected);
    });
});
