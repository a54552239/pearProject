/* eslint-disable no-console,no-unused-vars */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview'
import VueDND from 'awe-dnd'
import App from './App'
import store from './store'
import router from './router'
import 'iview/dist/styles/iview.css'
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import '@/assets/css/app.less'
import '@/assets/icon/iconfont'
import CheckLabel from '@/components/check-label';

Vue.use(VueRouter);
Vue.use(store);

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueDND);

Vue.component('CheckLabel', CheckLabel);

Vue.use(vuescroll);
Vue.prototype.$vuescrollConfig = {
    vuescroll: {
        mode: 'native'
    },
    scrollPanel: {
        scrollingX: false,
    },
    bar: {
        delayTime: 500,
        onlyShowBarOnScroll: true,
        background: "#cecece",
    }
};

new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {App}
});
