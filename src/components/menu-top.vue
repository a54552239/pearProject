<template>
    <div id="menu-top" :class="menu_top_class">
        <!--<transition name="router-slide" mode="out-in">
            <component :is="currentView"  v-on:destroyMyHandler="currentView = ''">
                &lt;!&ndash; 组件在 vm.currentview 变化时改变！ &ndash;&gt;
            </component>
        </transition>-->
        <my-handler ref="myHandler" v-on:destroyMyHandler="destroyMyHandler"></my-handler>
        <Menu ref="menuTop" mode="horizontal" theme="light" :active-name="active_key" @on-select="itemSelect">
            <div class="menu-header">
                <div class="layout-logo" @click="logoClick">{{ system_info.site_name }}</div>
                <!--@click="targetMenuSlide"-->
                <div class="layout-navicon" @click="targetMenuSlide">
                    <Icon type="md-menu" />
                </div>
                <div class="layout-nav">
                    <router-link class="hidden" :to="'/'+ menu.path" v-for="(menu,index) in menu_model_menu"
                                 :key="index">
                        <Menu-item :name="menu.name" :class="{'first-item': index == 0}">
                            <Icon :type="menu.icon"></Icon>
                            {{ menu.title }}
                        </Menu-item>
                    </router-link>
                    <div class="menu-right" v-if="user_info">
                        <!--<Input class="search-input" icon="ios-search-strong" placeholder="搜索" style="width: 200px;margin-right: 25px;border-radius: 25px;"/>-->
                        <Button icon="md-person" type="text" class="muted" title="在线人数">{{
                            getObjectCount(online_user) }}
                        </Button>
                        <!--<span>在线 <span style="color: #ff9900">{{ online_user.length }}</span></span>-->
                        <AutoComplete
                                class="search-input"
                                v-model="search_keyword"
                                @on-search="handler_search"
                                clearable
                                icon="ios-search"
                                placeholder="搜索项目/任务" style="width: 300px;margin-right: 15px;">
                            <div class="auto-complete-item" v-for="(item,index) in search_data">
                                <div class="auto-complete-group">
                                    <span>{{ item.title }}</span>
                                </div>
                                <li class="ivu-select-item" v-for="option in item.children" :value="option.title"
                                    :key="option.id">
                                    <span class="auto-complete-title" @click="searchSelect(option,index)"
                                          v-html="option.title">
                                    </span>
                                </li>
                                <!--<Option v-for="option in item.children" :value="option.title" :key="option.id">-->
                                <!--<span class="auto-complete-title" @click="searchSelect(option,index)"-->
                                <!--v-html="option.title"></span>-->
                                <!--</Option>-->
                            </div>
                            <!--<a v-if="search_data.length > 0 && (search_data[0].children.length >= 5 || search_data[1].children.length >= 5)" href="https://www.google.com/search?q=iView" target="_blank" class="auto-complete-more">查看全部</a>-->
                        </AutoComplete>
                        <Button style="padding-bottom: 6px;" type="text" @click="showMyHandler"
                                :class="{'handler-active': my_handler_active}">
                            <Icon type="md-checkmark-circle-outline" size="22"></Icon>
                        </Button>
                        <Poptip class="notice" placement="bottom-end" width="350">
                            <Button type="text">
                                <Badge :count="notify_no_read_count">
                                    <Icon type="md-notifications-outline" size="22"></Icon>
                                </Badge>
                            </Button>
                            <div slot="content">
                                <Tabs>
                                    <TabPane :label="showNoticeText" name="notify">
                                        <div v-if="notify_no_read_list.length > 0">
                                            <div v-for="(item,index) in notify_no_read_list" class="vs-list-item">
                                                <div class="vs-list-item-meta">
                                                    <div class="vs-list-item-meta-avatar">
                                                        <img class="avatar img-circle hinted m-t-xs"
                                                             src="../assets/image/global/notice-icon/notice.png">

                                                    </div>
                                                    <div class="vs-list-item-meta-content">
                                                        <h4 class="vs-list-item-meta-title">
                                                            <div class="title"
                                                                 @click="$router.push('/personal/notice/list')">
                                                                {{ item.content }}
                                                                <div class="extra"></div>
                                                            </div>
                                                        </h4>
                                                        <div class="vs-list-item-meta-description">
                                                            <div>
                                                                <div class="description"></div>
                                                                <div class="datetime">{{ item.create_time }}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--<router-link to="/personal/notice/list" class="more muted" v-if="notify_no_read_count > notify_no_read_list.length">查看更多 </router-link>-->
                                            <!--<a class="more muted" v-else @click="clearNotice">清空通知 </a>-->
                                            <a class="more muted" @click="clearNotice">清空通知 </a>
                                            <router-link to="/personal/notice/list" class="more muted"
                                                         v-if="notify_no_read_count > 0">查看更多
                                            </router-link>
                                        </div>
                                        <div v-else>
                                            <div class="notFound">
                                                <img src="../assets/image/global/notice-icon/no-notice.svg"
                                                     alt="not found">
                                                <div>你已查看所有通知</div>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <!--<TabPane :label="showMessageText" name="message">-->
                                    <!--<div v-if="notify_no_read_list.length > 0">-->
                                    <!--<div v-for="(item,index) in notify_no_read_list" class="vs-list-item">-->
                                    <!--<div class="vs-list-item-meta">-->
                                    <!--<div class="vs-list-item-meta-avatar">-->
                                    <!--<img class="avatar img-circle hinted m-t-xs" src="../assets/image/global/notice-icon/notice.png">-->

                                    <!--</div>-->
                                    <!--<div class="vs-list-item-meta-content">-->
                                    <!--<h4 class="vs-list-item-meta-title">-->
                                    <!--<div class="title" @click="$router.push('/personal/notice/list')">-->
                                    <!--{{ item.content }}-->
                                    <!--<div class="extra"></div>-->
                                    <!--</div>-->
                                    <!--</h4>-->
                                    <!--<div class="vs-list-item-meta-description">-->
                                    <!--<div>-->
                                    <!--<div class="description"></div>-->
                                    <!--<div class="datetime">{{ item.create_time }}</div>-->
                                    <!--</div>-->
                                    <!--</div>-->
                                    <!--</div>-->
                                    <!--</div>-->
                                    <!--</div>-->
                                    <!--&lt;!&ndash;<router-link to="/personal/notice/list" class="more muted" v-if="notify_no_read_count > notify_no_read_list.length">查看更多 </router-link>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<a class="more muted" v-else @click="clearNotice">清空通知 </a>&ndash;&gt;-->
                                    <!--<a class="more muted" @click="clearNotice">清空通知 </a>-->
                                    <!--<router-link to="/personal/notice/list" class="more muted" v-if="notify_no_read_count > 0">查看更多 </router-link>-->
                                    <!--</div>-->
                                    <!--<div v-else>-->
                                    <!--<div class="notFound">-->
                                    <!--<img src="../assets/image/global/notice-icon/no-notice.svg" alt="not found">-->
                                    <!--<div>你已查看所有通知</div>-->
                                    <!--</div>-->
                                    <!--</div>-->
                                    <!--</TabPane>-->
                                </Tabs>
                            </div>
                        </Poptip>
                        <!--<Button type="text" @click="showMyHandler" :class="{'handler-active': my_handler_active}"> 我的-->
                        <!--</Button>-->
                        <Dropdown trigger="click" style="margin: 0 10px 0 0" placement="bottom-end"
                                  @on-click="accountControl">
                            <a href="javascript:void(0)">
                                <img style="width: 28px;height: 28px;margin-right: 10px;"
                                     class="avatar img-circle img-24"
                                     :src="user_info.avatar">
                            </a>
                            <Dropdown-menu slot="list">
                                <Dropdown-item name="/account/info">账号设置</Dropdown-item>
                                <!--<Dropdown-item>偏好设置</Dropdown-item>-->
                                <Dropdown-item name="logout" divided>退出登录</Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Menu>
        <task-detail :showModal="show_task_detail" :task_id="task_id" @on-modal-change="modalChange">
        </task-detail>
    </div>
