import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from './home';
import Project from './project';
import System from './system';
import Team from './team';
import User from './user';
import Personal from './personal';

Vue.use(Router);
const router = new Router({
    routes: [].concat(
        Home,
        Project,
        System,
        Team,
        User,
        Personal
    )
});

router.beforeEach((to, from, next) => {
    next();
});
router.afterEach(route => {
    //预留
    if (route.name !== 'login') {
        store.dispatch('SET_LAST_PATH', route.fullPath);
    }
});

export default router
