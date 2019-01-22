/**
 * Created by vilson on 17/6/4.
 */
export const showMsgNotification = (title, msg, $opt = {}) => {
    let options = {
        body: msg,
        icon: $opt.icon || "http://static.vilson.xyz/preview.jpg",
        showTime: $opt.showTime || 15000,
        onclick: $opt.onclick,
        onshow: $opt.onshow,
        onerror: $opt.onerror,
        onclose: $opt.onclose,
    };
    let Notification = window.Notification || window.mozNotification || window.webkitNotification;
    console.log(Notification.permission);
    if (Notification && Notification.permission === "granted") {
        let instance = new Notification(title, options);
        instance.onclick = function () {
            // Something to do
            if (typeof options.onclick === 'function') {
                options.onclick(instance)
            }
            // window.location.href = instance.icon
        };
        instance.onerror = function () {
            // Something to do
            if (typeof options.onerror === 'function') {
                options.onerror(instance)
            }
        };
        instance.onshow = function () {
            // Something to do
            if (typeof options.onshow === 'function') {
                options.onshow(instance)
            }
            setTimeout(function () {
                instance.close();
            }, options.showTime)
        };
        instance.onclose = function () {
            // Something to do
            if (typeof options.onclose === 'function') {
                options.onclose(instance)
            }
        };
    } else if (Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            // If the user said okay
            if (status === "granted") {
                let instance = new Notification(title, options);
                instance.onclick = function () {
                    // Something to do
                    if (typeof options.onclick === 'function') {
                        options.onclick(instance)
                    }
                };
                instance.onerror = function () {
                    // Something to do
                    if (typeof options.onerror === 'function') {
                        options.onerror(instance)
                    }
                };
                instance.onshow = function () {
                    // Something to do
                    if (typeof options.onshow === 'function') {
                        options.onshow(instance)
                    }
                    setTimeout(function () {
                        instance.close();
                    }, options.showTime)
                };
                instance.onclose = function () {
                    // Something to do
                    if (typeof options.onclose === 'function') {
                        options.onclose(instance)
                    }
                };
            } else {
                return false
            }
        });
    } else {
        return false;
    }
};
