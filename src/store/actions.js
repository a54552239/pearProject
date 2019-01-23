import {getStore, setStore,removeStore} from '@/assets/js/storage'

export default {
    SET_LOGGED({commit, state}, data) {
        setStore('token', data.token, true, data.duration);
        setStore('user_info', data.user_info);
        commit('SET_LOGGED', data);
    },
    SET_LOGOUT({commit}) {
        removeStore('token');
        removeStore('token');
        removeStore('menu_list');
        removeStore('menu_model_list');
        removeStore('menu_model');
        removeStore('user_info');
        removeStore('user_name');
        commit('SET_LOGOUT');
    },
    SET_PAGE_LOADING({commit}, status) {
        commit('SET_PAGE_LOADING', status);
    },
    SET_LIST_RELOAD({commit}, status) {
        commit('SET_LIST_RELOAD', status);
    },
    SET_MENU_SLIDE({commit}, status) {
        commit('SET_MENU_SLIDE', status);
    },
    UPDATE_ONLINE_USER({commit}, data) {
        commit('UPDATE_ONLINE_USER', data);
    },
    UPDATE_NOTIFY_NO_READ_LIST({commit}, data) {
        commit('UPDATE_NOTIFY_NO_READ_LIST', data);
    },
    UPDATE_NOTIFY_NO_READ_COUNT({commit}, num) {
        commit('UPDATE_NOTIFY_NO_READ_COUNT', num);
    },
    SET_SYSTEM_INFO({commit}, data) {
        setStore('system_info', data);
        commit('SET_SYSTEM_INFO', data);
    },
    SET_LAST_PATH({commit}, path) {
        setStore('last_path', path);
        commit('SET_LAST_PATH', path);
    },
}