/*
 * @Description: ajax请求
 * @Date: 2019-08-02 11:55:09
 * @LastEditors: gzw
 * @LastEditTime: 2020-05-11 17:00:14
 */
import Qs from "qs";
import nsevent from "nsevent";

require("jquery-1.8");
require("layui-layer");
var LAYER_CONFIG = {
    title: "",
    area: "300px",
    resize: false,
    scrollbar: false,
    move: false
};
jQuery.support.cors = true;
$.ajaxSetup({
    cache: false,
    statusCode: {
        401: function() {
            
        },
        402: function() {
            
        },
        403: function() {
            loadError("", "当前账号没有访问权限！");
        },
        429: function() {
        }
    }
});
/**
 * @description: 请求基本方法
 * @param {Object} config
 *  @param {Object} param 请求的参数
 *  @param {String} method 方法 GET/POST
 *  @param {String} path 路径
 *  @param {Function} callback 回调方法
 * @return:
 */
function _ajax(config) {
    // const msielt9 = /msie (9|8|7|6)\.0/i.test(
    //     window.navigator.userAgent.toLowerCase()
    // );
    // if (msielt9 && window.XDomainRequest) {
    //     // Use Microsoft XDR
    //     // eslint-disable-next-line
    //     var xdr = new XDomainRequest();
    //     xdr.timeout = 10000;
    //     xdr.open(config.method, config.path + "?" + _param);
    //     xdr.onload = function() {
    //         // eslint-disable-next-line
    //         layer.close(_loadingIndex);
    //         config.callback(eval("(" + xdr.responseText + ")"));
    //     };
    //     xdr.ontimeout = function() {
    //         loadError(_loadingIndex);
    //     };
    //     xdr.onerror = function() {
    //         loadError(_loadingIndex);
    //     };
    //     if (config.method.toLowerCase() == "post") {
    //         xdr.send(_param);
    //     } else {
    //         xdr.send();
    //     }
    // } else {
    nsevent.emit("ADD_LOADING");
    $.ajax({
        type: config.method || "post",
        url: config.path,
        data: config.param,
        timeout: 30000,
        contentType: config.contentType || "application/json",
        headers: headers,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(res) {
            config.callback(res);
            nsevent.emit("DEL_LOADING");
        },
        complete: function(xhr) {
        },
        error: function(err) {
            loadError();
            config.error(err);
            // console.log(xhr);
            // config.callback(xhr);
        }
    });
    // }
}

/**
 * @description: 关闭提示弹框
 * @param {Number} idx 弹框index
 * @return:
 */
// eslint-disable-next-line
function loadError(idx, msg) {
    nsevent.emit("DEL_LOADING");
    // eslint-disable-next-line
    layer.close(idx || layer.index);
    // eslint-disable-next-line
    layer.msg(msg || "请求异常，请稍后重新获取！");
}

// 网络检测监听
var el = document.body;
var offlineTipIndex = "";
(function() {
    if (el.addEventListener) {
        window.addEventListener(
            "online",
            function() {
                // eslint-disable-next-line
                layer.close(offlineTipIndex);
            },
            true
        );
        window.addEventListener(
            "offline",
            function() {
                errorTip();
            },
            true
        );
    } else if (el.attachEvent) {
        window.attachEvent("ononline", function() {
            // eslint-disable-next-line
            layer.close(offlineTipIndex);
        });
        window.attachEvent("onoffline", function() {
            errorTip();
        });
    } else {
        window.ononline = function() {
            // eslint-disable-next-line
            layer.close(offlineTipIndex);
        };
        window.onoffline = function() {
            errorTip();
        };
    }

    function errorTip() {
        // eslint-disable-next-line
        offlineTipIndex = layer.msg(
            "检测到网络连接异常, 请检查网络连接及DNS解析是否正常! "
        );
    }
})();
export default {
    /**
     * @description: get快捷请求
     * @param {String} url 请求路径
     * @param {Obeject} param 请求参数
     * @return:
     */
    get(url, param) {
        return new Promise((resolve, reject) => {
            const _param = $.param(param);
            _ajax({
                method: "get",
                path: url + (_param ? "?" + _param : ""),
                param: {},
                callback: function(res) {
                    resolve(res);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    },
    /**
     * @description: post快捷请求
     * @param {String} url 请求路径
     * @param {Obeject} param 请求参数
     * @return:
     */
    post(url, param) {
        return new Promise((resolve, reject) => {
            _ajax({
                method: "post",
                path: url,
                param: JSON.stringify(param),
                contentType: "application/json",
                callback: function(res) {
                    resolve(res);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    },
    /**
     * @description: post快捷请求x-www-form-urlencoded
     * @param {String} url 请求路径
     * @param {Obeject} param 请求参数
     * @return:
     */
    postForm(url, param) {
        return new Promise((resolve, reject) => {
            _ajax({
                method: "post",
                path: url,
                param: param,
                contentType: "application/x-www-form-urlencoded",
                callback: function(res) {
                    resolve(res);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    },
    /**
     * @description: post快捷请求x-www-form-urlencoded
     * @param {String} url 请求路径
     * @param {Obeject} param 请求参数
     * @return:
     */
    postFormRepeat(url, param) {
        return new Promise((resolve, reject) => {
            _ajax({
                method: "post",
                path: url,
                param: Qs.stringify(param, {
                    arrayFormat: "repeat"
                }),
                contentType: "application/x-www-form-urlencoded",
                callback: function(res) {
                    resolve(res);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }
};
