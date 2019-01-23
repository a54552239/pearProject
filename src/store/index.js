import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import common from './modules/common'
import menu from './modules/menu'
import {getStore, setStore} from '@/assets/js/storage'

Vue.use(Vuex)
// const state2 = {
//     menu_model: '', // 当前选中的菜单模块
//     menu_top: false,
//     menu_slide: false,
//     menu_data: {
//         menu_list: [],
//         menu_list_old: [],  //未格式化前的列表
//         menu_model_list: [],
//         menu_model_list_all: [],
//         menu_model: '',
//     }
// }
// state.user_info = getStore('user_info', true) ? getStore('user_info', true) : state.user_info
// state.system_info = getStore('system_info', true) ? getStore('system_info', true) : state.system_info
//
// state.menu_data.menu_list = getStore('menu_list', true)
// state.menu_data.menu_list_old = getStore('menu_list_old', true)
// state.menu_data.menu_model_list = getStore('menu_model_list', true)
// state.menu_data.menu_model_list_all = getStore('menu_model_list_all', true)
// state.menu_data.menu_model = getStore('menu_model')


const store = new Vuex.Store({
    modules: {
        common,
        menu
    },
    state,
    mutations,
    actions
});
export default store
