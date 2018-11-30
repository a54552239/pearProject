import {getStore, setStore} from '@/assets/js/storage'

const menu = {
    state: {
        menu_model: '', // 当前选中的菜单模块
        menu_top: false,
        menu_slide: false,
        active_key: '',
        active_key_top: '',
        open_items: [],
        menu_data: {
            menu_list: getStore('menu_list', true) ? getStore('menu_list', true) : [],
            menu_list_old: getStore('menu_list_old', true) ? getStore('menu_list_old', true) : [],  //未格式化前的列表
            menu_model_list: getStore('menu_model_list', true) ? getStore('menu_model_list', true) : [],
            menu_model_list_all: getStore('menu_model_list_all', true) ? getStore('menu_model_list_all', true) : [],
            menu_model: getStore('menu_model', true) ? getStore('menu_model', true) : '',
        }
    },
    mutations: {
        UPDATE_OPEN_ITEMS(state, data) {
            state.open_items = data
        },
        UPDATE_ACTIVE_KEY(state, key) {
            state.active_key = key
        },
        UPDATE_ACTIVE_KEY_TOP(state, key) {
            state.active_key_top = key
        },
        UPDATE_MENU_DATA(state, {menu_list, menu_list_old, menu_model_list, menu_model_list_all, menu_model}) {
            state.menu_data.menu_list = menu_list;
            state.menu_data.menu_list_old = menu_list_old;
            state.menu_data.menu_model_list = menu_model_list;
            state.menu_data.menu_model_list_all = menu_model_list_all;
            state.menu_data.menu_model = menu_model;
        },
        UPDATE_MENU_SLIDE(state, status) {
            state.menu_slide = status
        },
        UPDATE_MENU_TOP(state, status) {
            state.menu_top = status
        },
        UPDATE_MENU_MODEL(state, model) {
            state.menu_model = model
        },
    },
    actions: {
        UPDATE_OPEN_ITEMS({commit}, data) {
            commit('UPDATE_OPEN_ITEMS', data);
        },
        UPDATE_ACTIVE_KEY({commit}, key) {
            commit('UPDATE_ACTIVE_KEY', key);
        },
        UPDATE_ACTIVE_KEY_TOP({commit}, key) {
            commit('UPDATE_ACTIVE_KEY_TOP', key);
        },
        UPDATE_MENU_DATA({commit}, {menu_list, menu_list_old, menu_model_list, menu_model_list_all, menu_model}) {
            setStore('menu_list', menu_list);
            setStore('menu_list_old', menu_list_old);
            setStore('menu_model_list', menu_model_list);
            setStore('menu_model_list_all', menu_model_list_all);
            setStore('menu_model', menu_model);
            commit('UPDATE_MENU_DATA', {menu_list, menu_list_old, menu_model_list, menu_model_list_all, menu_model});
        },
        UPDATE_MENU_SLIDE({commit}, status) {
            commit('UPDATE_MENU_SLIDE', status);
        },
        UPDATE_MENU_TOP({commit}, status) {
            commit('UPDATE_MENU_TOP', status);
        },
        UPDATE_MENU_MODEL({commit}, model) {
            setStore('menu_model', model);
            commit('UPDATE_MENU_MODEL', model);
        },
    }
};
export default menu