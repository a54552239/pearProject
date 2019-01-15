import {message,notification} from 'ant-design-vue'

export const notice = (content, type = 'message', action = 'warning', duration = 3, placement = 'bottomLeft') => {
    destroyNotice();
    let config = {};
    config.duration = duration;
    if (type === 'message') {
        switch (action) {
            case 'info':
                return message.info(content, duration);
            case 'success':
                return message.success(content, duration);
            case 'error':
                return message.error(content, duration);
            case 'loading':
                return message.loading(content, duration);
            default:
                return message.warning(content, duration);
        }
    } else {
        config.message = content.title;
        config.description = content.msg || '';
        config.placement = placement;
        switch (action) {
            case 'open':
                return notification.open(config);
            case 'info':
                return notification.info(config);
            case 'success':
                return notification.success(config);
            case 'error':
                return notification.error(config);
            default:
                return notification.warning(config);
        }
    }
};
export const destroyNotice = (type = '') => {
    if (!type) {
        message.destroy();
        notification.destroy();
    }else{
        type === 'message' ? message.destroy() : notification.destroy();
    }
};
