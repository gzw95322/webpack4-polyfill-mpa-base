/*eslint-disable*/
import "./index.scss";
/*
 * checkbox & radio plugin
 */
/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function($) {
    /**
     * 定义一个插件 Plugin
     */
    var RdoChk, privateMethod, timer; //插件的私有方法，也可以看做是插件的工具方法集

    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用一个 Plugin 的单例模式 包含一个 Plugin的类，主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了Plugin类里，这时建议私有方法前加上"_"
     */
    RdoChk = (function() {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */
        function chkPlugin(element, options) {
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.rdochk.defaults, options);
            //如果将参数设置在dom的自定义属性里，也可以这样写
            //this.settings = $.extend({}, $.fn.plugin.defaults, this.$element.data(), options);
            this.selectedIds = [];
            this.allCheckedIndex = 0;
            var opts = this.settings;
            var obj = this.$element;
            var _this = this;
            this.init();
            obj.on("click", "li", function() {
                let $this = $(this);
                const _idx = $this.data().idx;
                const _id = $this.data().id;
                // if (timer) clearTimeout(timer);
                // setTimeout(() => {
                _this.selectedIds = [];
                // 单选与全选互斥
                if (opts.type == "radio" && !opts.allCheckedValue) {
                    opts.data.forEach(item => item.selected = false);
                    opts.data[_idx].selected = true;
                    _this.selectedIds = String(_id);
                } else {
                    // 全选情况处理
                    if (!!opts.allCheckedValue && _id == opts.allCheckedValue) {
                        const _flag = opts.data.every(i => i.selected);
                        opts.data.forEach(item => item.selected = !_flag);
                    } else {
                        opts.data[_idx].selected = !opts.data[_idx].selected;
                        // opts.data[_this.allCheckedIndex].selected = opts.data[_this.allCheckedIndex].selected ? false : opts.data.filter(item => item.selected).length === opts.data.length - 1;
                    }
                    opts.data.forEach(item => {
                        // 全选返回值处理
                        if (item.selected) {
                            if (opts.allCheckedValue) {
                                switch (opts.allCheckedUse) {
                                    case "all":
                                        _this.selectedIds.push(item[opts.valueKey]);
                                        break;
                                    case -1:case "-1":
                                        item[opts.valueKey] == opts.allCheckedValue && _this.selectedIds.push(item[opts.valueKey]);
                                        break;
                                    case "children":
                                        item[opts.valueKey] != opts.allCheckedValue && _this.selectedIds.push(item[opts.valueKey]);
                                        break;
                                    default:
                                        item[opts.valueKey] != opts.allCheckedValue && _this.selectedIds.push(item[opts.valueKey]);
                                        break;
                                }
                            } else {
                                _this.selectedIds.push(item[opts.valueKey]);
                            }
                        }
                    });
                }
                let obj_id = obj.attr("id");
                $(`#${obj_id} .rdochk-list`).html((_this._renderList(opts.data)) + '<div class="clearfix"></div>');
                $(`input[name=${opts.inputName}]`).val(typeof _this.selectedIds == "string" ? _this.selectedIds : _this.selectedIds.join(","));
                opts.callBack(_this.selectedIds, obj);
                // }, 200);
                // console.log(_this.selectedIds);
                return false;
            });

            //});
        }

        /**
         * 将插件所有函数放在prototype的大对象里
         * 插件的公共方法，相当于接口函数，用于给外部调用
         * @type {{}}
         */
        chkPlugin.prototype = {
            init: function(val) {
                let opts = this.settings;
                let $this = this.$element;
                this.selectedIds = val || opts.value;
                // 全选值判断提示
                if (!!opts.allCheckedValue) {
                    if (typeof opts.allCheckedValue != "string") {
                        console.error('When the value of "allCheckedValue" is valid, it must be a string');
                        return;
                    } else if (opts.type == "radio") {
                        console.error('When type is radio, "allCheckedValue" should not be set');
                        return;
                    } else {
                    }
                }
                opts.data.forEach((item, index, arr) => {
                    if (typeof item != "object") {
                        arr[index] = {
                            [opts.valueKey]: item,
                            [opts.labelKey]: item
                        };
                        arr[index].selected = Array.isArray(this.selectedIds) ? this.selectedIds.some(i => String(i) === String(arr[index][opts.valueKey])) : this.selectedIds == String(arr[index][opts.valueKey]);
                    } else {
                        item.selected =  Array.isArray(this.selectedIds) ? this.selectedIds.some(i => String(i) === String(item[opts.valueKey])) : this.selectedIds == String(arr[index][opts.valueKey]);
                    }
                });
                if (!!opts.allCheckedValue) {
                    this.allCheckedIndex = opts.data.findIndex(item => item[opts.valueKey] == opts.allCheckedValue);
                    opts.data[this.allCheckedIndex].selected = opts.data[this.allCheckedIndex].selected ? false : opts.data.filter(item => item.selected).length === opts.data.length - 1; // 默认选中处理全选
                }
                const _tpl = this._renderList(opts.data);
                $this.addClass(`rdochk ${opts.className}`).html(`
                <input type="hidden" name="${opts.inputName}" value="${(Array.isArray(this.selectedIds) ? this.selectedIds.join(",") : this.selectedIds)}">
                <ul class="rdochk-list">${_tpl}<div class="clearfix"></div></ul>
                `);
            },
            _renderList(data = []) {
                let opts = this.settings;
                let tpl = "";
                data.forEach((item, index) => {
                    tpl += opts.tpl(item, index);
                });
                return tpl;

            },
            setValue(val) {
                this.init(val);
            }
        };

        /*
         * 插件的私有方法
         */

        return chkPlugin;
    })();

    /**
     * 这里是将Plugin对象 转为jq插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.rdochk = function(options, n) {
        return this.each(function() {
            var $me = $(this),
                instance = $me.data("rdochk");
            if (!instance) {
                //将实例化后的插件缓存在dom结构里（内存里）
                $me.data("rdochk", new RdoChk(this, options));
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
    $.fn.rdochk.defaults = {
        type: "checkbox", // 单选radio,多选checkbox, 默认多选
        data: [], // 元数据
        value: [], // 默认值, 单选时为string, 多选时为array
        allCheckedValue: false, // 全选的id值, 没有全选时为false
        allCheckedUse: "children", // 全选时返回什么值, all返回全选的值和子值, -1只返回全选的值, children只返回子值
        inputName: "chk",
        className: "",
        valueKey: "id", // value
        labelKey: "name", // 文字
        tpl: function (item, index) {
            return `<li class="rdochk-list-item${item.selected ? ' active' : ''}" data-id="${item[this.valueKey]}" data-idx="${index}">${item[this.labelKey]}</li>`
        },
        callBack: function(value, ele) {
            //回掉
        }
    };
    
})(jQuery);
