import {getStore, setStore} from '@/assets/js/storage';

const common = {
    state: {
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
    },
    actions: {
        setUploader({commit}, data) {
            commit('setUploader', data);
        },
        setTempData({commit}, data) {
            setStore('tempData', data);
            commit('setTempData', data);
        }
    }
};
export default common
