import {setStore, removeStore} from '@/assets/js/storage'

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
}