</template>
<style>

</style>
<script>
    import MyHandler from './my-handler.vue'
    import TaskDetail from '../components/task-detail.vue'
    import {getNotifyList, getNotifyListForUser, batchTicketRead, setFinallySendTime, Search} from '../api/common'
    import {mapState} from 'vuex'
    import $ from 'jquery'
    import {showMsgNotification} from "../assets/js/notify"
    import _ from 'lodash'

    export default {
        components: {
            myHandler: MyHandler,
            TaskDetail
        },
        props: {
            active_key: {
                type: String
            },
            menu_model_menu: {
                type: Array
            }
        },
        data() {
            return {
                show_hello: false,
                store: this.$store.state,
                my_handler_active: false,
                notify_list: [],
                search_focus: false,
                search_keyword: '',
                search_data: [
                    {
                        'title': '项目',
                        'children': []
                    },
                    {
                        'title': '任务',
                        'children': []
                    }
                ],
                show_task_detail: false,
                task_id: 0,
                task_index: 0,
            }
        },
        mounted() {
            let app = this;
            this.$refs.myHandler.handler_modal = false;
            app.getNotifyList();
            app.getNotifyNoReadList();
            app.$nextTick(function () {
                document.title = app.system_info.site_name;
            });
        },
        watch: {
            socketAction(data){
                if (data.type === 'new_notice') {
                    this.getNotifyList();
                    this.getNotifyNoReadList();
                }
            },
            $route: function (to, from) { // 路由监听，重新获取数据
                let app = this;
                const matched = app.$route.matched;
                const meta_info = matched[matched.length - 1].meta;
                app.$emit('on-change', meta_info.model);
            },
            search_keyword: function (value) {
                if (value === '' || !value) {
                    this.search_data =
                        [{
                            'title': '项目',
                            'children': []
                        }, {
                            'title': '任务',
                            'children': []
                        }
                        ]
                }
            },
        },
        computed: {
            ...mapState({
                user_info: state => state.user_info,
                system_info: state => state.system_info,
                show_menu_slide: state => state.show_menu_slide,
                notify_no_read_list: state => state.notify_no_read_list,
                notify_no_read_count: state => parseInt(state.notify_no_read_count),
                online_user: state => state.online_user,
                menu_model: state => state.menu_data.menu_model,
                socketAction: state => state.socketAction,
            }),
            menu_top_class: function () {
                if (this.show_menu_slide) {
                    return 'menu-top';
                } else {
                    return 'menu-top hide';
                }
            },
            showNoticeText() {
                if (this.notify_no_read_count > 0) {
                    return '通知 (' + this.notify_no_read_count + ')'
                } else {
                    return '通知'
                }
            },
            showMessageText() {
                if (this.notify_no_read_count > 0) {
                    return '消息 (' + this.notify_no_read_count + ')'
                } else {
                    return '消息'
                }
            }
        },
        methods: {
            getNotifyList() {
                let app = this;
                getNotifyListForUser().then(res => {
                    app.notify_list = res.data.list;
                    let ids = [];
                    $.each(app.notify_list, function (k, v) {
                        const task_info = JSON.parse(v.send_data);
                        const project_id = task_info.project;
                        ids.push(v.id);
                        const permission = showMsgNotification(v.title, v.content, {
                            onclick: function (instance) {
                                window.open('/#/project/task/' + project_id)
                            }
                        });
                        if (permission === false || permission === 'denied') {
                            app.$Notice.info({
                                title: v.title,
                                desc: v.content
                            });
                        }
                    });
                    app.setFinallySendTime(ids);
                    app.notify_list = []
                });
            },
            getNotifyNoReadList() {
                let app = this;
                getNotifyList().then(res => {
                    app.$store.dispatch('UPDATE_NOTIFY_NO_READ_LIST', res.data.list);
                    app.$store.dispatch('UPDATE_NOTIFY_NO_READ_COUNT', res.data.count);
                    // if (res.data.count > 0) {
                    //     document.getElementById("icon").href = "http://static.vilson.xyz/favicon2.ico"
                    // } else {
                    //     document.getElementById("icon").href = "http://static.vilson.xyz/favicon.ico"
                    // }
                });
            },
            clearNotice() {
                let app = this;
                batchTicketRead().then(res => {
                    app.$Message.success('清空了所有通知')
                    app.getNotifyNoReadList()
                });
            },
            setFinallySendTime(ids) {
                let app = this;
                setFinallySendTime(JSON.stringify(ids)).then(res => {

                });
            },
            targetMenuSlide() {
                this.$store.dispatch('SET_MENU_SLIDE', !this.show_menu_slide)
            },
            itemSelect: function (value) {
                if (this.menu_model !== value) {
                    this.$store.dispatch('UPDATE_MENU_MODEL', value);
                    this.$emit('on-change', value);
                }
            },
            accountControl(name) {
                if (name === 'logout') {
                    this.logout()
                } else if (name === '/account/info')
                    this.$router.push(name)
            }
            ,
            destroyMyHandler() {
                this.my_handler_active = false;
                this.$refs.myHandler.handler_modal = false
            }
            ,
            showMyHandler() {
                this.my_handler_active = !this.$refs.myHandler.handler_modal
                this.$refs.myHandler.handler_modal = !this.$refs.myHandler.handler_modal
            },
            logoClick() {
                this.destroyMyHandler();
                this.$router.push('/project/overview')
            },
            handler_search: _.debounce(
                function (value) {
                    let app = this;
                    if (value === '') {
                        app.search_data = [
                            {
                                'title': '项目',
                                'children': []
                            },
                            {
                                'title': '任务',
                                'children': []
                            }
                        ]
                    } else {
                        Search(value).then(res => {
                            app.search_data = [
                                {
                                    'title': '项目',
                                    'children': []
                                },
                                {
                                    'title': '任务',
                                    'children': []
                                }
                            ];
                            if (app.search_keyword === '') {
                                return false
                            }
                            //关键字高亮
                            const reg = new RegExp(value, "gim");
                            $.each(res.data, function (k, v) {
                                if (v.children.length > 0) {
                                    $.each(v.children, function (k2, v2) {
                                        v2.title = v2.title.replace(reg, "<em>" + value + "</em>");
                                        app.search_data[k].children.push(v2)
                                    })
                                }
                            })
                        });
                    }
                }, 500
            ),
            searchSelect: function (option, index) {
                if (index === 0) {
                    this.$router.push('/project/task/' + option.id)
                } else {
                    this.showTaskDetail(option.id, index)
                }
            },
            showTaskDetail(task_id, task_index) {
                this.show_task_detail = true;
                this.task_id = task_id;
                this.task_index = task_index;
            },
            modalChange(value) {
                this.show_task_detail = value
            },
            getObjectCount(obj) {
                let count = 0;
                for (let i in obj) {
                    count++
                }
                return count
            },
            logout() {
                this.$store.dispatch('SET_LOGOUT');
                this.$router.replace('/login')
            }
        },
    };
</script>
