/**
 * 此处转换是通过babel.io转换的
 */
"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _unit = require("../tool/unit");

function _instanceof(left, right) {
    if (
        right != null &&
        typeof Symbol !== "undefined" &&
        right[Symbol.hasInstance]
    ) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

var nodeIdSeed = 0;

var Node =
    /*#__PURE__*/
    (function() {
        function Node(options) {
            this.id = nodeIdSeed++;
            this.data = null;
            this.parent = null;
            this.isLeaf = true;
            this.checked = false;

            for (var option in options) {
                if (Object.prototype.hasOwnProperty.call(options, option)) {
                    this[option] = options[option];
                }
            }

            var store = this.store;
            this[store.valueKey] = options[store.valueKey] || null;
            this.level = 0;
            this.childNodes = [];

            if (this.parent) {
                this.level = this.parent.level + 1;
                store.maxLevel = Math.max(store.maxLevel, this.level);
                this.parentShowLabel = this.parent.totalLabel;
                this.totalLabel = this.parent.totalLabel
                    ? "" +
                      this.parent.totalLabel +
                      this.store.separator +
                      this[store.labelKey]
                    : this[store.labelKey];
                this.showLabel = this.store.showLeafLabel
                    ? this[store.labelKey]
                    : this.totalLabel;
            }

            this._idArr =
                this.parent && this.parent[store.valueKey]
                    ? [].concat(this.parent._idArr, [this[store.valueKey]])
                    : [this[store.valueKey]];
            this.setData(this.data);
        }

        var _proto = Node.prototype;

        _proto.setData = function setData(data) {
            var _this = this;

            var store = this.store;
            this.data = data;
            this.childNodes = [];
            var children;

            if (this.level === 0 && _instanceof(this.data, Array)) {
                children = this.data;
            } else {
                children = Object.prototype.hasOwnProperty.call(
                    this,
                    store.childrenKey
                )
                    ? this[store.childrenKey]
                    : [];
                this.isLeaf = children.length === 0;
                this.store.nodesMap[this.id] = this;
                this.store.nodeList.push(this);
                this[store.valueKey] = this[store.valueKey];
            }

            children.forEach(function(child) {
                _this.insertChild(child);
            });
        };

        _proto.insertChild = function insertChild(child) {
            child = Object.assign(child, {
                parent: this,
                store: this.store
            });
            child = new Node(child);
            this.childNodes.push(child);
        };

        _proto.check = function check(checked) {
            if (this.disabled) {
                return false;
            }

            this.checked = checked;
            this.updateSelectIds(checked, this.id);

            if (this.childNodes && this.childNodes.length > 0) {
                this.childNodes.forEach(function(child) {
                    child.check(checked);
                });
            }

            if (this.parent) {
                this.parent.checkedAll();
            }
        };

        _proto.checkedAll = function checkedAll() {
            if (this.childNodes && this.childNodes.length > 0) {
                this.indeterminate =
                    !this.checked &&
                    this.childNodes.some(function(child) {
                        return child.checked;
                    });
                this.updateSelectIds(this.checked, this.id);
            }

            if (this.parent) {
                this.checked = this.childNodes.every(function(child) {
                    return child.checked;
                });
                this.indeterminate =
                    !this.checked &&
                    this.childNodes.some(function(child) {
                        return child.checked;
                    });
                this.parent.checkedAll();
            }
        };

        _proto.updateSelectIds = function updateSelectIds(checked, id) {
            var store = this.store;

            if (checked) {
                if (this.isLeaf) {
                    var tempList = [].concat(store.selectedIds);
                    tempList.push(id);
                    tempList = (0, _unit._uniq)(tempList);
                    store.selectedIds = tempList;
                }
            } else {
                var _tempList = [].concat(store.selectedIds);

                var index = _tempList.findIndex(function(o) {
                    return o === id;
                });

                if (index >= 0) {
                    _tempList.splice(index, 1);
                }

                _tempList = (0, _unit._uniq)(_tempList);
                store.selectedIds = _tempList;
            }
        };

        return Node;
    })();

exports["default"] = Node;
