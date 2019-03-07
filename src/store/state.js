import {getStore} from "../assets/js/storage";

const userInfo = getStore('userInfo', true);
const theme = getStore('theme');
export default {
    theme: theme ? theme : 'dark',
    logged: !!userInfo,//登录状态
    userInfo: userInfo,//用户信息
    organizationList: getStore('organizationList', true),//能查看的组织列表
    currentOrganization: getStore('currentOrganization', true),//当前组织
    system: getStore('system', true),//系统配置
    windowLoading: false, // 窗口loading
    pageLoading: false, // 页面加载loading
    socketAction: '',
    boundClient: false,//是否绑定client

}
