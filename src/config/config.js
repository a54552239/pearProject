export default {
    crossDomain: process.env.VUE_APP_CROSS_DOMAIN, //是否开启跨域支持
    PROD_URL: process.env.VUE_APP_API_URL, //生产环境接口地址
    WS_URI: process.env.VUE_APP_WS_URI,//wss://beta.vilson.xyz:2345 //WebSocket地址
    HOME_PAGE: process.env.VUE_APP_HOME_PAGE,//主页路由
};
