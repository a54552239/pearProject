import {getStore, setStore, removeStore} from '@/assets/js/storage'

export default {
    SET_LOGGED({commit, state}, data) {
        setStore('token', data.token);
        setStore('userInfo', data.userInfo);
        commit('SET_LOGGED', data);
    },
    SET_USER({commit, state}, data) {
        setStore('userInfo', data);
        commit('SET_USER', data);
    },
    SET_LOGOUT({commit}) {
        removeStore('token');
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
