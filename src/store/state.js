import {getStore} from "../assets/js/utils";

export default {
    socketAction: '',
    logged : false,
    page_loading: false, // 页面加载loading
    list_reload: false, // 返回上级是否重新加载列表
    show_menu_slide: true, // 是否显示侧边的导航栏
    user_info: getStore('user_info', true) ? getStore('user_info', true) : null,// 当前用户信息
    online_user: [],//在线用户
    notify_no_read_list: [], //未读消息列表
    notify_no_read_count: 0,
    system_info: getStore('system_info', true) ? getStore('system_info', true) : {'site_name': ''}, // 站点信息
    last_path: getStore('last_path') ? getStore('last_path') : '/project/overview', // 上次访问地址

}
