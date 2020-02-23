import {message,} from 'ant-design-vue'
import Axios from "axios"
import * as utils from './utils'
import {getStore} from './storage'
import $store from '../../store/index';
import $router from '../../router/index';
import {notice} from './notice';
import config from "../../config/config";

let HOME_PAGE = config.HOME_PAGE;
const currentOrganization = getStore('currentOrganization', true);
if (currentOrganization) {
    HOME_PAGE = HOME_PAGE + '/' + currentOrganization.code;
}
const crossDomain = config.crossDomain;
let axiosConfig = {};
if (crossDomain) {
    axiosConfig.withCredentials = true;
    axiosConfig.crossDomain = true;
}
const $http = Axios.create(axiosConfig);

// Before request
$http.interceptors.request.use(
    config => {
        //正在请求更新token时，其他接口等待
        config.url = utils.getApiUrl(config.url);
        if (config.method === 'post') {
            const querystring = require('querystring');
            config.data = querystring.stringify(config.data);
        }
        let tokenList = getStore('tokenList', true);
        if (tokenList) {
            let accessToken = tokenList.accessToken;
            let tokenType = tokenList.tokenType;
            config.headers.Authorization = `${tokenType} ${accessToken}`;
        }
        let organization = getStore('currentOrganization', true);
        if (organization) {
            config.headers.organizationCode = organization.code;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// After request
$http.interceptors.response.use(
    response => {
        response = response.data;
        response.code = Number(response.code);
        switch (response.code) {
            case 200:
                response.msg !== '' && notice(response.msg, 'message', 'success');
                return Promise.resolve(response);
            case 401:
                $router.replace('/member/login?redirect=' + $router.currentRoute.fullPath);
                $store.dispatch('SET_LOGOUT');
                return Promise.resolve(response);
            case 403:
                notice({
                    title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
                }, 'notice', 'error', 5);
                return Promise.resolve(response);
            case 4031:
                //无权限操作资源
                notice({
                    title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
                }, 'notice', 'error', 5);
                $router.replace(HOME_PAGE);
                return Promise.resolve(response);
            case 4041:
                //资源不存在
                notice({
                    title: response.msg !== '' ? response.msg : '资源不存在',
                }, 'notice', 'warning', 5);
                $router.replace(HOME_PAGE);
                return Promise.resolve(response);
        }
        if (response.code === 200) {
            notice({
                title: '请求错误 ' + response.code,
                desc: response.msg
            }, 'notice', 'warning', 5);
            return Promise.resolve(response);
        } else {
            response.msg !== '' && notice({
                title: response.msg,
            }, 'notice', 'error', 5);
            return Promise.resolve(response);
        }
        /*if (response.code == 200) {
            response.msg !== '' && notice(response.msg, 'message', 'success');
            return Promise.resolve(response);
        } else if (response.code === 401) {
            // notice('登录超时，请重新登录');
            $router.replace('/member/login?redirect=' + $router.currentRoute.fullPath);
            $store.dispatch('SET_LOGOUT');
            return new Promise(() => {});
        } else if (response.code === 4010) {
            refreshAccessToken(refreshToken).then(res=>{
                console.log(res);
                return new Promise(() => {
                });
            });
        }else if (response.code === 403) {
            // $router.replace('/403');
            //无权限操作资源
            notice({
                title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
            }, 'notice', 'error', 5);
            return Promise.reject(response.msg);
            // return new Promise(() => {});
        } else if (response.code === 4031) {
            // $router.replace('/403');
            //无权限操作资源
            notice({
                title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
            }, 'notice', 'error', 5);
            $router.replace(HOME_PAGE);
            return Promise.reject(response.msg);
        } else if (response.code <= 400) {
            response.msg !== '' && notice({
                title: response.msg,
            }, 'notice', 'error', 5);
            return Promise.resolve(response);
        } else if (response.code == 404) {
            //资源不存在
            notice({
                title: response.msg !== '' ? response.msg : '资源不存在',
            }, 'notice', 'warning', 5);
            $router.replace(HOME_PAGE);
            return new Promise(() => {
            });
        } else if (response.code < 500) {
            notice({
                title: '请求错误 ' + response.code,
                desc: response.msg
            }, 'notice', 'warning', 5);
            // $router.back();
            return Promise.reject(response);
        } else {
            notice({
                title: '请求错误 ' + response.code,
                desc: '路径：' + self.url + '，' +
                    response.msg || '未知错误，请联系管理员或稍后重试' +
                    '。'
            }, 'notice', 'warning', 5);
            return new Promise(() => {
            });
        }*/
    },
    error => {
        const response = error.response.data;
        console.log(response);
        response.code = Number(response.code);
        message.destroy();
        switch (response.code) {
            default:
                response.msg !== '' && notice({
                    title: response.msg,
                }, 'notice', 'error', 5);
                return Promise.reject(error);
        }
    }
);

export default $http;
