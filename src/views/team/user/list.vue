<template>
    <div>
        <wrapper-content pageTitle="成员列表">
            <div slot="page-action" class="page-action">
                <div class="filter-content">
                    <Button type="dashed" icon="android-arrow-back" @click="goBack(-1)">后退</Button>
                    <Button type="dashed" icon="grid" @click="taskOverview">任务概况</Button>
                    <Button type="dashed" icon="md-add" @click="user_modal = !user_modal">添加新成员</Button>
                    <div class="search-input">
                        <Input class="search-input" v-model="list_keyword" icon="ios-search-strong" placeholder="搜索"/>
                    </div>
                </div>
            </div>
            <div class="data-content">
                <Table :loading="loading" border :columns="columns" :data="user_list" :row-class-name="rowClass"
                       @on-row-click="rowClick"
                       class="no-border-table"></Table>
                <Page v-if="userCount > 0" :total="userCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small"
                      show-total show-sizer class="table-page">
                    <slot class="total">共 {{ userCount }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
        <Modal
                v-model="user_modal"
                width="360"
                class="user-modal">
            <p slot="header" style="text-align:center;">
                <span>添加成员至团队</span>
            </p>
            <Form>
                <Form-item label="成员搜索" prop="user_truename">
                    <Input type="text" v-model="user_keyword" placeholder="输入成员账号 / 姓名进行查找"/>
                </Form-item>
                <p class="list-title">团队成员</p>
                <ul class="user-list" v-if="data_loading == false">
                    <li v-for="(user,index) in team_user_list">
                        <img width="25" class="img-circle"
                             :src="user.avatar"
                             alt="">
                        <span class="name-label">{{ user.realname }}（{{ user.account }}）</span>
                        <span class="pull-right">
                                <span v-if="user.is_add == true && (user.is_leader == false || user.is_leader == null)">已加入</span>
                                <span class="text-warning" v-else-if="user.is_leader == true">负责人</span>
                                <Button type="default" size="small" v-else
                                        @click="addTeamUser(user.id,index)">添加</Button>
                            </span>
                    </li>
                </ul>
                <div style="text-align: center" v-if="data_loading == true">
                    <p class="tip" style="padding: 45px 0;">加载中...</p>
                </div>
                <div style="text-align: center" v-if="team_user_list.length == 0">
                    <div class="illustration"></div>
                    <p class="tip">所有成员均已加入本团队</p>
                </div>
            </Form>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
                v-model="del_model"
                title="操作提示">
            <p>真的要删除当前选中项吗？一旦删除将无法恢复，请想好了再决定 </p>
            <div slot="footer">
                <Button type="text" @click="del_model = false">取消</Button>
                <Button type="error" :loading="send_loading" @click="delItem()">删除</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getTeamUser,getInfo,getNoInTeamUser,addTeamUser,editLeader,delTeamUser} from "@/api/team";
    import * as utils from '../../../assets/js/utils'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data: function () {
            return {
                team_info: {},
                team_user_list: [],
                user_modal: false,
                del_model: false,
                select_groups: [],
                send_loading: false,
                data_loading: false,
                button_loading: false,
                loading: false,
                page_size: 10,
                page_num: 1,
                pid: 0,
                list_keyword: '',
                user_keyword: '',
                columns: [
                    {
                        title: '团队成员',
                        width: 300,
                        key: 'avatar',
                        render: (h, params) => {
                            return [
                                h('img', {
                                    attrs: {
                                        src: params.row.avatar,
                                        width: '35',
                                        class: 'img-circle user-item'
                                    }
                                }),
                                h('div', {
                                    attrs: {
                                        class: 'user-item user-detail'
                                    }
                                }, [
                                    h('strong', {}, params.row.realname),
                                    h('p', {
                                        attrs: {
                                            class: 'muted'
                                        }
                                    }, params.row.email)
                                ])
                            ];
                        }
                    },
                    {
                        title: '职位',
                        key: 'user_name',
                        render: (h, params) => {
                            if (params.row.u_user_id === this.team_info.leader_id) {
                                return [
                                    h('span', params.row.position_name),
                                    h('Icon', {
                                        props: {
                                            type: 'flag',
                                            size: '14',
                                            color: '#19be6b'
                                        },
                                        style: {
                                            marginLeft: '5px'
                                        },
                                    })
                                ]
                            }
                            return [
                                h('span', params.row.position_name)
                            ]
                        }
                    },
                    {
                        title: '等级',
                        key: 'level_name'
                    },
                    {
                        title: '加入时间',
                        key: 'join_time'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            let tips = '设为负责人';
                            let state = 1;
                            let template = '';
                            const leader_id = this.team_info.leader_id;
                            if (leader_id !== 0 && params.row.u_user_id == leader_id) {
                                state = 0;
                                tips = '取消负责人身份'
                            }
                            template = h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small',
                                    loading: this.button_loading
                                },
                                on: {
                                    click: () => {
                                        event.stopPropagation(); //阻止冒泡
                                        this.editLeader(params.row.u_user_id, state)
                                    }
                                }
                            }, tips);
                            if (leader_id != 0 && params.row.u_user_id != leader_id) {
                                template = ''
                            }
                            return h('div', {
                                style: {
//                  textAlign: 'left'
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small',
                                        loading: this.button_loading
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            event.stopPropagation(); //阻止冒泡
                                            this.delTeamUser(params.row.u_user_id, params.row.index)
                                        }
                                    }
                                }, '退出'),
                                template,
                            ])
                        }
                    }
