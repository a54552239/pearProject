import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import common from './modules/common'
import menu from './modules/menu'
import {getStore, setStore} from '@/assets/js/storage'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        common,
        menu,
    },
    state,
    mutations,
    actions
});
export default store
