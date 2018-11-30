/**
 * Created by vilson on 2017/5/8.
 */
import {Message,Notice} from 'iview'
import Axios from "axios"
import * as utils from './utils'
import $store from '../../store';
import $router from '../../router';
import $notice from './notice';

const $http = Axios.create();
// Before request
$http.interceptors.request.use(
    config => {
        config.url = utils.getApiUrl(config.url);
        if (config.method === 'post') {
            const querystring = require('querystring');
            config.data = querystring.stringify(config.data)
        }
        let token = utils.getStore('token');
        if (token) {
            config.headers.Authorization = token;
            config.headers.Token = token;
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
        let data = response.data;
        if (response.ret < 300) {
            response.msg !== '' && $notice(response.msg);
            return response;
        } else if (response.ret === 499 || response.ret === 401) {
            // $notice('登录超时，请重新登录');
            $router.replace('/login?redirect=' + $router.currentRoute.fullPath);
            $store.dispatch('SET_LOGOUT');
            return new Promise(() => {
            });
        } else if (response.ret < 500) {
            $notice({
                title: '请求错误 ' + response.ret,
                desc: response.msg
            }, 'notice', 'warning', 5);
            // $router.back();
            return new Promise(() => {
            });
        } else {
            $notice({
                title: '请求错误 ' + response.ret,
                desc: '路径：' + self.url + '，' +
                response.msg || '未知错误，请联系管理员或稍后重试' +
                '。'
            }, 'notice', 'warning', 5);
            return new Promise(() => {
            });
        }
    },
    error => {
        Message.destroy();
        $notice(response.data.msg);
        return Promise.reject(error);
    }
);

export default $http;
