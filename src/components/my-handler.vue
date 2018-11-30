<template>
    <div class="my-handler">
        <Modal class="my-handler-wrap" v-model="handler_modal"
               :styles="{top: '20px','min-height':'97%'}"
               :width="960"
               :mask-closable="false"
               :transition-names="['router-slide','router-slide']">
            <p slot="header" style="font-weight: normal;display: none">
                <span>成员信息</span>
            </p>
            <div>
                <div class="task-detail-action">
                    <Dropdown trigger="click" @on-click="changeTaskState">
                        <a href="javascript:void(0)" class="muted-dark">
                            {{ task_state_name }}
                            <Icon type="chevron-down"></Icon>
                        </a>
                        <Dropdown-menu slot="list" class="muted-dark">
                            <Dropdown-item :name="0">
                                <span>未完成</span>
                                <Icon type="ios-checkmark-empty" v-if="task_state == 0"></Icon>
                            </Dropdown-item>
                            <Dropdown-item :name="1">
                                <span>已完成</span>
                                <Icon type="ios-checkmark-empty" v-if="task_state == 1"></Icon>
                            </Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </div>
                <Tabs v-model="tab_name" @on-click="changeTabs" :animated="false" style="min-height: 350px">
                    <Tab-pane label="我执行的" name="task_executor">
                        <Table
                                :no-data-text="' '"
                                :show-header="show_header"
                                :columns="task_columns"
                                :data="taskExecutorList"
                                :row-class-name="rowClass"
                                class="no-border-table">
                        </Table>
                    </Tab-pane>
                    <Tab-pane label="我创建的" name="task_actor">
                        <Table
                                :no-data-text="' '"
                                :show-header="show_header"
                                :columns="task_columns"
                                :data="taskActorList"
                                :row-class-name="rowClass"
                                class="no-border-table">
                        </Table>
                    </Tab-pane>
                    <Tab-pane label="我参与的" name="task_join">
                        <Table
                                :no-data-text="' '"
                                :show-header="show_header"
                                :columns="task_columns"
                                :data="taskJoinList"
                                :row-class-name="rowClass"
                                class="no-border-table">
                        </Table>
                    </Tab-pane>
                </Tabs>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <task-detail :showModal="show_task_detail" :task_id="task_id" @on-modal-change="modalChange"
                     @on-task-update="taskUpdate">
        </task-detail>
    </div>
</template>
<style lang="less">
    .my-handler-wrap {
        .task-detail-action {
            position: absolute;
            right: 45px;
            z-index: 999;
            .ivu-dropdown-item {
                color: #808080;
                display: flex;
                align-items: center;
            }
            .ivu-icon-ios-checkmark-empty {
                color: #808080;
                margin-left: 20px;
                font-size: 24px;
            }
        }
        .ivu-modal-mask {
            z-index: 99 !important;
            top: 60px !important;
            background-color: #eee;
            opacity: 0.9;
        }
        .ivu-modal-wrap {
            z-index: 900 !important;
            top: 60px !important;
        }
        .ivu-modal-header {
            padding: 0;
            border: none;
        }
        .ivu-modal-close {
            z-index: 999;
        }
        .ivu-modal-footer {
            display: none;
        }
        .ivu-modal-content {
            max-height: 100% !important;
            min-height: 100%;
            border-radius: 2px;
        }
        .ivu-table-tip table td {
            border-bottom: none;
        }
    }

    .user-task-content .check-box {
        width: 20px;
        height: 20px;
        margin-top: 2px;
        border: solid 2px #A6A6A6;
        cursor: pointer;
        border-radius: 3px;
        -webkit-flex: 0 0 auto;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        .ivu-icon.ivu-icon-checkmark {
            visibility: hidden;
            color: #A6A6A6;
            -webkit-transform: translate(2px, 0);
            transform: translate(2px, 0);
        }
        :hover {
            border-color: #808080;
        }
    }

    .user-task-content {
        .done {
            &.check-box {
                .ivu-icon.ivu-icon-checkmark {
                    visibility: visible;
                }
            }
        }
    }
