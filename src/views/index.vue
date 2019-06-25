<!--suppress ALL-->
<template>
    <div class="index">
        <a-spin :spinning="windowLoading">
            <a-layout id="layout" :class="layoutClass">
                <a-layout-header :class="{'collapsed':collapsed}">
                    <div class="logo" @click="()=>{this.$router.push(config.HOME_PAGE)}">
                        <img class="logo-img" src="../assets/image/common/logo.png" alt="">
                        <span class="title" v-if="system">
                            {{system.app_name}}
                             <span class="version">{{system.app_version}}</span>
                        </span>
                    </div>
                    <a-menu
                            mode="horizontal"
                            v-model="selectedModelKeys"
                            @click="menuModelClick"
                            @openChange="onModelOpenChange"
                            :style="{ lineHeight: '63px',paddingLeft:'15px' }"
                    >
                        <a-menu-item
                                v-for="(model,index) in menu"
                                :key="model.id.toString()"
                                :disabled="!model.status"
                        >
                            <a-icon v-if="model.icon" :type="model.icon"/>
                            <span>{{model.title}}</span>
                        </a-menu-item>
                    </a-menu>
                    <div class="right-menu">
                        <div class="m-r-lg" v-if="config.WS_URI">
                            <a-badge title="当前在线" :count="online" showZero :numberStyle="{backgroundColor: '#52c41a'} "
                                     :offset="[10,0]">
                                <a-icon type="team"/>
                            </a-badge>
                        </div>
                        <div class="action action-organization" v-if="organizationList.length > 1">
                            <header-select></header-select>
                        </div>
                        <div class="action">
                            <header-notice></header-notice>
                        </div>
                        <div class="action action-avatar">
                            <header-avatar></header-avatar>
                        </div>
                    </div>
                </a-layout-header>
                <a-layout style="padding-top: 65px;">
                    <a-sider
                            mode="inline"
                            breakpoint="md"
                            collapsible
                            v-model="collapsed"
                    >
                        <!-- <a-icon
                         class="trigger"
                         :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                         @click="()=> collapsed = !collapsed"
                         />-->
                        <a-menu :theme="theme"
                                v-for="menu in menus"
                                :key="menu.id.toString()"
                                :openKeys="openKeys"
                                v-model="selectedKeys"
                                @click="menuClick($event, menu)"
                                @openChange="onOpenChange"
                                mode="inline">
                            <a-menu-item
                                    v-if="!menu.children && !menu.is_inner && menu.node != '#'"
                                    :key="menu.id"
                                    :disabled="!menu.status"
                            >
                                <a-icon :type="menu.icon"/>
                                <span>{{menu.title}}</span>
                            </a-menu-item>
                            <a-sub-menu
                                    v-if="menu.children && !menu.is_inner"
                                    :key="menu.id.toString()"
                            >
                                <span slot="title">
                                     <a-icon :type="menu.icon"/>
                                    <span>{{menu.title}}</span>
                                </span>
                                <a-menu-item
                                        v-for="(secMenu,index) in menu.children"
                                        v-if="!secMenu.is_inner"
                                        :key="secMenu.id.toString()"
                                        :disabled="!secMenu.status"
                                >
                                    {{secMenu.title}}
                                </a-menu-item>
                            </a-sub-menu>
                        </a-menu>
                    </a-sider>
                    <a-layout
                            class="main-content"
                            :style="collapsed ? { paddingLeft: '80px'} : { paddingLeft: '256px'}">
                        <!--<vue-scroll ref="contentscroll">-->
                        <a-layout-content>
                            <transition name="router-fade" mode="out-in">
                                <a-spin :spinning="pageLoading">
                                    <router-view></router-view>
                                </a-spin>
                            </transition>
                        </a-layout-content>
                        <!-- <a-footer style="text-align: center">
                             <template v-if="system">
                                 <span @click="footerClick">  Copyright © 2018 Pear Project技术部出品 </span>
                             </template>
                         </a-footer>-->
                        <!--</vue-scroll>-->
                    </a-layout>
                </a-layout>
            </a-layout>
            <Socket ref="socket" v-if="config.WS_URI"></Socket>
        </a-spin>
        <v-uploader></v-uploader>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import ALayout from 'ant-design-vue/es/layout'
    import HeaderNotice from '../components/layout/header/HeaderNotice';
    import HeaderAvatar from '../components/layout/header/HeaderAvatar';
    import HeaderSelect from '../components/layout/header/HeaderSelect';
    import VUploader from '../components/tools/VUploader';
    import Socket from '../components/websocket/socket';
    import config from "../config/config";
    import {notice} from "../assets/js/notice";


    const ASider = ALayout.Sider;
    const AFooter = ALayout.Footer;


    export default {
        name: 'index',
        components: {
            HeaderNotice,
            HeaderAvatar,
            HeaderSelect,
            ALayout,
            ASider,
            AFooter,
            Socket,
            VUploader
        },
        data() {
            return {
                menus: [],
                collapsed: false,
                inline: 1,
                openKeys: [],
                openKeysTemp: [],
                selectedKeys: [],
                selectedModelKeys: [],
                breadCrumbInfo: [],
                config: config,
                online: 0,
            }
        },
        computed: {
            ...mapState({
                theme: state => state.theme,
                logged: state => state.logged,
                menu: state => state.menu.menu,
                system: state => state.system,
                pageLoading: state => state.pageLoading,
                windowLoading: state => state.windowLoading,
                organizationList: state => state.organizationList,
                socketAction: state => state.socketAction,
            }),
            layoutClass() {
                let className = 'layout-' + this.theme;
                if (!this.$route.meta.info.show_slider) {
                    className += ' hide';
                }
                return className;
            }
        },
        created() {
            this.checkLayout();
            if (this.$route.query.logged) {
                this.$store.dispatch('checkLogin');
            }
            if (this.$route.query.message) {
                notice({title: this.$route.query.message}, 'notice');
                // notice(this.$route.query.message);
            }
        },
        watch: {
            $route: function (to, from) {
                this.checkLayout();
            },
            collapsed(v) {
                if (v) {
                    this.openKeysTemp = JSON.parse(JSON.stringify(this.openKeys));
                    this.openKeys = [];
                } else {
                    this.openKeys = JSON.parse(JSON.stringify(this.openKeysTemp));
                }
            },
            logged(val) {
                if (!val) {
                    this.$router.push({name: 'login'})
                }
            },
            socketAction(val) {
                if (val.action === 'connect' || val.action === 'onClose') {
                    this.online = val.data.online;
                }
            }
        },
        methods: {
            footerClick() {
                autoPlay('order');
                const socket = this.$refs.socket;
                this.$websocket.send(JSON.stringify({uid: this.$store.state.userInfo.id}));
            },
            checkLayout() {
                //更新左侧菜单选中状态
                let that = this;
                const name = this.$route.name;
                const path = this.$route.path;
                const meta = this.$route.meta;
                const info = this.$route.meta.info;
                that.breadCrumbInfo = [];
                that.breadCrumbInfo.push({title: info.title, 'path': '/' + info.fullUrl});
                if (!info.is_inner) {
                    that.openKeys = [];
                    that.selectedKeys = [];
                }
                //这里有点问题
                // if (!that.menus) {
                //     that.$store.dispatch('setBreadCrumbInfo', that.breadCrumbInfo);
                //     return false;
                // }
                let openKey = null;

                function getArray(data, id) {
                    data.forEach(function (v) {
                        if (v.id == id) {
                            openKey = v;
                        }
                        if (v.children) {
                            getArray(v.children, id);
                        }
                    });
                }

                //递归找到当前路由的顶部菜单，然后更新左侧菜单
                if (meta.model) {
                    getArray(that.menu, meta.model);
                    if (!openKey) {
                        return false;
                    }
                    that.breadCrumbInfo.push({title: openKey.title, 'path': '/' + openKey.fullUrl});
                    openKey.pid && getArray(that.menu, openKey.pid);
                } else {
                    getArray(that.menu, meta.info.id);
                }
                that.breadCrumbInfo.push({title: openKey.title, 'path': '/' + openKey.fullUrl});
                this.selectedModelKeys = [openKey.id.toString()];
                if (!openKey.children) {
                    that.menus = [];
                    return false;
                }
                that.menus = openKey.children;
                if (info.is_inner) {
                    return false;
                }
                that.menus.forEach(function (v) {
                    if (v.pid == that.selectedModelKeys) {
                        if (v.children) {
                            v.children.forEach(function (v2) {
                                if ('/' + v2.fullUrl == path) {
                                    that.selectedKeys.push(v2.id.toString());
                                    if (!that.collapsed) {
                                        that.openKeys.push(v2.pid.toString());
                                    } else {
                                        that.openKeysTemp = [v2.pid.toString()];
                                    }
                                }
                            })
                        } else {
                            that.selectedKeys.push(v.id.toString());
                        }
                    }
                });
                that.$store.dispatch('setBreadCrumbInfo', that.breadCrumbInfo);
            },
            menuClick(event, menu) {
                //点击左侧导航跳转页面
                let that = this;
                let openKeys = [];
                if (!this.openKeys.length) {
                    openKeys = [menu.id.toString()];
                } else {
                    openKeys = JSON.parse(JSON.stringify(that.openKeys));
                }
                that.menus.forEach(function (v) {
                    if (v.id == openKeys) {
                        let turnPath = '/';
                        if (v.children) {
                            v.children.forEach(function (v2) {
                                if (v2.id == event.key) {
                                    turnPath += v2.fullUrl;
                                }
                            })
                        } else {
                            turnPath += v.fullUrl;
                        }
                        that.$router.push(turnPath);
                    }
                });
            },
            menuModelClick(event) {
                //点击顶部导航跳转页面
                let that = this;
                that.menu.forEach(function (v, k) {
                    if (v.id == event.key) {
                        that.menus = v.children;
                        let turnPath = '/';
                        if (!v.children) {
                            turnPath += v.fullUrl;
                        } else if (!v.children[0].children) {
                            turnPath += v.children[0].fullUrl;
                        } else {
                            turnPath += v.children[0].children[0].fullUrl;
                        }
                        if (turnPath != '/#') {
                            that.$router.push(turnPath);
                        }
                    }
                });
            },
            onModelOpenChange(openKeys) {
            },
            onOpenChange(openKeys) {
                let that = this;
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
                let hasOpenKey = false;
                this.menus.forEach(function (v, k) {
                    if (v.id == latestOpenKey) {
                        that.openKeys = latestOpenKey ? [latestOpenKey] : [];
                        hasOpenKey = true;

                    }
                });
                if (!hasOpenKey) {
                    that.openKeys = openKeys
                }
            },
        },
    }
</script>
<style lang="less">

</style>
