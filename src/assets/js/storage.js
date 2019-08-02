export const PREFIX = 'ep_';
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
    name = PREFIX + name;
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
    name = PREFIX + name;
    if (parse) {
        if (typeof(window.localStorage.getItem(name)) == "string" && window.localStorage.getItem(name) != "undefined") {
            return JSON.parse(window.localStorage.getItem(name))
        }
    }
    return window.localStorage.getItem(name)
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return false;
    name = PREFIX + name;
    window.localStorage.removeItem(name)
};

/**
 * 生成cookie
 * @param name cookie名称
 * @param value cookie值
 * @param duration cookie有效时间，单位：小时
 */
export const addCookie = (name, value, duration) => {
    name = PREFIX + name;
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
    name = PREFIX + name;
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
    name = PREFIX + name;
    let t = new Date;
    t.setTime(t.getTime() - 1);
    let a = getCookie(name);
    if (a !== null) document.cookie = name + '=' + a + '; path=/;expires=' + t.toGMTString()
};
