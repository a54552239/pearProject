import {Message,Notice} from 'iview'

export default (content, type = 'message', action = 'warning', duration = 2) => {
    let config = {};
    config.duration = duration;
    if (type === 'message') {
        config.content = content;
        switch (action) {
            case 'info':
                return Message.info(config);
            case 'success':
                return Message.success(config);
            case 'error':
                return Message.success(config);
            case 'loading':
                return Message.loading(config);
            default:
                return Message.warning(config);
        }
    } else {
        config.title = content.title;
        config.desc = content.desc || '';
        switch (action) {
            case 'open':
                return Notice.open(config);
            case 'info':
                return Notice.info(config);
            case 'success':
                return Notice.success(config);
            case 'error':
                return Notice.success(config);
            default:
                return Notice.warning(config);
        }
    }
}