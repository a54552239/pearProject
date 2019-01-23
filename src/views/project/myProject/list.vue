<template>
    <div>
        <wrapper-content pageTitle="我的项目">
            <div slot="page-action" class="page-action">
                <div class="filter-content">
                    <Button permission="Project_Project.exportTeamTimeProjectReport" type="dashed" icon="stats-bars"
                            @click="exportTeamTimeProject('week')">项目周报
                    </Button>
                    <Button permission="Project_Project.exportTeamTimeProjectReport" type="dashed" icon="stats-bars"
                            @click="exportTeamTimeProject('month')">项目月报
                    </Button>
                </div>
            </div>
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button permission="add"
                                @click="form_modal = !form_modal,form_action = 'add'" type="primary"
                                shape="circle" icon="md-add">添加
                        </Button>
                    </div>
                    <div class="right-actions">
                        <ButtonGroup class="select m-r-xs">
                            <Button shape="circle" type="default" :class="{'active' : project_state == -1}"
                                    @click="project_state = -1">全部
                            </Button>
                            <Button shape="circle" type="default" :class="{'active' : project_state == 2}"
                                    @click="project_state = 2">开发中
                            </Button>
                            <Button shape="circle" type="default" :class="{'active' : project_state == 5}"
                                    @click="project_state = 5">测试中
                            </Button>
                        </ButtonGroup>
                        <Button permission="Project_Project.delProject" @click="del_model = true" type="default"
                                shape="circle"
                                :disabled="select_projects.length <= 0">删除
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>项目名称：</span>
                                        <p>项目的名称。</p></li>
                                    <li><span>项目评级：</span>
                                        <p>项目的难易度评级。</p></li>
                                    <li><span>截止日期：</span>
                                        <p>项目截止交付的日期。</p></li>
                                    <li><span>预付日期：</span>
                                        <p>项目预计交付的日期。</p></li>
                                    <li><span>项目进度：</span>
                                        <p>项目的完成度百分比。</p></li>
                                    <li><span>项目状态：</span>
                                        <p>项目的当前状态。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="project_list"
                       class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="team_count > 0" :total="team_count" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ team_count }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
        <Modal
                v-model="user_modal"
                width="360"
                class="user-modal">
            <p slot="header" style="text-align:center;">
                <span>添加成员至项目</span>
            </p>
            <Form>
                <Form-item label="成员搜索" prop="user_truename">
                    <Input type="text" v-model="user_keyword" placeholder="输入成员账号 / 姓名进行查找"/>
                </Form-item>
                <p class="list-title">项目成员</p>
                <ul class="user-list" v-if="data_loading == false">
                    <li v-for="(user,index) in project_user_list">
                        <img width="25" class="img-circle"
                             :src="user.avatar"
                             alt="">
                        <span class="name-label">{{ user.realname }}（{{ user.account }}）</span>
                        <span class="pull-right">
                                <span v-if="user.is_add" style="color: #A6A6A6">已加入</span>
                                <Button type="default" size="small" v-else
                                        @click="addProjectUser(user.u_user_id,index)">添加</Button>
                            </span>
                    </li>
                </ul>
                <div style="text-align: center" v-if="data_loading == true">
                    <p class="tip" style="padding: 45px 0;">加载中...</p>
                </div>
                <div style="text-align: center" v-if="project_user_list.length == 0">
                    <div class="illustration"></div>
                    <p class="tip">所有成员均已加入本项目</p>
                </div>
            </Form>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
                v-model="form_modal"
                width="360"
                class="form-modal">
            <p slot="header" style="text-align:center;">
                <span>{{ form_title }}</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"
                  label-position="left">
                <Form-item label="" prop="name">
                    <Input v-model="formValidate.name" placeholder="项目名称" type="text"/>
                </Form-item>
                <Form-item prop="end">
                    <DatePicker :value="formValidate.end" @on-change="changeEndDate" :editable="false" type="date"
                                placeholder="截止日期" style="width: 100%"></DatePicker>
                </Form-item>
                <Form-item prop="prepayDate">
                    <DatePicker :value="formValidate.prepayDate" @on-change="changePrepayDate" :editable="false"
                                type="date" placeholder="预付日期" style="width: 100%"></DatePicker>
                </Form-item>
                <Form-item prop="type_id">
                    <Select v-model="formValidate.type_id" placeholder="项目类型" filterable>
                        <Option v-for="item in type_list" :value="item.id" :key="item.id" :label="item.name">
                            <span> {{ item.name }}</span>
                            <!--<span style="float:right;color:#ccc;height: 35px;display: flex;align-items: center;width: 100%;"> {{ item.memo }}</span>-->
                        </Option>
                    </Select>
                </Form-item>
                <Form-item prop="level_id">
                    <Select v-model="formValidate.level_id" placeholder="项目评级" filterable>
                        <Option v-for="item in level_list" :value="item.id" :key="item.id" :label="item.level_name">
                            <span> {{ item.level_name }}</span>
                            <span style="float:right;color:#ccc"> {{ item.money }}</span>
                        </Option>
                    </Select>
                </Form-item>
                <Form-item prop="ticket">
                    <Select v-model="formValidate.ticket" placeholder="项目标记" filterable>
                        <Option v-for="item in ticket_list" :value="item.key" :key="item.key" :label="item.name">
                            <span> {{ item.name }}</span>
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="项目公开性" prop="access_control_type">
                    <Select v-model="formValidate.access_control_type" placeholder="项目公开性" filterable>
                        <Option value="open" label="公开"></Option>
                        <Option value="private" label="私有"></Option>
                    </Select>
                </Form-item>
                <Form-item prop="project_desc">
                    <Input v-model="formValidate.project_desc" placeholder="详细描述" type="textarea"/>
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
                <Button type="text" @click="del_model = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="delConfirm">删了</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>

    </div>
