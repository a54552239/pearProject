<template>
    <div>
        <wrapper-content pageTitle="团队列表">
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button permission="Team_Team.addTeam" @click="form_modal = !form_modal,form_action = 'add'"
                                type="primary" shape="circle" icon="md-add">
                            创建团队
                        </Button>
                        <Button v-if="prev_ids.length > 0" type="default" shape="circle" icon="md-return-left"
                                @click="returnBack()">
                            返回上一级
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button @click="del_model = true" type="default" shape="circle"
                                :disabled="select_teams.length <= 0">删除团队
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>团队编号：</span>
                                        <p>团队用于登录的账号，唯一识别标记。</p></li>
                                    <li><span>团队昵称：</span>
                                        <p>团队在系统内自定义的名称。</p></li>
                                    <li><span>状态：</span>
                                        <p>团队的启用/禁用状态，若禁用，团队将无法登录系统。</p></li>
                                    <li><span>登录时间：</span>
                                        <p>团队最后一次登录系统的时间。</p></li>
                                    <li><span>登录IP：</span>
                                        <p>团队最后一次登录系统的IP地址。</p></li>
                                    <li><span>授权：</span>
                                        <p>对团队进行操作授权，分配对应操作所需要的权限。</p></li>
                                    <li><span>编辑：</span>
                                        <p>编辑团队信息。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="team_list" class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="teamCount > 0" :total="teamCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ teamCount }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
        <Modal
                v-model="form_modal"
                width="360"
                class="form-modal">
            <p slot="header" style="text-align:center;">
                <span>{{ form_title }}</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"
                  label-position="left">
                <Form-item prop="team_name">
                    <Input v-model="formValidate.team_name" placeholder="团队名称，举个栗子：开发三部" type="text"/>
                </Form-item>
                <Form-item prop="level_id">
                    <Select v-model="formValidate.pid" placeholder="隶属团队" filterable>
                        <Option v-for="item in pid_team_list" :value="item.id" :key="item.id" :label="item.team_name">
                            <span> {{ item.team_name }}</span>
                        </Option>
                    </Select>
                </Form-item>

                <Form-item prop="state">
                    <RadioGroup v-model="formValidate.state">
                        <Radio label="1">启用</Radio>
                        <Radio label="0">禁用</Radio>
                    </RadioGroup>
                </Form-item>
                <div class="footer-item">
                    <Form-item>
                        <Button type="primary" size="large" @click="handleSubmit('formValidate')"
                                :loading="send_loading" long>{{ form_submit }}
                        </Button>
                    </Form-item>
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
                <Button type="error" :loading="send_loading" @click="delConfirm">删了</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>

    </div>
</template>
<script>
    import WrapperContent from '../../components/wrapper-content.vue'
    import {getList, getInfo, doTeam, delTeam,changeState} from "@/api/team";
    import $ from 'jquery'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                form_modal: false,
                form_action: 'add',
                form_title: '添加新团队',
                form_url: 'add',
                form_submit: '添加',
                formValidate: {
                    team_id: 0,
                    team_name: '',
                    state: 1,
                },
                ruleValidate: {
                    team_name: [
                        {required: true, message: '团队名称不能为空', trigger: 'blur'}
                    ],
                },
                del_model: false,
                select_teams: [],
                send_loading: false,
                page_size: 10,
                page_num: 1,
                pid: 0,
                prev_ids: [],
                prev_titles: [],
                keyword: '',
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '团队名称',
                        key: 'team_name',
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    to: '/team/user/list/' + params.row.id + '?parent_name=' + params.row.team_name
                                }
                            }, params.row.team_name);
                        }
                    },
                    {
                        title: '隶属团队',
                        key: 'parent_info',
                        render: (h, params) => {
                            if (params.row.pid > 0) {
                                return params.row.parent_info.team_name
                            }
                            return '无'
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        value: params.row.state == 1 ? true : false
                                    },
                                    on: {
                                        'on-change': () => {
                                            this.changeState(params.row.id, params.row.state, params.index)
                                        }
                                    },
                                }),
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '编辑',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-create-outline',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.editItem(params.row.id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '下级',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-body',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.nextItem(params.row.id, params.row.pid, params.row.team_name)
                                            }
                                        }
                                    })
                                ])
                            ])
                        }
                    },
                ],
                team_list: [],
                pid_team_list: [],
                teamCount: 0,
            }
        },
        watch: {
            form_action: function (value) {
                if (value == 'add') {
                    this.form_title = '添加新团队';
                    this.form_submit = '添加';
                    this.form_url = 'add'
                } else {
                    this.form_title = '编辑团队';
                    this.form_submit = '保存';
                    this.form_url = 'edit'
                }
            },
            form_modal: function (value) {
                if (value === false) {
                    this.formValidate = {
                        team_id: 0,
                        team_name: '',
                        state: 1,
                    }
                }
            },
            keyword: function (newQuestion) {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getTeamList()
                }
            }
        },
        created: function () {
            this.$store.dispatch('UPDATE_MENU_TOP', true);
            this.$store.dispatch('UPDATE_MENU_SLIDE', true);
            this.getTeamList()
        },
        methods: {
            getTeamList() {
                let app = this;
                app.loading = true;
                getList(app.pid, app.page_size, app.page_num, app.keyword).then(res => {
                    app.loading = false;
                    app.team_list = res.data.list;
                    app.teamCount = Number(res.data.count);
                    getList(-1, app.page_size, app.page_num, app.keyword).then(res => {
                        app.pid_team_list = res.data.list
                    })
                });
            },
            getInfo() {
                let app = this;
                getInfo(app.formValidate.team_id).then(res => {
                    if (res.data) {
                        app.formValidate.team_id = res.data.id;
                        app.formValidate.team_name = res.data.team_name;
                        app.formValidate.state = res.data.state
                    }
                });
            },
            editItem(id) {
                this.formValidate.team_id = id;
                this.getInfo();
                this.form_modal = true;
                this.form_action = 'edit'
            },
            nextItem(id, pid, title) {
                this.page_num = 1;
                this.prev_ids.push(pid);
                this.prev_titles.push(title);
                this.pid = id;
                this.getTeamList()
            },
            returnBack() {
                this.pid = this.prev_ids[this.prev_ids.length - 1];
                this.prev_ids.splice(this.prev_ids.length - 1, 1);
                this.prev_titles.splice(this.prev_titles.length - 1, 1);
                this.getTeamList()
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.send_loading = true;
                        doTeam(app.form_url, app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg);
                            } else {
                                app.form_modal = false;
                                app.$Message.success('操作成功');
                                app.getTeamList()
                            }
                            app.send_loading = false;
                        });
                    }
                })
            },
            delConfirm() {
                this.delItem()
            },
            delItem() {
                let app = this;
                app.send_loading = true;
                delTeam(JSON.stringify(app.select_teams)).then(res => {
                    app.send_loading = false;
                    app.del_model = false;
                    if (res.ret === 200) {
                        app.$Message.success('删除成功');
                        app.getTeamList()
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getTeamList()
                },
                // 这是我们为团队停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_teams = [];
                $.each(selection, function (k, v) {
                    app.select_teams.push(v.id)
                });
            },
            changePage(page) {
                this.page_num = page;
                this.getTeamList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getTeamList()
            },
            rowClassName(row, index) {
                return 'rowClassName';
            },
            changeState(id, state, index) {
                let app = this;
                const change_state = state == 1 ? 0 : 1;
                changeState(id,state == 1 ? 0 : 1).then(res => {
                    app.team_list[index].state = change_state
                });
            },
        }

    }
</script>
