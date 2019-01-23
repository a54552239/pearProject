<template>
    <div id="app">
        <!--hsla(0,0%,6%,.2)-->
        <!--<Spin size="large" fix v-if="page_loading" style="top:-10%;background-color:inherit;"></Spin>-->
        <div class="page-loading" v-if="page_loading">
            <!--<img src="./assets/svg-loaders/grid.svg" width="40" alt="" >-->
            <img src="./assets/svg-loaders/circles.svg" width="40" alt="">
        </div>
        <menu-top v-show="menu_top" :class="{'hidden': !menu_top}" :active_key="active_key_top"
                  :menu_model_menu="menu_model_menu" @on-change="keyTopChange"/>
        <menu-slide v-show="menu_slide" :class="{'hidden': !menu_slide}" :active_key="active_key" :openItems="openItems"
                    :menuModel="active_key_top"/>
        <Socket ref="socket"></Socket>
        <transition name="router-fades" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    import MenuTop from './components/menu-top.vue'
    import MenuSlide from './components/menu-slide.vue'
    import Socket from './components/socket';
    import $ from 'jquery'
    import {mapState} from 'vuex'

    export default {
        name: 'app',
        components: {
            MenuTop,
            MenuSlide,
            Socket
        },
        data() {
            return {
                store: this.$store.state,
                menu_slide: true,
                menu_top: true,
                openItems: [],
            }
        },
        mounted() {
            this.$Message.config({top: 13});
        },
        watch: {
            $route: function (to, from) { // 路由监听
                let app = this;
                app.$nextTick(function () {
                    app.menu_top = true;
                    app.menu_slide = true;
                    $("#menu-top").attr("class", 'menu-top');
                    $("#menu-slide").attr("class", 'menu-slide');
                    const name = app.$route.name;
                    const path = app.$route.path;
                    const matched = app.$route.matched;
                    const meta_info = matched[matched.length - 1].meta;
                    if (typeof meta_info.model !== 'undefined') {
                        app.$store.dispatch('UPDATE_ACTIVE_KEY_TOP',meta_info.model);
                    }
                    if (typeof meta_info.parent === 'undefined') {
                        app.$store.dispatch('UPDATE_ACTIVE_KEY',path);

                    } else {
                        app.$store.dispatch('UPDATE_ACTIVE_KEY',meta_info.parent);

                    }
                    let pid = 0;
                    $.each(app.menu_list_old, function (k, v) {
                        if (v.model === app.active_key_top) {
                            const index = app.openItems.indexOf(v.name);
                            if (index !== -1) {
                                app.openItems.splice(index, 1)
                            }
                            if ('/' + v.path === path) {
                                pid = v.pid
                            }
                        }
                    });
                    $.each(app.menu_list, function (k, v) {
                        if (v.id === pid) {
                            app.openItems.push(v.name);
                            return false
                        }
                    });
                    app.$store.dispatch('UPDATE_OPEN_ITEMS', app.openItems);
                    if (name === 'login') {
                        $("#menu-top").attr("class", 'menu-top hide');
                        $("#menu-slide").attr("class", 'menu-slide hide');
                        app.menu_top = false
                        // app.menu_slide = false
                    }
                    if (name === 'account_info' || name === 'project_task' || name === 'project_file_list' || name === 'project_build_list') {
                        $("#menu-slide").attr("class", 'menu-slide hide')
                        // app.menu_slide = false
                    }
                })
            },
        },
        methods: {
            keyTopChange(value) {
                this.$store.dispatch('UPDATE_ACTIVE_KEY_TOP',value);
            }
        },
        computed: {
            ...mapState({
                page_loading: state => state.page_loading,
                active_key: state => state.menu.active_key,
                active_key_top: state => state.menu.active_key_top,
                menu_list_old: state => state.menu.menu_data.menu_list_old,
                menu_list: state => state.menu.menu_data.menu_list,
                menu_model_menu: state => state.menu.menu_data.menu_model_list
            }),
        }
    }
</script>

<style lang="less">
    /*@import './assets/css/app.less';*/
    /*滑入滑出*/
    /*  .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translateX(100%);
    }*/
    .router-slide-enter-active, .router-slide-leave-active {
        transition: all .3s;
    }

    .router-slide-enter, .router-slide-leave-active {
        transform: translateY(-100%);
    }

    .router-right-slide-enter-active, .router-right-slide-leave-active {
        transition: all .3s;
    }

    .router-right-slide-enter, .router-right-slide-leave-active {
        transform: translateX(100%);
    }

    /*淡入淡出*/
    /*.router-fade-enter-active, .router-fade-leave-active {*/
    /*!*transition: opacity .3s;*!*/
    /*transition: all 368ms;*/
    /*}*/

    .router-fade-enter, .router-fade-leave-active {
        opacity: .01;
        transition-timing-function: ease-in-out;
        transition-property: opacity,
        transform;
        /*margin-top: -20px;*/
        /*transition-delay: 0ms;*/
    }

    .router-fade-enter {
        transform: translate3d(0, 20px, 0)
    }

    .router-fade-enter-active {
        transition-duration: 368ms;
        transition-delay: .15s
    }

    .router-fade-leave-active {
        z-index: 233;
        transition-duration: 468ms;
        transform: translate3d(0, -60px, 0)
    }

    /*
  {transition-duration:368ms}.switch-transition-enter,.switch-transition-leave-active{opacity:.01;transition-timing-function:ease-in-out;transition-property:opacity,transform}.switch-transition-enter{transform:translate3d(0,40px,0)}.switch-transition-enter-active{transition-duration:368ms;transition-delay:.15s}.switch-transition-leave-active{z-index:233;transition-duration:468ms;transform:translate3d(0,-60px,0)}
  */
</style>
<style type="text/css">
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
