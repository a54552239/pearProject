import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Index from '@/views/index'
import Home from './home';
import {getStore, setStore} from "../assets/js/storage";
import {createRoute, isTokenExpired} from "../assets/js/utils";
import config from "../config/config";
import {refreshAccessToken} from "../api/common/common";

Vue.use(Router);
const routes = [].concat(
    Home
);
// const router = new Router({
//     routes: routers
// });
const menu = getStore('menu', true);
if (menu) {
    menu.forEach(function (v) {
        routes.push(createRoute(v));
        if (v.children) {
            v.children.forEach(function (v2) {
                routes.push(createRoute(v2));
                if (v2.children) {
                    v2.children.forEach(function (v3) {
                        routes.push(createRoute(v3));
                    });
                }
            });
        }
    });
}
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            children: routes
        },
        // {
        //     name: 'login',
        //     path: '/login',
        //     component: resolve => require(['@/views/login'], resolve),
        //     meta: {model: 'Login'},
        // },
        {
            name: 'member',
            path: '/member',
            component: resolve => require(['@/components/layout/UserLayout'], resolve),
            meta: {model: 'Login'},
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import(/* webpackChunkName: "user" */ '@/views/member/login'),
                    meta: {model: 'Login'},
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import(/* webpackChunkName: "user" */ '@/views/member/Register'),
                    meta: {model: 'Login'},
                },
                {
                    path: 'forgot',
                    name: 'forgot',
                    component: () => import(/* webpackChunkName: "user" */ '@/views/member/forgot'),
                    meta: {model: 'Login'},
                },
                // {
                //     path: 'register-result',
                //     name: 'registerResult',
                //     component: () => import(/* webpackChunkName: "user" */ '@/views/member/RegisterResult')
                // }
            ]
        },
        {
            name: 'install',
            path: '/install',
            component: resolve => require(['@/views/error/install'], resolve),
            meta: {model: 'error'},
        },
        {
            name: 'resetEmail',
            path: '/reset/email',
            component: resolve => require(['@/views/reset/email'], resolve),
            meta: {model: 'error'},
        },
        {
            name: '404',
            path: '/404',
            component: resolve => require(['@/views/error/404'], resolve),
            meta: {model: 'error'},
        },
        {
            name: '403',
            path: '/403',
            component: resolve => require(['@/views/error/403'], resolve),
            meta: {model: 'error'},
        },
        {
            name: '500',
            path: '/500',
            component: resolve => require(['@/views/error/500'], resolve),
            meta: {model: 'error'},
        },
    ]
});

router.beforeEach((to, from, next) => {
    console.log(to);
    let tokenList = getStore('tokenList', true);
    if (tokenList) {
        let refreshToken = tokenList.refreshToken;
        let accessTokenExp = tokenList.accessTokenExp;
        //判断accessToken即将到期后刷新token
        if (accessTokenExp && isTokenExpired(accessTokenExp)) {
            refreshAccessToken(refreshToken).then(res => {
                tokenList.accessToken = res.data.accessToken;
                tokenList.accessTokenExp = res.data.accessTokenExp;
                setStore('tokenList', tokenList);
            });
        }
    }
    const HOME_PAGE = config.HOME_PAGE;
    //页面中转
    if (to.name === 'index' || to.path === '/index' || to.path === '/') {
        next({path: HOME_PAGE});
        return false;
    }
    //无效页面跳转至首页
    if (!to.name && from.meta.model !== 'Login' && to.path !== HOME_PAGE) {
        next({path: '/404'});
        return false;
    }
    if (to.meta.model === 'Login' && store.state.logged) {
        next({path: HOME_PAGE});
        return false;
    }
    if (!store.state.logged && to.meta.model !== 'Login' && to.meta.model !== 'error') {
        next({
            name: 'login',
            query: {redirect: to.fullPath}
        });
        return false;
    }
    next();
});
router.afterEach(route => {
    //预留
    // window.scrollTo(0,0)
});

export default router