</style>
<script type="es6">
    import {mapGetters} from 'vuex'
    import TaskDetail from '../components/task-detail.vue'
    import * as utils from '../assets/js/utils'
    import {
        getTaskForUser,
        setTaskState
    } from "@/api/project"

    export default {
        name: 'my-handler',
        components: {
            TaskDetail
        },
        data() {
            return {
                handler_modal: false,
                loading: false,
                tab_name: 'task_executor',
                task_state: 0,
                task_columns: [
                    {
                        title: '',
                        key: 'title',
                        render: (h, params) => {
                            return h('div', {
                                class: 'user-task-content ' + this.showTaskLevel(params.row.pri),
                                on: {
                                    click: () => {
                                        this.showTaskDetail(params.row.t_id, params.index)
                                    }
                                }
                            }, [
                                h('a', {
                                    class: this.showTaskCheckBox(params.row.task_state),
                                    on: {
                                        click: () => {
                                            event.stopPropagation() //阻止冒泡
                                            this.setTaskState(params.row.t_id, params.index, true)
                                        }
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'checkmark',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                    })
                                ]),
                                h('span', {
                                    class: 'm-l-sm'
                                }, params.row.name),
                                h('a', {
                                    class: 'muted-dark m-l-sm',
                                    on: {
                                        click: () => {
                                            event.stopPropagation() //阻止冒泡
                                            this.goPage('/project/task/' + params.row.project_info.id + '?project_name=' + params.row.project_info.name)
                                        }
                                    }
                                }, params.row.project_info.name)
                            ])
                        },
                    },
                ],
                taskExecutorList: [],
                taskExecutorCount: 0,
                taskActorList: [],
                taskActorCount: 0,
                taskJoinList: [],
                taskJoinCount: 0,
                show_header: false,
                show_task_detail: false,
                task_id: 0,
                task_index: 0,
                rowClass(row, index) {
                    return 'user-task-row-class';
                },
            }
        },
        methods: {
            getTaskList(filter, name) {
                let app = this;
                getTaskForUser(filter.is_executor, filter.state).then(res => {
                    if (name === 'task_executor') {
                        app.taskExecutorList = res.data.list;
                        app.taskExecutorCount = res.data.count;
                    } else if (name === 'task_actor') {
                        app.taskActorList = res.data.list;
                        app.taskActorCount = res.data.count;
                    } else {
                        app.taskJoinList = res.data.list;
                        app.taskJoinCount = res.data.count;
                    }
                });
            },
            resetList() {
                this.taskExecutorCount = 0;
                this.taskExecutorList = [];
                this.taskActorCount = 0;
                this.taskActorList = [];
                this.taskJoinCount = 0;
                this.taskJoinList = []
            },
            changeTabs(name, reload = false) {
                this.resetList();
                if (name === 'task_executor') {
                    if (this.taskExecutorCount === 0 || reload === true) {
                        this.getTaskList({
                            'is_executor': 1,
                            'state': this.task_state
                        }, 'task_executor')
                    }
                } else if (name === 'task_actor') {
                    if (this.taskActorCount === 0 || reload === true) {
                        this.getTaskList({
                            'is_creator': 1,
                            'state': this.task_state
                        }, 'task_actor')
                    }
                } else if (name === 'task_join') {
                    if (this.taskJoinCount === 0 || reload === true) {
                        this.getTaskList({
                            'state': this.task_state
                        }, 'task_join')
                    }
                }
            },
            showTaskLevel(level) {
                if (level === 1) {
                    return 'warning'
                } else if (level === 2) {
                    return 'error'
                } else {
                    return ''
                }
            },
            //标记任务
            setTaskState(task_id, task_index, done) {
                let app = this;
                let task_state = 0;
                if (done) {
                    task_state = 1
                } else {
                    return false
                }
                let task_data = {
                    task_id: task_id,
                    task_state: task_state
                };
                setTaskState(task_id, task_state).then(res => {
                    const result = utils.showBack(res)
                    if (result) {
                        //todo 如果当前停留在任务页面，如何更新modal后面的任务列表
                        if (app.tab_name === 'task_executor') {
                            app.taskExecutorList.splice(task_index, 1)
                        } else if (app.tab_name === 'task_actor') {
                            app.taskActorList.splice(task_index, 1)
                        } else {
                            app.taskJoinList.splice(task_index, 1)
                        }
                    }
                });
            },
            showTaskCheckBox(state) {
                let name = '';
                if (state === 1) {
                    name = 'done check-box';
                } else {
                    name = 'check-box';
                }
                return name;
            },
            showTaskDetail(task_id, task_index) {
                this.show_task_detail = true;
                this.task_id = task_id;
                this.task_index = task_index
            },
            modalChange(value) {
                this.show_task_detail = value
            },
            taskUpdate(value, action, task_type_index) {
                if (action === 'update') {
                    if (value !== null) {
                    } else {
                    }
                }
            },
            changeTaskState(state) {
                this.task_state = state;
                this.changeTabs(this.tab_name, true)
            },
            goPage(url) {
                this.handler_modal = false;
                this.$router.push(url)
            },
        },
        computed: {
            ...mapGetters([
                'user_info'
            ]),
            task_state_name: function () {
                if (this.task_state === 0) {
                    return '未完成'
                }
                if (this.task_state === 1) {
                    return '已完成'
                }
            }
        },
        watch: {
            'handler_modal'(value) {
                if (value === false) {
                    this.$emit('destroyMyHandler');
                } else {
                    this.$Modal.remove();
                    this.changeTabs(this.tab_name, true)
                }
            }
        }
    }
</script>