//          {
//            title: '操作',
//            key: 'action',
//            align: 'center',
//            render(h, params) {
//              return h('div', [
//                h('Poptip', {
//                  attrs: {
//                    placement: 'bottom'
//                  },
//                  class: 'action-item',
//                },[
//                  h('Button',{
//                    attrs: {
//                      type: 'text'
//                    }
//                  },'成员'),
//                  h('div',{
//                    slot: 'title'
//                  },'团队成员菜单'),
//                  h('div',{
//                    slot: 'content'
//                  },777)
//                ])
//              ])
//            }
//          }
                ],
                user_list: [],
                userCount: 0,
            }
        },
        watch: {
            list_keyword: function () {
                this.search()
            },
            user_keyword: function () {
                this.user_search()
            },
            user_modal(value) {
                if (value) {
                    this.getTeamUser()
                }
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getList()
                }
                this.$store.state.list_reload = false
            }
        },
        computed: {},
        created: function () {
            this.getTeamInfo()
        },
        methods: {
            getList() {
                let app = this;
                app.select_groups = [];
                getTeamUser(app.$route.params.team_id,this.page_size,this.page_num,this.list_keyword,).then(res => {
                    app.user_list = res.data.list;
                    app.userCount = Number(res.data.count)
                });
            },
            getTeamInfo() {
                let app = this;
                getInfo(app.$route.params.team_id).then(res => {
                    app.team_info = res.data;
                    app.getList()
                });
            },
            getTeamUser() {
                let app = this;
                app.data_loading = true;
                getNoInTeamUser( this.$route.params.team_id,1000,this.page_num,this.user_keyword).then(res => {
                    app.data_loading = false;
                    app.team_user_list = res.data.list
                });
            },
            addTeamUser(user_id, index) {
                let app = this;
                addTeamUser( this.$route.params.team_id,user_id).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.team_user_list[index].is_add = true;
                        app.getList()
                    }
                });
            },
            editLeader(user_id, state) {
                let app = this;
                app.button_loading = true;
                editLeader(this.$route.params.team_id,user_id,state).then(res => {
                    app.button_loading = false;
                    const result = utils.showBack(res);
                    if (result) {
                        if (state == 1) {
                            app.team_info.leader_id = user_id
                        } else {
                            app.team_info.leader_id = 0
                        }
                    }
                });
            },
            delTeamUser(user_id, index) {
                let app = this;
                app.button_loading = true;
                delTeamUser(this.$route.params.team_id,user_id).then(res => {
                    app.button_loading = false;
                    const result = utils.showBack(res);
                    if (result) {
                        app.getTeamInfo()
                    }
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                500
            ),
            user_search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getTeamUser()
                },
                1000
            ),
            taskOverview() {
                this.$router.push('/project/taskoverview/' + this.$route.params.team_id)
            },
            changePage(page) {
                this.page_num = page;
                this.getList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getList()
            },
            reloadList() {
                this.getList()
            },
            rowClass(row, index) {
                return 'team-user';
            },
            rowClick(row, index) {
                this.$router.push('/team/user/detail/' + row.user_id)
            },
            goBack(n) {
                this.$router.go(n)
            }
        },
    };
</script>
<style>

    .name-link {
        padding: 0 !important;
    }

    .name-link:hover {
        text-decoration: underline !important;
    }

    .data-content {
        margin-top: 15px;
    }

    .user-list > li {
        line-height: 35px;
    }

    .name-label {
        vertical-align: middle;
    }
</style>
