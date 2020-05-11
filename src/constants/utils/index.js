/**
 * 时间转换
 * @param {String} time 需要转换的时间
 * @param {String} cFormat 格式 {y}-{m}-{d} {h}:{i}:{s}
 * @return: {String} timeStr 转换完成的时间
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return "-";
    }
    if (time == null) {
        return "-";
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (time == "") {
        date = new Date();
    } else if (typeof time === "object") {
        date = time;
    } else {
        if (("" + time).length === 10) time = parseInt(time) * 1000;
        if (String(time).indexOf("T") > -1) {
            time = time.replace(/T/g, " ").replace(/\..*/g, "");
        }
        if (String(time).indexOf("-") > -1 && String(time).indexOf("T") == -1) {
            time = time.replace(/-/g, "/");
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
            value = "0" + value;
        }
        return value || 0;
    });
    return timeStr;
}

/**
 * 时间显示效果显示
 * @param {String} time 需要转换的时间
 * @param {String} option 格式 {y}-{m}-{d} {h}:{i}:{s}
 * @return: {String} 转换完成的时间
 */
export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

/**
 * 延时函数
 * @param {Function} func 方法
 * @param {Number} wait 等待时间
 * @param {Boolean} immediate 是否立即执行
 * @return: {Function} result 方法执行
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}
/**
 * 替换邮箱字符
 * @param {String} email 输入字符串
 * @return: {Function} new_email 邮箱
 */
export function regEmail(email) {
    if (String(email).indexOf("@") > 0) {
        const str = email.split("@");
        let _s = "";
        if (str[0].length > 3) {
            for (var i = 0; i < str[0].length - 3; i++) {
                _s += "*";
            }
        }
        var new_email = str[0].substr(0, 3) + _s + "@" + str[1];
    }
    return new_email;
}

/**
 * 替换手机字符
 * @param {String} mobile 输入字符串
 * @return: {Function} new_email 邮箱
 */
export function regMobile(mobile) {
    if (mobile.length > 7) {
        var new_mobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
    }
    return new_mobile;
}

/**
 * 去除两侧空格
 * @param {String} s 输入字符串
 * @return: {Function} new_email 邮箱
 */
export function stringTrim(s) {
    s = stringTrimLeft(s);
    return stringTrimRight(s);
}

/**
 * 去除左侧空格
 * @param {String} s 输入字符串
 * @return: {Function} new_email 邮箱
 */
export function stringTrimLeft(s) {
    return s.replace(/^[\s\n\t]+/g, "");
}

/**
 * 去除右侧空格
 * @param {String} s 输入字符串
 * @return: {Function} new_email 邮箱
 */
export function stringTrimRight(s) {
    return s.replace(/[\s\n\t]+$/g, "");
}

/**
 * 只能输入中文、英文、数字
 * @param {String} str 输入字符串
 * @return: {String} new_stremail 中文、英文、数字
 */
export function filterSc(str) {
    // eslint-disable-next-line
    return str.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "");
}

/**
 * 字符长度（中文）
 * @param  {String} str 输入字符串
 * @return: {Number} len 长度
 */
export function strLen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
}

/**
 * 替换emoji表情
 * @param {String} name 输入字符串
 * @return: {String} str 字符串
 */
export function filterEmoji(name) {
    // eslint-disable-next-line
    let str = name.replace(
        // eslint-disable-next-line
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
        ""
    );
    return str;
}
/**
 * xss处理
 * @param {String} s 输入字符串
 * @return: {String} str 字符串
 */

export function xssParse(str) {
    return str
        ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function(m) {
              return {
                  "&lt;": "<",
                  "&amp;": "&",
                  "&quot;": '"',
                  "&gt;": ">",
                  "&#39;": "'",
                  "&nbsp;": " "
              }[m];
          })
        : "";
}

/**
 * hash路由获取url参数
 * @param {String} searchString  输入字符串
 * @return: {String} str 字符串
 */
export function parseSearch(searchString) {
    if (!searchString) {
        return {};
    }
    if (!searchString.includes("?")) {
        return {};
    }
    return searchString
        .split("?")[1]
        .split("#")[0]
        .split("&")
        .reduce((result, next) => {
            const pair = next.split("=");
            try {
                result[decodeURIComponent(pair[0])] = decodeURIComponent(
                    pair[1]
                );
            } catch (e) {
                // eslint-disable-next-line
                //   result[decodeURIComponent(pair[0])] = window.$URL.decode(pair[1]);
            }
            return result;
        }, {});
}

/**
 * 创建 scirpt 标签
 * @param {String} url  输入url
 */
export function createScript(url) {
    const script = document.createElement("script");
    script.setAttribute("async", "true");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    document.body.appendChild(script);
}
/**
 * 创建 link 标签
 * @param {String} url  输入url
 */
export function createLink(url) {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("media", "all");
    link.setAttribute("href", url);
    const heads = document.getElementsByTagName("head");
    if (heads.length) {
        heads[0].appendChild(link);
    } else {
        document.body.appendChild(link);
    }
}

/**
 * iframe文件下载
 * @param {String} url 文件地址
 */
export function iframeDownload(url) {
    const iframe = document.createElement("iframe");

    iframe.style.display = "none";

    function iframeLoad() {
        console.log("iframe onload");

        const win = iframe.contentWindow;

        // const doc = win.document;

        if (win.location.href === url) {
            // if (doc.body.childNodes.length > 0) {
            // }

            iframe.parentNode.removeChild(iframe);
        }
    }

    if ("onload" in iframe) {
        iframe.onload = iframeLoad;
    } else if (iframe.attachEvent) {
        iframe.attachEvent("onload", iframeLoad);
    } else {
        iframe.onreadystatechange = function onreadystatechange() {
            if (iframe.readyState === "complete") {
                iframeLoad();
            }
        };
    }

    iframe.src = "";

    document.body.appendChild(iframe);

    setTimeout(function loadUrl() {
        iframe.contentWindow.location.href = url;
    }, 50);
}
