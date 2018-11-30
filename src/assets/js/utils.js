import {Message, Modal} from 'iview'
import config from '../../assets/js/config'
import $ from 'jquery'

const NODE_ENV = config.NODE_ENV;
const WEB_URL = config.WEB_URL;
const DEV_URL = config.DEV_URL;
const PROD_URL = config.PROD_URL;

export const getWebUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return WEB_URL
    } else {
        return WEB_URL
    }
};
export const showImg = (url) => {
    let url_prefix = '';
    if (process.env.NODE_ENV === 'production') {
        url_prefix = PROD_URL
    } else {
        url_prefix = DEV_URL
    }
    return url_prefix + '/public/static' + url;
};



/**
 * 判断客户端返回状态
 * @param res
 * @param show_msg
 * @returns {boolean}
 */
export const showBack = (res, show_msg = false) => {
    const ret = res.ret;
    const msg = res.msg;
    if (ret !== 200) {
        if (show_msg) {
            Message.warning(msg);
        }
        return false
    } else {
        return true
    }
};

/**
 * 操作确认
 * @param options
 * @param callback
 */
export const showWarConfirm = (options = {}, callback = function () {
}) => {
    Modal.confirm({
        title: options.title || '操作提示',
        content: '<p>' + options.content + '</p>',
        loading: true,
        onOk: () => {
            callback()
        }
    });
};


export const getApiUrl = (api) => {
    // return '/public/?service=' + api
    if (process.env.NODE_ENV === 'production') {
        return PROD_URL + '/?s=' + api
    } else {
        return '/api?service=' + api
    }
};

/**
 * 获取完整的api请求地址
 */
export const getFullUrl = (api) => {
    let baseUrl = '';
    if (process.env.NODE_ENV === 'development') {
        baseUrl = DEV_URL
    } else {
        baseUrl = PROD_URL
    }
    return baseUrl + getApiUrl(api)
};
export const getYiYan = (callback, type) => {
    if (type == undefined) {
        type = 'f';
    }
    let api = 'https://v1.hitokoto.cn/?c=' + type + '&encode=json';
    $.get({
        url: api,
        success: function (data) {
            callback(data)
        }
    })
};


/**
 * 获取完整的api请求地址
 */
export const getDirectUrl = (api) => {
    let baseUrl = '';
    if (process.env.NODE_ENV === 'development') {
        baseUrl = DEV_URL
    } else {
        baseUrl = PROD_URL
    }
    return baseUrl + '/?s=' + api
};

/**
 * 获取上传文件地址
 * @param api
 * @returns {string}
 */
export const getUploadUrl = (api) => {
    let baseUrl = '';
    // if (process.env.NODE_ENV === 'production') {
    //     baseUrl = PROD_URL
    // }
    return baseUrl + getApiUrl(api)
};


/**
 * 存储localStorage
 * @param name
 * @param content
 * @param duration Storage有效时间，单位：小时
 * @param set_time 是否设置时间
 * @returns {boolean}
 */
export const setStore = (name, content, set_time = false, duration = 0) => {
    if (!name) return false;
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    if (set_time) {
        let date = new Date;
        if (duration > 0) {
            content += '&' + (date.getTime() + duration * 3600 * 1e3)
        } else {
            content += '&0'
        }
        content += '&' + (date.getTime())
    }
    window.localStorage.setItem(name, content)
};

/**
 * 获取localStorage
 * @param name
 * @param parse // 是否json格式化
 * @returns {boolean}
 */
export const getStore = (name, parse = false) => {
    if (!name) return false;
    if (parse) {
        return JSON.parse(window.localStorage.getItem(name))
    }
    return window.localStorage.getItem(name)
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return false;
    window.localStorage.removeItem(name)
};

/**
 * 生成cookie
 * @param name cookie名称
 * @param value cookie值
 * @param duration cookie有效时间，单位：小时
 */
export const addCookie = (name, value, duration) => {
    let n = name + '=' + escape(value) + '; path=/';
    if (duration > 0) {
        let date = new Date;
        date.setTime(date.getTime() + duration * 3600 * 1e3);
        n = n + ';expires=' + date.toGMTString()
    }
    document.cookie = n
};

