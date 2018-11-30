<template>
    <div>
        <wrapper-content pageTitle="用户列表">
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button permission="User_User.addUser" @click="form_modal = !form_modal,form_action = 'add'"
                                type="primary" shape="circle" icon="md-add">
                            新增用户
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button @click="del_model = true" type="default" shape="circle"
                                :disabled="select_users.length <= 0">删除用户
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>用户编号：</span>
                                        <p>用户用于登录的账号，唯一识别标记。</p></li>
                                    <li><span>用户昵称：</span>
                                        <p>用户在系统内自定义的名称。</p></li>
                                    <li><span>状态：</span>
                                        <p>用户的启用/禁用状态，若禁用，用户将无法登录系统。</p></li>
                                    <li><span>登录时间：</span>
                                        <p>用户最后一次登录系统的时间。</p></li>
                                    <li><span>登录IP：</span>
                                        <p>用户最后一次登录系统的IP地址。</p></li>
                                    <li><span>授权：</span>
                                        <p>对用户进行操作授权，分配对应操作所需要的权限。</p></li>
                                    <li><span>编辑：</span>
                                        <p>编辑用户信息。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="user_list" class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="userCount > 0" :total="userCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ userCount }} 条</slot>
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
                <Form-item prop="account">
                    <Input v-model="formValidate.account" type="text" placeholder="用户编号"/>
                </Form-item>
                <Form-item prop="realname">
                    <Input v-model="formValidate.realname" type="text" placeholder="用户昵称"/>
                </Form-item>
                <Form-item prop="password">
                    <Input v-model="formValidate.password" placeholder="用户密码，编辑时留空则不修改" type="text"/>
                </Form-item>
                <Form-item prop="password">
                    <Input v-model="formValidate.password_confirm" placeholder="确认密码，编辑时留空则不修改" type="text"/>
                </Form-item>
                <Form-item prop="level_id">
                    <Select v-model="formValidate.position_id" placeholder="用户职位" filterable>
                        <Option v-for="item in position_list" :value="item.id" :key="item.id"
                                :label="item.position_name">
                            <span> {{ item.position_name }}</span>
                            <span style="float:right;color:#ccc"> {{ item.eng_name }}</span>
                        </Option>
                    </Select>
                </Form-item>
                <Form-item prop="level_id">
                    <Select v-model="formValidate.level_id" placeholder="用户等级" filterable>
                        <Option v-for="item in level_list" :value="item.id" :key="item.id" :label="item.eng_name">
                            <span> {{ item.eng_name }}</span>
                            <span style="float:right;color:#ccc"> {{ item.level_name }}</span>
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
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getUserList, getUser, getLevelList, getPositionList,doUserInfo,delUser,changeUserState} from "@/api/user";
    import * as utils from '../../../assets/js/utils'
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
                form_title: '添加新用户',
                form_url: 'add',
                form_submit: '添加',
                formValidate: {
                    user_id: 0,
                    account: '',
                    realname: '',
                    password: '',
                    password_confirm: '',
                    level_id: 0,
                    position_id: 0,
                    state: 1,
                },
                ruleValidate: {
                    account: [
                        {required: true, message: '用户编号不能为空', trigger: 'blur'}
                    ],
                    realname: [
                        {required: true, message: '用户昵称不能为空', trigger: 'blur'}
                    ]
                },
                level_list: [],
                position_list: [],
                del_model: false,
                select_users: [],
                send_loading: false,
                page_size: 10,
                page_num: 1,
                keyword: '',
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户编号',
                        key: 'account',
                        render: (h, params) => {
                            return h('router-link', {
                                props: {
                                    to: '/team/user/detail/' + params.row.id
                                }
                            }, params.row.account)
                        }
                    },
                    {
                        title: '用户昵称',
                        key: 'realname'
                    },
                    {
                        title: '用户职位',
                        render: (h, params) => {
                            return h('span', params.row.position_info.position_name)
                        }
                    },
                    {
                        title: '用户等级',
                        render: (h, params) => {
                            return h('span', params.row.level_info.level_name + '（' + params.row.level_info.eng_name + '）')
                        }
                    },
                    {
                        title: '账号状态',
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
                        title: '登录时间',
                        key: 'last_login_time',
                    },
                    {
                        title: '登录IP',
                        key: 'login_ip',
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
                                    }),
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '授权',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-paper-plane',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.$router.push('ass_group_access/' + params.row.id)
                                            }
                                        }
                                    }),
                                ])
                            ])
                        }
                    }
                ],
                user_list: [],
                userCount: 0,
            }
        },
        watch: {
            form_action: function (value) {
                if (value == 'add') {
                    this.form_title = '添加新用户';
                    this.form_submit = '添加';
                    this.form_url = 'add'
                } else {
                    this.form_title = '编辑用户';
                    this.form_submit = '保存';
                    this.form_url = 'edit'
                }
            },
            form_modal: function (value) {
                if (value === false) {
                    this.formValidate = {
                        user_id: 0,
                        account: '',
                        realname: '',
                        password: '',
                        password_confirm: '',
                        state: 1,
                    }
                }
            },
            keyword: function (newQuestion) {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getUserList()
                }
            }
        },
        created: function () {
            this.getUserList();
            this.getLevelList();
            this.getPositionList()
        },
        methods: {
            getUserList() {
                let app = this;
                getUserList(this.page_size, this.page_num, this.keyword).then(res => {
                    app.loading = false;
                    app.user_list = res.data.list;
                    app.userCount = Number(res.data.count)
                });
            },
            getInfo() {
                let app = this;
                getUser(app.formValidate.user_id).then(res => {
                    if (res.data) {
                        app.formValidate.user_id = res.data.id;
                        app.formValidate.account = res.data.account;
                        app.formValidate.realname = res.data.realname;
                        app.formValidate.level_id = res.data.level_id;
                        app.formValidate.position_id = res.data.position_id;
                        app.formValidate.state = res.data.state
                    }
                });
            },
            getLevelList() {
                let app = this;
                getLevelList(50).then(res => {
                    app.level_list = res.data.list
                });
            },
            getPositionList() {
                let app = this;
                getPositionList(50).then(res => {
                    app.position_list = res.data.list
                });
            },
            editItem(id) {
                this.formValidate.user_id = id;
                this.getInfo();
                this.form_modal = true;
                this.form_action = 'edit'
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formValidate.password !== this.formValidate.password_confirm) {
                            this.$Message.warning('两次输入的密码不相同');
                            return false
                        }
                        let app = this;
                        this.send_loading = true;
                        doUserInfo(app.form_url,app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg);
                            } else {
                                app.form_modal = false;
                                app.$Message.success('操作成功');
                                app.getUserList()
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
                delUser(JSON.stringify(app.select_users)).then(res => {
                    app.send_loading = false;
                    app.del_model = false;
                    if (res.ret === 200) {
                        app.$Message.success('删除成功');
                        app.getUserList()
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getUserList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_users = [];
                $.each(selection, function (k, v) {
                    app.select_users.push(v.id)
                });
            },
            changePage(page) {
                this.page_num = page;
                this.getUserList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getUserList()
            },
            reloadList() {
                this.getUserList(1, this.page_size)
            },
            rowClassName(row, index) {
                return 'rowClassName';
            },
            changeState(id, state, index) {
                let app = this;
                const change_state = state == 1 ? 0 : 1;
                changeUserState(id,state == 1 ? 0 : 1).then(res => {
                    app.user_list[index].state = change_state
                });
            }
        }
    }
</script>