</template>
<style>

</style>
<script>
    import {mapState} from 'vuex'
    import WrapperContent from '@/components/wrapper-content'
    import * as utils from '@/assets/js/utils'
    import $ from 'jquery'
    import _ from 'lodash'
    import {
        getListForUser,
        getInfo,
        getLevelList,
        getTicketList,
        getTypeList,
        addProjectUser,
        selectProjectUser,
        doProject,
        delProject
    } from "@/api/project";

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                level_list: [],
                ticket_list: [],
                type_list: [],
                current_project_id: 0,
                project_user_list: [],
                user_keyword: '',
                user_modal: false,
                data_loading: false,
                del_model: false,
                form_modal: false,
                select_projects: [],
                send_loading: false,
                page_size: 10,
                page_num: 1,
                keyword: '',
                loading: false,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        key: 'name',
                        // width: 500,
                        sortable: true,
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    to: '/project/task/' + params.row.project_id
                                }
                            }, '（' + params.row.level_name + '）' + params.row.name);
                        }
                    },
                    {
                        title: '业务经理',
                        key: 'state',
                        width: 150,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.business_info.realname)
                        }
                    },
                    {
                        title: '项目状态',
                        key: 'state',
                        width: 100,
                        render: (h, params) => {
                            let state_class = 'table-state'
                            switch (params.row.state) {
                                case '未安排':
                                    state_class += ' default'
                                    break;
                                case '开发中':
                                    state_class += ' success'
                                    break;
                                case '测试中':
                                    state_class += ' warning'
                                    break;
                                case '已搁置':
                                    state_class += ' danger'
                                    break;
                                default :
                                    state_class += ' info'
                            }
                            return h('span', {
                                class: state_class
                            }, params.row.state)
                        }
                    },
                    {
                        title: '项目进度',
                        key: 'schedule',
                        width: 200,
                        render: (h, params) => {
                            return h('Progress', {
                                props: {
                                    'stroke-width': 5,
                                    percent: Number(params.row.schedule)
                                }
                            })
                        }
                    },
                    {
                        title: '截止-预交',
                        key: 'end',
                        width: 200,
                        render: (h, params) => {
                            let prepayDate = ''
                            if (params.row.prepayDate != null) {
                                prepayDate = ' - ' + params.row.prepayDate
                            }
                            //params.row.end +  prepayDate
                            return h('div', {
                                class: 'muted'
                            }, [
                                h('p', {}, '截止时间 - 预交时间'),
                                h('p', {}, params.row.end + prepayDate),
                            ])
                        }
                    },
                    {
                        title: ' ',
                        key: 'action',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '添加成员',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-person-add',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.selectProjectUser(params.row.project_id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '项目设置',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-cog',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.editItem(params.row.project_id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '项目归档',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-bookmark',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.editItem(params.row.project_id)
                                            }
                                        }
                                    })
                                ])
                            ])
                        }
                    }
                ],
                project_state: -1,
                project_list: [],
                team_count: 0,
                form_action: 'add',
                form_title: '添加新项目',
                form_url: 'add',
                form_submit: '添加',
                formValidate: {
                    project_id: 0,
                    access_control_type: 'open',
                    name: '',
                    level_id: 0,
                    ticket: 0,
                    type_id: 0,
                    project_desc: '',
                    end: '',
                    prepayDate: '',
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '写上项目名称吧', trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {
            ...mapState(['socketAction'])
        },
        watch: {
            socketAction(data){
                if (data.type === 'action_synchronize') {
                    this.getList()
                }
            },
            user_keyword: function () {
                this.user_search()
            },
            keyword: function () {
                this.search()
            },
            form_action: function (value) {
                if (value === 'add') {
                    this.form_title = '添加新项目';
                    this.form_submit = '添加';
                    this.form_url = 'add';
                } else {
                    this.form_title = '编辑项目';
                    this.form_submit = '保存';
                    this.form_url = 'edit';
                }
            },
            form_modal: function (value) {
                if (value === false) {
                    this.formValidate = {
                        project_id: 0,
                        access_control_type: 'open',
                        name: '',
                        level_id: 0,
                        ticket: 0,
                        type_id: 0,
                        project_desc: '',
                        end: '',
                        prepayDate: '',
                    }
                }
            },
            project_state: function (value) {
                this.getList()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getList()
                }
            }
        },
        created: function () {
            let app = this;
            this.getList();
            this.getLevelList();
            this.getTicketList();
            this.getTypeList()
            // app.$options.sockets.action_synchronize = (data) => {
            //     const push_data = utils.getPushData(data)
            //     app.getList()
            //     console.log('myProject_action_synchronize')
            // }
        },
        methods: {
            getList() {
                let app = this;
                getListForUser(app.project_state, app.page_size, app.page_num, app.keyword).then(res => {
                    app.project_list = res.data.list;
                    app.team_count = Number(res.data.count)
                });
            },
            getInfo() {
                let app = this;
                getInfo(app.formValidate.project_id).then(res => {
                    app.formValidate = {
                        project_id: res.data.id,
                        name: res.data.name,
                        level_id: res.data.level_id,
                        ticket: res.data.ticket,
                        type_id: res.data.type_id,
                        end: res.data.end,
                        prepayDate: res.data.prepayDate,
                        project_desc: res.data.project_desc,

                    };
                });
            },
            exportTeamTimeProject(time_type) {
                let app = this;
                window.open(utils.getDirectUrl('Project_Project.exportTeamTimeProjectReport&token=' + utils.getStore('token') + '&time_type=' + time_type))
            },
            editItem(id) {
                this.formValidate.project_id = id;
                this.getInfo();
                this.form_modal = true;
                this.form_action = 'edit'
            },
            delConfirm() {
                this.delItem()
            },
            delItem() {
                let app = this;
                app.send_loading = true;
                delProject(JSON.stringify(app.select_projects)).then(res => {
                    app.send_loading = false;
                    app.del_model = false;
                    if (res.ret === 200) {
                        app.$Message.success('删除成功');
                        app.getList()
                    }
                });
            },
            selectProjectUser(project_id) {
                this.current_project_id = project_id;
                this.user_modal = true;
                this.getProjectUser()
            },
            getProjectUser() {
                let app = this;
                selectProjectUser(app.current_project_id, app.user_keyword).then(res => {
                    app.project_user_list = res.data.list
                });
            },
            addProjectUser(user_id, index) {
                let app = this;
                addProjectUser(user_id, app.current_project_id).then(res => {
                    app.project_user_list[index].is_add = true
                });
            },
            getLevelList() {
                let app = this;
                getLevelList().then(res => {
                    app.level_list = res.data.list
                });
            },
            getTicketList() {
                let app = this;
                getTicketList().then(res => {
                    app.ticket_list = res.data
                });
            },
            getTypeList() {
                let app = this;
                getTypeList().then(res => {
                    app.type_list = res.data.list
                });
            },
            user_search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getProjectUser()
                },
                500
            ),
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                // 这是我们为等级停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_projects = [];
                $.each(selection, function (k, v) {
                    app.select_projects.push(v.project_id)
                });
            },
            changeEndDate(date) {
                this.formValidate.end = date
            },
            changePrepayDate(date) {
                this.formValidate.prepayDate = date
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
                this.getList(1, this.page_size)
            },
            rowClassName(row, index) {
                return 'rowClassName';
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        app.send_loading = true;
                        doProject(app.form_url, app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning({
                                    content: msg,
                                    duration: 5
                                });
                            } else {
                                app.form_modal = false;
                                app.$Message.success('操作成功');
                                app.getList()
                            }
                            app.send_loading = false;
                        }).catch(res => {
                            app.send_loading = false;
                        });
                    }
                })
            }
        },

    };
</script>
