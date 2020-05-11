/*eslint-disable*/
import "./index.scss";
import TreeStore from "./lib/Tree.js";
import { _findByObj } from "./tool/unit";

/*
 *MuCaser plugin
 */
/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function($) {
    /**
     * 定义一个插件 Plugin
     */
    var MuCaser, privateMethod; //插件的私有方法，也可以看做是插件的工具方法集

    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用一个 Plugin 的单例模式 包含一个 Plugin的类，主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了Plugin类里，这时建议私有方法前加上"_"
     */
    MuCaser = (function() {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */

        function Plugin(element, options) {
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.multiCascader.defaults, options);
            this.settings.list.width = this.settings.list.width + 1;
            //如果将参数设置在dom的自定义属性里，也可以这样写
            //this.settings = $.extend({}, $.fn.plugin.defaults, this.$element.data(), options);
            this.store = {}; // tree实例
            this.root = []; // tree的根节点
            this.maxLevellist = []; // tree的最大深度
            this.showData = []; // 展示的数据
            this.isTwoDimensionValue = this.settings.isTwoDimensionValue; // 结果中是否有子父的id
            this.selectedLabels = []; // 已选节点文字
            this.selectedIds = []; // 已选节点id
            this.selectedNodes = []; // 已选节点的node信息
            this.activeList = []; // 当前list
            this.levelListScrollTop = []; // 层级scrollTop
            this.onlyLast = false; // 是否只在最后节点展示checkbox
            // this.activeClass = "floor-width-1";
            this.oldValue = {
                //老数据
                oldNode: null,
                oldLevelIndex: null,
                oldLevel: null
            };

            let opts = this.settings;
            let obj = this.$element;
            let _this = this;
            this.init();
            obj.on("click", ".mucaser-list-item", function() {
                let $this = $(this);
                const _data = $this.data();
                // 由于是对象数组, 无法JSON化, 此处为查询当前点击的节点
                let _node = _this._searchNodeByidArr(_data.idArr);
                _this._handleClick(_node, _data.nodeIndex, _data.level, $this.parent().scrollTop());
                return false;
            });
            obj.on("click", ".mucaser-list-item-label", function() {
                let $this = $(this);
                const _data = $this.data();
                let _node = _this._searchNodeByidArr(_data.idArr);
                _node.checked = !$this.is(".checked");
                _this._handleCheck(_node);
                // $this.toggleClass("checked");
            });
            obj.on("click", ".mucaser-result", function(e) {
                e.stopPropagation();
                obj.toggleClass("hidden");
            });
            $(document).bind("click", function(e) {
                $(e.target).closest(".mucaser").length > 0
                    ? obj.removeClass("hidden")
                    : obj.addClass("hidden");
            });
        }

        /**
         * 将插件所有函数放在prototype的大对象里
         * 插件的公共方法，相当于接口函数，用于给外部调用
         * @type {{}}
         */
        Plugin.prototype = {
            // 初始化
            init() {
                let obj = this.$element;
                let opts = this.settings;
                this._renderNode(opts.data);
                // this._updateSelect(opts.value, true, true);
                let _tpl = this._renderList(this.root.childNodes);
                opts.show ? obj.removeClass("hidden") : obj.addClass("hidden");
                obj.addClass("mucaser").html(`
                    <input type="hidden" class="mucaser-value" name="${opts.inputName}" />
                    <div class="mucaser-result form-control no-value"><div class="mcr-result">${opts.placeholder}</div><div class="mcr-arrow">&#xe69a;</div></div><div class="mucaser-list-container" style="width: ${opts.list.width}px;height: ${opts.list.height}px;">${_tpl}<div class="clearfix"></div></div>`);
                $(".mucaser-list-container").css({
                    top: $(".mucaser-result").outerHeight() + 1
                });
                this._setValue();
            },
            // 生成tree
            _renderNode(data) {
                let opts = this.settings;
                // 基于第三方提供的tree节点算法
                this.store = new TreeStore({
                    data: opts.data,
                    separator: "|",
                    valueKey: opts.valueKey,
                    labelKey: opts.labelKey,
                    childrenKey: opts.childrenKey,
                    showLeafLabel: opts.showLeafLabel
                });
                this.root = this.store.root;
                // tree 层次list
                this.maxLevellist = Array.from(
                    { length: this.store.maxLevel - 1 },
                    (v, i) => {
                        this.showData[i + 1] = [];
                        return {
                            id: i + 1,
                            rendered: false
                        };
                    }
                );
                this._updateSelect(opts.value, true, true);
            },
            // 查询当前节点
            _searchNodeByidArr(idArr = "") {
                const _childNodes = this.root.childNodes;
                let _node = {};
                const _idArr = String(idArr).split(",");
                for (let i = 0; i < _idArr.length; i++) {
                    if (i == 0) {
                        _node = _childNodes.find(item => item.id == _idArr[i]);
                    } else {
                        _node = _node.childNodes.find(
                            item => item.id == _idArr[i]
                        );
                    }
                }
                return _node;
            },
            // 更新已选项
            _updateSelect(data = [], needCheckNode = false, setValue = false) {
                let tempSelectedNodes = [];
                let tempSelectedLabels = [];
                let tempSelectedIds = [];
                // this.store.nodeList.forEach(node => {
                //     node.checked && node.check(false);
                // });
                data.forEach(o => {
                    let targetNode;
                    if (setValue) {
                        targetNode =
                            _findByObj(this.store.nodeList, {
                                [this.isTwoDimensionValue
                                    ? "_idArr"
                                    : this.settings.valueKey]: o
                            }) || {};
                        // targetNode = _.find(this.store.nodeList, { [this.isTwoDimensionValue ? '_idArr' : this.valueKey]: o }) || {}
                        tempSelectedIds.push(targetNode.id);
                    } else {
                        targetNode = this.store.nodesMap[o];
                        tempSelectedIds.push(o);
                    }
                    if (targetNode) {
                        needCheckNode &&
                            Object.keys(targetNode).length > 0 &&
                            targetNode.check(true);
                        tempSelectedNodes.push(targetNode);
                        tempSelectedLabels.push(targetNode.showLabel);
                    }
                }); 
                this.selectedNodes = tempSelectedNodes;
                this.selectedLabels = tempSelectedLabels;
                this.selectedIds = tempSelectedIds;
            },
            _renderList(data, level = 1, isSource = true) {
                let opts = this.settings;
                const _onlyLast = this.onlyLast;
                let _str = "";
                data.forEach((node, nodeIndex) => {
                    _str += `<div class="mucaser-list-item${
                        this.activeList[level - 1] === node.id ? " active" : ""
                    }"
                    data-node-index="${nodeIndex}"
                    data-level="${level}"
                    data-id-arr="${node._idArr.join(",")}"
                  >
                    <label class="mucaser-list-item-label iconfont unchecked
                    ${!_onlyLast || (_onlyLast && node.isLeaf) ? "" : " hide"}
                    ${!!node.checked ? " checked" : ""}
                    ${!!node.indeterminate ? " indeterminate" : ""}
                    ${!!node.disabled ? " disabled" : ""}
                    "
                    data-node-index="${nodeIndex}"
                    data-level="${level}"
                    data-id-arr="${node._idArr.join(",")}"
                    ><span class="unchecked_ele">&#xe628;</span><span class="checked_ele">&#xe7b8;</span><span class="indeterminate_ele">&#xe7e0;</span>
                        </label>
                      <div class="mucaser-list-item-txt" title="${
                          node[opts.labelKey]
                      }">${node[opts.labelKey]}</div>
                      <i class="mucaser-list-item-arrow-right iconfont icon-arrow-right ${
                          node.childNodes && node.childNodes.length > 0
                              ? ""
                              : " hidden"
                      }"><span class="ie-only">&#xe69b;</span></i><div class="clearfix"></div></div>`;
                });
                return `<div class="mucaser-list-item-container${
                    isSource
                        ? ""
                        : " mucaser-list-item-container-border floot" + level
                }">${_str}</div>`;
            },
            _renderListAll() {
                let opts = this.settings;
                let _tpl = "";
                let effectivelength = 1;
                _tpl += this._renderList(this.root.childNodes, 1, true);
                this.maxLevellist.forEach(item => {
                    this.showData[item.id].length > 0 && effectivelength++;
                    _tpl += this.showData[item.id].length > 0 ? this._renderList(
                        this.showData[item.id],
                        item.id + 1,
                        false
                    ) : "";
                });
                setTimeout(() => {
                    $(".mucaser-list-container")
                        .width(opts.list.width * effectivelength)
                        .html(_tpl);
                        this.maxLevellist.forEach((item, index) => {
                            $(".mucaser-list-container").children().eq(index).scrollTop(item.scrollTop);
                        });
                }, 100);
            },
            _handleClick(node, levelIndex, level, scrollTop = 0) {
                if (this.maxLevellist[level - 1]) {
                    this.maxLevellist[level - 1].rendered = true;
                    this.maxLevellist[level - 1].scrollTop = scrollTop;
                }
                if (node.isLeaf) {
                    return;
                }
                // this.activeClass = `floor-width-${
                //     node.isLeaf ? level : level + 1
                // }`;
                let tempList = [...this.activeList];
                if (level < tempList.length) {
                    tempList.splice(level);
                }
                tempList[level - 1] = node.id;
                this.showData[level] = node.childNodes;
                this.activeList = tempList;
                this._renderListAll();
            },
            _handleCheck(node) {
                let opts = this.settings;
                if (node.id == 2703) {
                    this.root.childNodes.forEach(item => {
                        item.checked = node.checked;
                        item.indeterminate = false;
                        if (item.childNodes.length > 0) {
                            item.childNodes.forEach(i => {
                                i.checked = node.checked;
                                i.indeterminate = false;
                            });
                        }
                    });
                    this.root.childNodes[0].check(node.checked);
                    if (!node.checked) {
                        this.store.selectedIds = [];
                    }
                } else {
                    node.check(node.checked);
                    if (this.root.childNodes[0].id == 2703) {
                        const isAllChecked = this.root.childNodes.filter(item => item.id !== 2703 && item.checked).length == this.root.childNodes.length - 1;
                        this.root.childNodes[0].check(isAllChecked);
                    }
                }
                this.selectedIds = this.store.selectedIds;
                this._updateSelect(this.store.selectedIds);
                // this._updateSelect(this.value, true, true)
                this._renderListAll();
                this._setValue();
            },

            /*设置默认值 $("#page").page('setPage',13)*/
            _setValue() {
                let _val = {
                    value: this.selectedNodes.map(
                        o =>
                            o[
                                this.isTwoDimensionValue
                                    ? "_idArr"
                                    : this.settings.valueKey
                            ]
                    ),
                    nodes: this.selectedNodes
                };
                let valc = "";
                if (this.isTwoDimensionValue) {
                    let _valJSON = JSON.stringify(_val.value);
                    if (_valJSON.indexOf("2703") > -1) {
                        valc = "[2703]";
                    } else {
                        valc = _valJSON;
                    }
                } else {
                    if (_val.value.indexOf("2703") > -1) {
                        valc = "2703";
                    } else {
                        valc = _val.value.join(",");
                    }
                }
                this.settings.callBack(_val, this.root.childNodes);
                $(".mucaser-value").val(_val.value.length != 0 ? valc : "");
                $(".mcr-result").text((this.selectedLabels.indexOf("全国") > -1 ? "全国" : this.selectedLabels.join(",")) || this.settings.placeholder);
                if (this.selectedLabels.length === 0) {
                    $(".mucaser-result").removeClass("no-value");
                } else {
                    $(".mucaser-result").addClass("no-value");
                }
            },
            setValue(val) {
                this.settings.value = value;
                this.init();
            },
            getValue() {
                return $(".mucaser-value").val();
            }
        };

        /*
         * 插件的私有方法
         */

        return Plugin;
    })();

    /**
     * 这里是将Plugin对象 转为jq插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.multiCascader = function(options, n) {
        return this.each(function() {
            let $me = $(this),
                instance = $me.data("multi-cascader");
            if (!instance) {
                //将实例化后的插件缓存在dom结构里（内存里）

                $me.data("multi-cascader", new MuCaser(this, options));
            }

            /**
             * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
             * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
             * doSomething是刚才定义的接口。
             * 这种方法 在 juqery ui 的插件里 很常见。
             */
            if ($.type(options) === "string") instance[options](n);
        });
    };

    /**
     * 插件的默认值
     */
    $.fn.multiCascader.defaults = {
        data: [], // 元数据
        value: [], // 已选项
        inputName: "mucaser", // input 名称
        valueKey: "id", // value
        labelKey: "name", // 文字
        showLeafLabel: true,
        childrenKey: "children", // 子级
        placeholder: "请输入",
        isTwoDimensionValue: false,
        show: false, // 默认显示还是隐藏
        list: {
            height: 300,
            width: 200
        },
        callBack: function(value) {
            //回掉，value
        }
    };

    /**
     * 优雅处： 通过data-xxx 的方式 实例化插件。
     * 这样的话 在页面上就不需要显示调用了。
     * 可以查看bootstrap 里面的JS插件写法
     */
    // $(function() {
    //     return new MuCaser($("[data-multi-cascader]"));
    // });
})(jQuery);
