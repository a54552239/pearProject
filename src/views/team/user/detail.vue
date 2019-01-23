<template>
    <div class="team-user-detail">
        <wrapper-content pageTitle="成员信息">
            <Row class="m-t">
                <i-col span="6">
                    <!--<Button type="text" class="pull-right" style="margin-top: 2px;" @click="user_edit_modal = true">编辑-->
                    <!--</Button>-->
                    <div style="text-align:center;padding: 25px 20px;clear: both;">
                        <img width="75" class="img-circle" :src="user_info.avatar">
                    </div>
                    <div class="info-content">
                        <ul>
                            <li>
                                <span>姓名</span>
                                <p style="color:#383838;width: 100px;">{{ user_info.realname }}</p>
                            </li>
                            <li>
                                <span>账号</span>
                                <p style="color:#383838">{{ user_info.account }}</p>
                            </li>
                            <li>
                                <span>等级</span>
                                <p style="color:#383838">{{ user_info.level_name }} （{{ user_info.l_eng_name }}）</p>
                            </li>
                            <li>
                                <span>手机</span>
                                <p style="color:#383838">{{ user_info.phone }}</p>
                            </li>
                            <li>
                                <span>邮箱</span>
                                <p style="color:#383838;">{{ user_info.email }}</p>
                            </li>
                            <!-- <li>
                                 <span>生日</span>
                                 <span style="color:#383838">{{ user_info.user_birthday }}</span>
                             </li>-->
                            <li>
                                <span>职位</span>
                                <span style="color:#383838">{{ user_info.position_name }}</span>
                            </li>
                        </ul>
                    </div>
                </i-col>
                <i-col span="18">
                    <Tabs value="task_doing" @on-click="changeTabs" :animated="false"
                          style="min-height: 350px;padding-bottom: 30px;">
                        <Tab-pane label="Ta的任务" name="task_doing">
                            <Table
                                    :show-header="false"
                                    :columns="task_columns"
                                    :data="task_doing_list"
                                    :row-class-name="rowClass"
                                    class="no-border-table">
                            </Table>
                        </Tab-pane>
                        <Tab-pane label="已完成任务" name="task_complete">
                            <Table
                                    :show-header="false"
                                    :columns="task_columns"
                                    :data="task_complete_list"
                                    :row-class-name="rowClass"
                                    class="no-border-table">
                            </Table>
                        </Tab-pane>
                        <Tab-pane label="本周项目" name="week">
                            <Table
                                    :show-header="false"
                                    :columns="columns"
                                    :data="project_list"
                                    class="no-border-table">
                            </Table>
                        </Tab-pane>
                        <Tab-pane label="所有项目" name="all">
                            <Date-picker
                                    type="month"
                                    placeholder="项目日期 " style="width:100px;margin-bottom: 10px;"
                                    @on-change="changeDate"></Date-picker>
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索" style="width: 200px"/>
                            <Button type="dashed" icon="md-download" @click="exportProject('allProjectTable')">导出
                            </Button>
                            <Table ref="allProjectTable"
                                   :show-header="false"
                                   :columns="columns"
                                   :data="project_all_list"
                                   class="no-border-table">
                            </Table>
                        </Tab-pane>
                    </Tabs>
                </i-col>
            </Row>
        </wrapper-content>
        <task-detail :showModal="show_task_detail" :task_id="task_id" @on-modal-change="modalChange">
        </task-detail>
    </div>
</template>

