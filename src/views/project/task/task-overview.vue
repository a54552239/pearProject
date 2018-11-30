<template>
    <div class="task-overview team-user-detail">
        <wrapper-content pageTitle="任务概况">
            <div class="data-content">
                <Tabs v-for="(item,index_item) in user_list" :key="index_item">
                    <TabPane v-for="(user_info,index) in item" :label="user_info.realname" :name="user_info.id"
                             :key="user_info.id">
                        <Table
                                :show-header="false"
                                :columns="task_columns"
                                :data="user_info.task_list"
                                :row-class-name="rowClass"
                                class="no-border-table">
                        </Table>
                    </TabPane>
                </Tabs>
            </div>
        </wrapper-content>
        <task-detail :showModal="show_task_detail" :task_id="task_id" @on-modal-change="modalChange"
                     @on-task-update="taskUpdate">
        </task-detail>
    </div>
</template>
<style>
    .team-user-detail .user-task-row-class .user-task-content {
        padding-left: 0;
    }
</style>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import TaskDetail from '../../../components/task-detail.vue'
    import {mapState} from 'vuex'
    import * as utils from '../../../assets/js/utils'
    import * as dateTime from '../../../assets/js/date_time'
    import {getListOverview} from "@/api/project";


    export default {
        components: {
            WrapperContent,
            TaskDetail,
        },
        data() {
            return {
                show_task_detail: false,
                user_list: [],
                project: {},
                task_id: 0,
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
                                            event.stopPropagation();//阻止冒泡
                                            this.$router.push('/project/task/' + params.row.project_info.id + '?project_name=' + params.row.project_info.name)
                                        }
                                    }
                                }, params.row.project_info.name),
                                h('span', {
                                    class: 'muted-dark m-l-sm',
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'clock',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                    }),
                                    h('span', {}, params.row.project_info.begin)
                                ]),
                                h('span', {
                                    class: 'm-l-lg table-state ' + params.row.task_execute.color
                                }, params.row.task_execute_name)
                            ])
                        },
                    },
                ],
                rowClass(row, index) {
                    return 'user-task-row-class';
                },
                timer: false,
                screenHeight: document.body.clientHeight,
            }
        },
        computed: {
            ...
                mapState([
                    'user_info',
                ])
        },
        created() {
            let app = this;
            app.getUserList()
        },
        methods: {
            //获取任务类型列表
            getUserList() {
                let app = this;
                app.$store.dispatch('SET_PAGE_LOADING', true);
                getListOverview(app.$route.params.team_id).then(res => {
                    app.user_list = res.data;
                    app.$store.dispatch('SET_PAGE_LOADING', false);

                });
            },
            //获取对应任务类型的任务列表
            getList(user_info, index_item, index) {
                let app = this;
                getListOverview(0, 100).then(res => {
                    app.user_list[index_item][index].task_list = res.data.list;
                    app.user_list[index_item][index].task_count = res.data.count;
                });
            },
            showTaskLevel(level) {
                return {
                    'warning': level == 1,
                    'error': level == 2,
                }
            },
            //标记任务
            showTaskDetail(task_id, user_info_index, task_index) {
                this.show_task_detail = true;
                this.task_id = task_id;
                this.user_info_index = user_info_index;
                this.task_index = task_index
            },
            modalChange(value) {
                this.show_task_detail = value
            },
            taskUpdate(value, action, user_info_index) {
            },
            //格式化任务起止时间
            showTaskTime(begin_time, end_time) {
                return dateTime.showTaskTime(begin_time, end_time)
            }
        }
    }
</script>
