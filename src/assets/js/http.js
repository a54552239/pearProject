import {message, notification} from 'ant-design-vue'
import Axios from "axios"
import * as utils from './utils'
import {getStore, setStore} from './storage'
import $store from '../../store/index';
import $router from '../../router/index';
import {notice} from './notice';
import config from "../../config/config";
import {refreshAccessToken} from "../../api/common/common";
import {isTokenExpired} from "./utils";

const HOME_PAGE = config.HOME_PAGE;
const $http = Axios.create({
    withCredentials: true,
    crossDomain: true
});
let tokenList = getStore('tokenList', true);
if (tokenList) {
    let refreshToken = tokenList.refreshToken;
    let accessTokenExp = tokenList.accessTokenExp;
    if (accessTokenExp && isTokenExpired(accessTokenExp)) {
        refreshAccessToken(refreshToken).then(res => {
            tokenList.accessToken = res.data;
            setStore('tokenList', tokenList);
            console.log(res);
        });
    }
}


// Before request
$http.interceptors.request.use(
    config => {
        //正在请求更新token时，其他接口等待
        // console.log(refreshing);
        // if (refreshing && refreshingTime < 30) {
        //     console.log(refreshing);
        //     setTimeout(function () {
        //         refreshingTime++;
        //         setStore('refreshingTime', refreshingTime);
        //         tokenList = getStore('tokenList', true);
        //         accessToken = tokenList.accessToken;
        //         refreshToken = tokenList.refreshToken;
        //         tokenType = tokenList.tokenType;
        //     }, 500);
        // }
        config.url = utils.getApiUrl(config.url);
        if (config.method === 'post') {
            const querystring = require('querystring');
            config.data = querystring.stringify(config.data);
        }
        console.log(tokenList);
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
                return new Promise(() => {
                });
            case 4010:
                // refreshing = true;
                // setStore('refreshing', true);
                // refreshAccessToken(refreshToken).then(res => {
                //     refreshing = false;
                //     setStore('refreshing', false);
                //     // tokenList.accessToken = res.data;
                //     setStore('tokenList', tokenList);
                //     console.log(res);
                // });
                return new Promise(() => {
                });
            case 403:
                notice({
                    title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
                }, 'notice', 'error', 5);
                return Promise.reject(response.msg);
            case 4031:
                //无权限操作资源
                notice({
                    title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
                }, 'notice', 'error', 5);
                $router.replace(HOME_PAGE);
                return Promise.reject(response.msg);
            case 404:
                //资源不存在
                notice({
                    title: response.msg !== '' ? response.msg : '资源不存在',
                }, 'notice', 'warning', 5);
                $router.replace(HOME_PAGE);
                return new Promise(() => {
                });
            default:
                notice({
                    title: '请求错误 ' + response.code,
                    desc: response.msg
                }, 'notice', 'warning', 5);
                // $router.back();
                return Promise.reject(response);
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
        message.destroy();
        notice({
            title: response.msg ? response.msg : '未知错误，请稍后重试',
            desc: ' ' + error
        }, 'notice', 'error', 5);
        return Promise.reject(error);
    }
);

export default $http;
