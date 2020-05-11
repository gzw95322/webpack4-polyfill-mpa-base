/*eslint-disable*/
import "./index.scss";
/*
 * tab switch
 */
/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function($) {
    /**
     * 定义一个插件 Plugin
     */
    var TabSwitch, privateMethod, timer; //插件的私有方法，也可以看做是插件的工具方法集

    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用一个 Plugin 的单例模式 包含一个 Plugin的类，主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了Plugin类里，这时建议私有方法前加上"_"
     */
    TabSwitch = (function() {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */
        function tabPlugin(element, options) {
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.tabSwitch.defaults, options);
            //如果将参数设置在dom的自定义属性里，也可以这样写
            //this.settings = $.extend({}, $.fn.plugin.defaults, this.$element.data(), options);
            var opts = this.settings;
            var obj = this.$element;
            var _this = this;
            this.init();
            obj.on("click", `${opts.tabBarClassName} a`, function() {
                let $this = $(this);
                let currentIndex = $this.index();
                opts.callBack({
                    el: $this,
                    currentIndex
                });
                _this.tabChange(currentIndex);
                return false;
            });

            //});
        }

        /**
         * 将插件所有函数放在prototype的大对象里
         * 插件的公共方法，相当于接口函数，用于给外部调用
         * @type {{}}
         */
        tabPlugin.prototype = {
            init: function(val) {
                let opts = this.settings;
                this.selectedIndex = val || opts.initIndex;
                this.tabChange(this.selectedIndex);
            },
            tabChange: function(index = 0) {
                const { activeClassName, tabBarClassName, tabBodyClassName, syncEleClassName } = this.settings;
                $(`${tabBarClassName} ${tabBarClassName}_item:eq(${index})`).addClass(activeClassName).siblings().removeClass(activeClassName);
                $(`${tabBodyClassName} ${tabBodyClassName}_item:eq(${index})`).addClass(activeClassName).siblings().removeClass(activeClassName);
                $(`${syncEleClassName} ${syncEleClassName}_item:eq(${index})`).addClass(activeClassName).siblings().removeClass(activeClassName);
            }
        };

        /*
         * 插件的私有方法
         */

        return tabPlugin;
    })();

    /**
     * 这里是将Plugin对象 转为jq插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.tabSwitch = function(options, n) {
        return this.each(function() {
            var $me = $(this),
                instance = $me.data("tabSwitch");
            if (!instance) {
                //将实例化后的插件缓存在dom结构里（内存里）
                $me.data("tabSwitch", new TabSwitch(this, options));
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
    $.fn.tabSwitch.defaults = {
        initIndex: 0, // 初始位置
        tabBarClassName: ".tab-bar", // 子元素默认加_item
        tabBodyClassName: ".tab-body", // 子元素默认加_item
        syncEleClassName: ".tab-condition", // 需要同步的元素，子元素默认加_item
        activeClassName: "active", // 选择的样式，统一为active
        callBack: function(value) {
            //回掉, 返回index
        }
    };
    
})(jQuery);
