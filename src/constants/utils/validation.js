/*eslint-disable*/
import { stringTrim } from "@/constants/utils/index";

// 判断输入内容是否为空
export function IsNull(str) {
    return str === undefined || str.length === 0 || str === null;
}

// 判断输入内容去掉空格是否为空
export function IsTrimNull(str) {
    if (str === undefined || str.length === 0 || str === null) {
        return true;
    }
    return stringTrim(str).length === 0;
}

// 判断日期类型是否为YYYY-MM-DD格式的类型
export function IsDate(str) {
    if (!IsNull(str)) {
        const reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
        const r = str.match(reg);
        return r !== null;
    }
}

// 判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型
export function IsDateTime(str) {
    if (!IsNull(str)) {
        const reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        const r = str.match(reg);
        return r !== null;
    }
    return false;
}

// 判断日期类型是否为hh:mm:ss格式的类型
export function IsTime(str) {
    if (!IsNull(str)) {
        const reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为英文字母
export function IsLetter(str) {
    if (!IsNull(str)) {
        const reg = /^[a-zA-Z]+$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为整数
export function IsInteger(str) {
    if (!IsNull(str)) {
        const reg = /^[-+]?\d*$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否以数字开头
export function IsStartWithInteger(str) {
    if (!IsNull(str)) {
        const reg = /^[0-9].*$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为双精度
export function IsDouble(str) {
    if (!IsNull(str)) {
        const reg = /^[-\+]?\d+(\.\d+)?$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为:a-z,A-Z,0-9,_,并以字母开头
export function IsProgramVar(str) {
    if (!IsNull(str)) {
        const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为:a-z,A-Z,0-9,_,并以大写字母开头
export function IsProgramClassName(str) {
    if (!IsNull(str)) {
        const reg = /^[A-Z][a-zA-Z0-9_]*$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为中文
export function IsChinese(str) {
    if (!IsNull(str)) {
        const reg = /^[\u0391-\uFFE5]+$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的EMAIL格式是否正确
export function IsEmail(str) {
    if (!IsNull(str)) {
        const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g;
        return reg.test(str);
    }
    return false;
}

// 判断输入的邮编(只能为六位)是否正确
export function IsZIP(str) {
    if (!IsNull(str)) {
        const reg = /^\d{6}$/;
        return reg.test(str);
    }
}

// 判断字符串的长度是否满足条件
export function isLengthValidate(str, len) {
    if (str) {
        if (str.length <= len) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

// 判断输入的字符是否为:a-z,A-Z,0-9,_,汉字
export function IsProgramName(str) {
    if (!IsNull(str)) {
        const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否为:a-z,A-Z,0-9,_,汉字
export function IsProgramCode(str) {
    if (!IsNull(str)) {
        const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        return reg.test(str);
    }
    return false;
}

// 判断输入的字符是否以http://或者https://开头，且必须是个网址
export function IsProgramWeb(str) {
    if (!IsNull(str)) {
        let reg = /^((https|http)?:\/\/)[^\s]+/;
        return reg.test(str);
    }
    return false;
}

export function isValueTypeMatched(type, value) {
    switch (type) {
        case "Integer":
            if (!/^\-?\d+$/.test(value)) {
                return false;
            }
            break;
        case "Double":
            if (!/^\-?\d+\.\d+$/.test(value)) {
                return false;
            }
            break;
        case "Long":
            if (!/^\-?\d+$/.test(value)) {
                return false;
            }
            break;
        case "Boolean":
            if (value !== "true" && value !== "false") {
                return false;
            }
            break;
        default:
            return true;
    }
    return true;
}

export function IsProperties(str) {
    if (!IsNull(str)) {
        let reg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]*\s*=\s*[a-zA-Z_0-9\u4e00-\u9fa5]+/;
        return reg.test(str);
    }
    return false;
}

// 拒绝码以大写字母开头，包含数字、大写字母、下划线，且为四段式
export function IsUppercase(str) {
    const reg = /^[A-Z]([A-Z0-9]*_){1}([A-Z0-9]+_){2}[A-Z0-9]+$/;
    return reg.test(str);
}

//判断用户名
export function IsUserName(str) {
    if (!IsNull(str)) {
        const reg = /^[a-zA-Z\d_]{4,20}$/;
        return reg.test(str);
    }
    return false;
}

//判断密码
export function IsPassword(str) {
    if (!IsNull(str)) {
        const reg = /^[a-zA-Z\d]{6,14}$/;
        return reg.test(str);
    }
    return false;
}

//判断手机号
export function IsPhone(str) {
    if (!IsNull(str)) {
        const reg = /^1[3456789]\d{9}$/;
        return reg.test(str);
    }
    return false;
}

// 判断税号
export function IsTax(str) {
    if (!IsNull(str)) {
        const reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
        return reg.test(str);
    }
    return false;
}

// 判断银行号
export function IsBankNumber(str) {
    if (!IsNull(str)) {
        const reg = /^[0-9]{16}$|^[0-9]{17}$|^[0-9]{19}$/;
        return reg.test(str);
    }
    return false;
}
