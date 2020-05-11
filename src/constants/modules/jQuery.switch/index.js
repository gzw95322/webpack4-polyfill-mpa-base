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
    var SwitchBtn, privateMethod, timer; //插件的私有方法，也可以看做是插件的工具方法集

    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用一个 Plugin 的单例模式 包含一个 Plugin的类，主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了Plugin类里，这时建议私有方法前加上"_"
     */
    SwitchBtn = (function() {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */
        function switchPlugin(element, options) {
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.switchBtn.defaults, options);
            //如果将参数设置在dom的自定义属性里，也可以这样写
            //this.settings = $.extend({}, $.fn.plugin.defaults, this.$element.data(), options);
            this.selectedId = "";
            this.allCheckedIndex = 0;
            var opts = this.settings;
            var obj = this.$element;
            var _this = this;
            this.init();
            obj.on("click", function() {
                let $this = $(this);
                // setTimeout(() => {
                _this.selectedId = _this.selectedId == opts.data[1] ? opts.data[0] : opts.data[1];
                $(`#${obj.attr("id")} .switch-btn-container`).html(_this._renderList(_this.selectedId));
                $(`input[name=${opts.inputName}]`).val(_this.selectedId);
                opts.callBack(_this.selectedId);
                return false;
            });

            //});
        }

        /**
         * 将插件所有函数放在prototype的大对象里
         * 插件的公共方法，相当于接口函数，用于给外部调用
         * @type {{}}
         */
        switchPlugin.prototype = {
            init: function(val) {
                let opts = this.settings;
                let $this = this.$element;
                this.selectedId = val || opts.value;
                $this
                    .addClass("switch-btn")
                    .html(
                        `<input type="hidden" name="${
                            opts.inputName
                        }"><div class="switch-btn-container">${this._renderList(this.selectedId)}</div>`
                    ).promise().done(() => {
                        $(`input[name=${opts.inputName}]`).val(this.selectedId);
                    });
                
            },
            _renderList(data = 0) {
                let opts = this.settings;
                let tpl = `
                    <i class="iconfont ${
                        data == opts.data[1]
                            ? "icon-switch-on"
                            : "icon-switch-off"
                    }"></i><span class="switch-btn-label">${opts.label}</span>
                `;
                return tpl;
            },
            setValue(val) {
                this.init(val);
            }
        };

        /*
         * 插件的私有方法
         */

        return switchPlugin;
    })();

    /**
     * 这里是将Plugin对象 转为jq插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.switchBtn = function(options, n) {
        return this.each(function() {
            var $me = $(this),
                instance = $me.data("switchBtn");
            if (!instance) {
                //将实例化后的插件缓存在dom结构里（内存里）
                $me.data("switchBtn", new SwitchBtn(this, options));
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
    $.fn.switchBtn.defaults = {
        type: "checkbox", // 单选radio,多选checkbox, 默认多选
        data: [0, 1], // 第一个为关的值，第二个为开的值
        label: "开关",
        value: 0, // 默认值, 单选时为string, 多选时为array
        inputName: "chk",
        className: "",
        callBack: function(value) {
            //回掉
        }
    };
})(jQuery);
