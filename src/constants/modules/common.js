/* eslint-disable no-undef */
// 缺失的api
import "core-js/features/object/define-property";
import "core-js/features/object/create";
import "core-js/features/object/assign";
import "core-js/features/array/index-of";
import "core-js/features/array/from";
import "core-js/features/array/some";
import "core-js/features/array/every";
import "core-js/features/array/for-each";
import "core-js/features/array/map";
import "core-js/features/array/find";
import "core-js/features/array/fill";
import "core-js/features/array/filter";
import "core-js/features/array/is-array";
import "core-js/features/array/includes";
import "core-js/features/string/includes";
import "core-js/features/array/find-index";
import "core-js/features/promise";
import "core-js/features/symbol";
import "regenerator-runtime/runtime";

import "jquery-1.8";
import "layui-layer";
import nsevent from "nsevent";
import "@/constants/modules/jquery-placeholder";
import "@/public/global.scss";

const config = require("../../../config"); // 菜单
let USER_INFO = {}; // 用户信息
$(function() {
    refreshSafariBack();
    $("input, textarea").placeholder();
    $("#loadingAll").fadeOut(); // 页面默认加载loading效果关闭
});
var LAYER_CONFIG = {
    title: "",
    area: "300px",
    resize: false,
    scrollbar: false,
    move: false
};
// 全局loading控制
var globalLoading = 0;
var _loadingIndex = null;
var loadingTimer = null;
nsevent.on("ADD_LOADING", () => {
    globalLoading++;
    if (globalLoading > 0 && !_loadingIndex) {
        if (loadingTimer) {
            clearTimeout(loadingTimer);
        }
        loadingTimer = setTimeout(() => {
            // eslint-disable-next-line
            _loadingIndex = layer.open({
                type: 3,
                area: ["230px", "130px"],
                icon: 16,
                content: `<div class="rqs-loading-img">加载中</div>`,
                skin: "rqs-loading",
                time: 0,
                shade: [0.01, "#fff"],
                shadeClose: true
            });
        }, 500);
    }
});
nsevent.on("DEL_LOADING", () => {
    globalLoading--;
    if (globalLoading <= 0) {
        // eslint-disable-next-line
        layer.close(_loadingIndex);
        _loadingIndex = null;
        globalLoading = 0;
        clearTimeout(loadingTimer);
    }
});
nsevent.on("UPDATE_USER_ROLE", isRefresh => {
    console.log(1111);
});

// 针对safari回退不刷新
function refreshSafariBack() {
    var browserRule = /^.*((iphone)|(ipad)|(safari))+.*$/;
    if (browserRule.test(navigator.userAgent.toLocaleLowerCase())) {
        window.onpageshow = function(event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
    }
}