<script type="es6">
    import WrapperContent from '@/components/wrapper-content.vue'
    import TaskDetail from '@/components/task-detail.vue'
    import {getListForUserObject,getTaskForUserObject} from "@/api/project";
    import {getUser,doUser} from "@/api/user";
    import * as utils from '@/assets/js/utils'
    import * as _ from 'lodash'
    import $ from 'jquery'

    export default {
        components: {
            WrapperContent,
            TaskDetail
        },
        data() {
            return {
                loading: false,
                user_edit_modal: false,
                user_info: '',
                show_task_detail: false,
                task_id: 0,
                task_index: 0,
                keyword: '',
                rowClass(row, index) {
                    return 'user-task-row-class';
                },
                columns: [
                    {
                        title: '项目名称',
                        key: 'name',
                        width: 600,
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    to: '/project/task/' + params.row.project_id
                                }
                            }, params.row.name);
                        },
                    },
                    {
                        title: '截止时间',
                        key: 'end',
                        sortable: true,
                        width: 200,
                        render(h, params) {
                            return h('div', [
                                h('Tooltip', {
                                    attrs: {
                                        placement: 'top',
                                        content: '截止时间'
                                    },
                                    class: 'action-item muted',
                                }, params.row.end)
                            ])
                        }
                    },
                    {
                        title: '项目进度',
                        key: 'schedule',
                        sortable: true,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#19be6b'
                                }
                            }, params.row.schedule + '%')
                        }
                    },
                    {
                        title: '业务经理',
                        key: 'business_name',
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.business_info.realname)
                        }
                    },
                ],
                project_list: [],
                project_count: 0,
                project_all_list: [],
                project_all_count: 0,
                task_columns: [
                    {
                        title: '',
                        key: 'title',
                        render: (h, params) => {
                            return h('div', {
                                class: 'user-task-content ' + this.showTaskLevel(params.row.task_level),
                                on: {
                                    click: () => {
                                        this.showTaskDetail(params.row.t_id, params.index)
                                    }
                                }
                            }, [
                                h('a', {
                                    class: '',
                                    on: {
                                        click: () => {
                                            event.stopPropagation(); //阻止冒泡
                                            this.setTaskState(params.row.t_id, params.index, true)
                                        }
                                    }
                                }, []),
                                h('span', {
                                    class: 'm-l-sm'
                                }, params.row.name),
                                h('a', {
                                    class: 'muted-dark m-l-sm',
                                    on: {
                                        click: () => {
                                            event.stopPropagation(); //阻止冒泡
                                            this.$router.push('/project/task/' + params.row.project_info.id + '?project_name=' + params.row.project_info.name)
                                        }
                                    }
                                }, params.row.project_info.name),
                                h('span', {
                                    class: 'muted-dark m-l-sm',
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-time',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                    }),
                                    h('span', {}, params.row.project_info.begin),
                                ])
                            ])
                        },
                    },
                ],
                task_doing_list: [],
                task_doing_count: 0,
                task_complete_list: [],
                task_complete_count: 0,
            }
        },
        created() {
            this.getUserInfo();
            this.getTaskList({
                'user_id': this.$route.params.user_id,
                'is_executor': 1,
                'state': 0
            }, 'task_doing')
        },
        watch: {
            keyword: function () {
                this.search()
            },
        },
        methods: {
            projectDetail(row) {
                this.$router.push('/projectinfo/' + row.project_id + '/tasks')
            },
            getUserInfo() {
                let app = this;
                getUser(app.$route.params.user_id).then(res => {
                    app.user_info = res.data
                });
            },
            getProjectList(filter, name) {
                let app = this;
                getListForUserObject(filter).then(res => {
                    if (name === 'week') {
                        app.project_list = res.data.list;
                        app.project_count = app.project_list.length
                    } else {
                        app.project_all_list = res.data.list;
                        app.project_all_count = app.project_all_list.length
                    }
                });
            },
            getTaskList(filter, name) {
                let app = this;
                getTaskForUserObject(filter).then(res => {
                    if (name === 'task_doing') {
                        app.task_doing_list = res.data.list;
                        app.task_doing_count = app.task_doing_list.length
                    } else {
                        app.task_complete_list = res.data.list;
                        app.task_complete_count = app.task_complete_list.length
                    }
                });
            },
            exportProject(ref) {
                let app = this;
                let export_data = app.project_all_list;
                $.each(export_data, function (k, v) {
                    export_data[k].schedule = v.schedule + '%';
                    export_data[k].business_name = v.business_info.realname
                });
                if (ref === 'allProjectTable') {
                    app.$refs.allProjectTable.exportCsv({
                        filename: app.user_info.realname + '所有项目列表',
                        original: false,
                        columns: app.columns,
                        data: export_data
                    });
                }
            },
            search: _.debounce(
                function () {
                    this.getProjectList({
                        'user_id': this.$route.params.user_id,
                        'page_size': 1000,
                        'keyword': this.keyword,
                    }, 'all')
                },
                // 这是我们为等级停止输入等待的毫秒数
                500
            ),
            changeTabs(name) {
                if (name === 'all') {
                    if (this.project_all_count === 0) {
                        this.getProjectList({
                            'user_id': this.$route.params.user_id,
                            'page_size': 1000,
                            'keyword': this.keyword,
                        }, 'all')
                    }
                } else if (name === 'task_doing') {
                    if (this.task_doing_count === 0) {
                        this.getTaskList({
                            'user_id': this.$route.params.user_id,
                            'is_executor': 1,
                            'state': 0
                        }, 'task_doing')
                    }
                } else if (name === 'task_complete') {
                    if (this.task_complete_count === 0) {
                        this.getTaskList({
                            'user_id': this.$route.params.user_id,
                            'is_executor': 1,
                            'state': 1
                        }, 'task_complete')
                    }
                }
            },
            changeDate(date) {
                if (date) {
                    console.log(date);
                    this.getProjectList({
                        'user_id': this.$route.params.user_id,
                        'page_size': 1000,
                        'keyword': this.keyword,
                        'end_time': date
                    })
                } else {
                    this.getProjectList({
                        'user_id': this.$route.params.user_id,
                    })
                }
            },
            showTaskDetail(task_id, task_index) {
                this.show_task_detail = true;
                this.task_id = task_id;
                this.task_index = task_index
            },
            modalChange(value) {
                this.show_task_detail = value
            },
            showTaskLevel(level) {
                if (level == 1) {
                    return 'warning'
                } else if (level == 2) {
                    return 'error'
                } else {
                    return ''
                }
            },
            handleSubmit(name) {
                let app = this;
                let user_data = {
                    id: this.user_edit.id,
                    user_truename: this.user_edit.user_truename,
                    user_mobile: this.user_edit.user_mobile,
                    user_email: this.user_edit.user_email,
                    level: this.user_edit.level,
                };
                user_data = JSON.stringify(user_data);
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        app.loading = true;
                        doUser(user_data).then(res => {
                            const result = utils.showBack(res);
                            if (result) {
                                app.$Notice.success({
                                    title: '保存成功'
                                });
                            }
                            app.user_edit_modal = false;
                            app.loading = false
                        });
                    }
                })
            },
            back(reload = false) {
                this.$store.dispatch("SET_LIST_RELOAD", reload);
                this.$router.go(-1)
            }
        },
    }
</script>
<style>
    .info-content {
        padding: 20px 50px;
    }

    .info-content > ul > li {
        display: flex;
        line-height: 30px;
    }

    .info-content > ul > li span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 80px;
        -webkit-flex: 0 0 auto;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        color: #808080;
    }

    .user-edit-col {
        padding: 0 10px;
    }

    .ivu-tabs-ink-bar.ivu-tabs-ink-bar-animated {
        min-width: 88px !important;
    }

    .ivu-form-item-required .ivu-form-item-label:before {
        content: '';
    }

    .team-user-detail .user-task-row-class .user-task-content {
        padding-left: 0;
    }
</style>
