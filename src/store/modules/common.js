import {getStore, setStore} from '@/assets/js/storage';

const common = {
    state: {
        viewRefresh: false, //通知刷新视图
        uploader: null,
        tempData: getStore('tempData', true)
    },
    mutations: {
        setUploader(state, data) {
            state.uploader = data;
        },
        setTempData(state, data) {
            state.tempData = data;
        },
        viewRefresh(state) {
            state.viewRefresh = !state.viewRefresh;
        },
    },
    actions: {
        setUploader({commit}, data) {
            commit('setUploader', data);
        },
        setTempData({commit}, data) {
            setStore('tempData', data);
            commit('setTempData', data);
        },
        viewRefresh({commit}) {
            commit('viewRefresh');
        },
    }
};
export default common
