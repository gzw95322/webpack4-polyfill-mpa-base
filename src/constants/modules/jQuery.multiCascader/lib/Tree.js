/**
 * 此处转换是通过babel.io转换的
 */
"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _Node = _interopRequireDefault(require("./Node.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var TreeStore = function TreeStore(options) {
    for (var option in options) {
        if (Object.prototype.hasOwnProperty.call(options, option)) {
            this[option] = options[option];
        }
    }

    this.nodesMap = {};
    this.nodeList = [];
    this.selectedIds = [];
    this.maxLevel = 0;
    this.root = new _Node["default"]({
        data: this.data,
        store: this
    });
};

exports["default"] = TreeStore;
