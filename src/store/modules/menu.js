import {getMenuForUser} from "@/api/menu";
import {getStore, setStore} from '@/assets/js/storage';

const common = {
    state: {
        menu: getStore('menu', true),
        breadCrumbInfo: []
    },
    mutations: {
        SET_MENU(state, data) {
            state.menu = data;
        },
        setBreadCrumbInfo(state, data) {
            state.breadCrumbInfo = data;
        }
    },
    actions: {
        GET_MENU({commit}) {
            getMenuForUser().then(res => {
                setStore('menu', res.data);
                commit('SET_MENU', res.data);
            });
        },
        SET_MENU({commit},data) {
            setStore('menu', data);
            commit('SET_MENU', data);
        },
        setBreadCrumbInfo({commit}, data) {
            commit('setBreadCrumbInfo', data);
        }
    }

};
export default common
