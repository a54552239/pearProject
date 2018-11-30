import $ from 'jquery'
export function getYiYan(callback, type) {
    if (type === undefined) {
        type = 'f';
    }
    let api = 'https://v1.hitokoto.cn/?c=' + type + '&encode=json';
    $.get({
        url: api,
        success: function (data) {
            callback(data);
        }
    })
}