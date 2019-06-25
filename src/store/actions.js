import {setStore, removeStore} from '@/assets/js/storage'
import {_checkLogin, _currentMember} from "../api/user";

export default {
    SET_LOGGED({commit}, data) {
        setStore('tokenList', data.tokenList);
        setStore('userInfo', data.userInfo);
        commit('SET_LOGGED', data);
    },
    SET_USER({commit}, data) {
        setStore('userInfo', data);
        commit('SET_USER', data);
    },
    SET_LOGOUT({commit}) {
        removeStore('tokenList');
        removeStore('userInfo');
        commit('SET_LOGOUT');
    },
    getUser({commit}) {
        _currentMember().then(res => {
            if (!res.data) {
                removeStore('tokenList');
                removeStore('userInfo');
                commit('SET_LOGOUT');
            }else{
                setStore('userInfo', res.data);
                commit('SET_USER', res.data);
            }
        });
    },
    checkLogin({commit}) {
        _checkLogin().then(res => {
            if (res.data) {
                const obj = {
                    userInfo: res.data.member,
                    tokenList: res.data.tokenList
                };
                setStore('tokenList', obj.tokenList);
                setStore('userInfo', obj.userInfo);
                commit('SET_LOGGED', obj);
            } else {
                removeStore('tokenList');
                removeStore('userInfo');
                commit('SET_LOGOUT');
            }
        });
    },
    setTheme({commit}, theme) {
        setStore('theme', theme);
        commit('setTheme', theme);
    },
    pageLoading({commit}, status) {
        commit('pageLoading', status);
    },
    windowLoading({commit}, status) {
        commit('windowLoading', status);
    },
    setOrganizationList({commit}, data) {
        setStore('organizationList', data);
        commit('setOrganizationList', data);
    },
    setCurrentOrganization({commit}, data) {
        setStore('currentOrganization', data);
        commit('setCurrentOrganization', data);
    },
    setSystem({commit}, data) {
        setStore('system', data);
        commit('setSystem', data);
    },
    setBoundClient({commit}, data) {
        commit('setBoundClient', data);
    },
}