/**
 * 获取cookie
 * @param name cookie名称
 * @returns {null}
 */
export const getCookie = (name) => {
    let t = document.cookie;
    let a = t.split('; ');
    for (let n = 0; n < a.length; n++) {
        let r = a[n].split('=');
        if (r[0] === name) {
            return unescape(r[1])
        }
    }
    return null
};

/**
 * 移除cookie
 * @param name cookie名称
 */
export const delCookie = (name) => {
    let t = new Date;
    t.setTime(t.getTime() - 1);
    let a = getCookie(name);
    if (a !== null) document.cookie = name + '=' + a + '; path=/;expires=' + t.toGMTString()
};

export const format_date = (data, show = true) => {
    //格式化时间
    let now = new Date(data * 1000);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    // let second = now.getSeconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    const finally_date = {
        year: year,
        month: month,
        day: date,
        hour: hour,
        minute: minute
    };
    if (show) {
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute;
    } else {
        return finally_date
    }
};
/**
 * 转换时间为可阅读格式，传入date的time值
 * @param time
 * @returns {*}
 */
export const prettyTime2Chinese = (time) => {
    if (!time) {
        return '';
    }
    if (isNaN(time)) {
        return '格式不正确';
    }
    var minute = 60 * 1000, //1分钟
        hour = 60 * minute, //1小时
        day = 24 * hour, //1天
        month = 12 * day,//月
        year = 12 * month;//年

    var diff = new Date().getTime() - time;
    var r = 0;
    if (diff > year) {
        r = parseInt(diff / year);
        return r + "年前";
    }
    if (diff > month) {
        r = parseInt(diff / month);
        return r + "个月前";
    }
    if (diff > day) {
        r = parseInt(diff / day);
        if (r == 1) {
            return "昨天";
        }
        return r + "天前";
    }
    if (diff > hour) {
        r = parseInt(diff / hour);
        return r + "个小时前";
    }
    if (diff > minute) {
        r = parseInt(diff / minute);
        return r + "分钟前";
    }
    return "刚刚";
};

/**
 * 数字转英文字母
 * 如：1->A
 * @param num
 * @returns {string}
 */
export const convert = (num) => {
    let result = "";
    while (num) {
        result = String.fromCharCode(--num % 26 + 65) + result;
        num = Math.floor(num / 26)
    }
    return result
};
/**
 * 获取推送消息
 * 如：1->A
 * @param num
 * @returns {string}
 */
export const getPushData = (data) => {
    return JSON.parse(data)
};
// export const snail = (array) => {
//   let arrs = [];
//   for(var i=0,l=array.length;i<l;i++) {
//     if(!Array.isArray(array[i])) arrs.push(array[i]);
//     else arrs = arrs.concat(snail(array[i]) );
//   }
//   return arrs;
// }
export const snail = (arr) => {
    for (var a in obj) {
        if (typeof (obj[a]) == "object") {
            return snail(obj[a], value); //递归遍历
        }
        else {
            if (a === 'path') {
                if (obj[a] === value) {
                    console.log(a + "=" + obj[a]);
                    return true;
                }
            }
        }
    }
};

// 判断参数是否是其中之一
export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

/**
 * 根据class获取节点
 * @param className
 * @param tag
 * @returns {NodeList}
 */
export const getClassObj = (className, tag) => {
    tag = tag || document;
    className = className || '*';
    let findarr = [];
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(className)
    }
    let el = document.getElementsByTagName(tag);
    let pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
    for (let i = 0; i < el.length; i++) {
        if (pattern.test(el[i].className)) {
            findarr.push(el[i])
        }
    }
};

/**
 * 判断某dom是否有滚动条
 * @param el dom对象
 * @param direction 垂直滚动或水平滚动
 * @returns {boolean}
 */
export const hasScrolled = (el, direction = "vertical") => {
    if (!el) {
        return false;
    }
    let overflow = el.currentStyle ? el.currentStyle.overflow :
        window.getComputedStyle(el).getPropertyValue("overflow");
    if (overflow === "hidden") return false;

    if (direction === "vertical") {
        return el.scrollHeight > el.clientHeight;
    } else if (direction === "horizontal") {
        return el.scrollWidth > el.clientWidth;
    }
};
