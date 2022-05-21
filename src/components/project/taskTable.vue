<template>
    <div class="task-table" id="task-table">
        <a-spin class="task-table-spin" :spinning="loading">
            <div>
                <a-table
                    v-if="ready"
                    :columns="columns"
                     :data-source="taskTableData"
                     childrenColumnName="tasks"
                     rowKey="code"
                     :customRow="rowClick"
                     :defaultExpandAllRows="true"
                     :pagination="false"
                >
                    <template slot="name" slot-scope="text,task,index">
                        <router-link v-if="task.type == 'task'" target="_blank" :to="`/project/space/task/${task.project_code}/detail/${task.code}`">
                            <template v-if="!task.done">
                                {{ task.name }}
                            </template>
                            <template v-else>
                                <s class="muted">{{ task.name }}</s>
                            </template>
                        </router-link>
                        <span v-else>{{ task.name }}</span>
                    </template>
                    <template slot="sumKeyResult" slot-scope="text,task,index">
                        <template v-if="task.type == 'task'">
                            {{task.sumKeyResult}}
                        </template>
                    </template>
                    <template slot="source" slot-scope="text,task,index">
                        <template v-if="task.type == 'task'">
                            {{task.hasSource}}个文件
                        </template>
                    </template>
                    <template slot="beginTime" slot-scope="text,task,index">
                        <template v-if="task.type == 'task'">
                            <a-dropdown :trigger="['click']" v-model="task.showBeginTime"
                                        :disabled="!!task.deleted">
                                <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted">
                                    <template slot="title">
                                        <span>点击设置开始时间</span>
                                    </template>
                                    <div class="field-flex">
                                        <a class="muted name" style="margin: 0">
                                            <template v-if="!task.setBeginTime">设置开始时间
                                            </template>
                                            <template v-else>{{task.begin_time_format}}
                                            </template>
                                        </a>
                                    </div>
                                </a-tooltip>
                                <div class="field-flex" v-else>
                                    <a class="muted name" style="margin: 0">
                                        <template v-if="!task.setBeginTime">设置开始时间</template>
                                        <template v-else>{{task.begin_time_format}}</template>
                                    </a>
                                </div>
                                <div slot="overlay">
                                    <a-date-picker
                                        v-model="task.begin_time"
                                        size="small"
                                        format="MM月DD日 HH:mm"
                                        showTime
                                        allowClear
                                        :showToday="false"
                                        :open="task.showBeginTime"
                                        @ok="doBeginTime(task, true)"
                                    >
                                        <template slot="renderExtraFooter">
                                            <a style="position: absolute;" size="small"
                                               @click="doBeginTime(task, false)">清除</a>
                                        </template>
                                    </a-date-picker>
                                </div>
                            </a-dropdown>
                        </template>
                    </template>
                    <template slot="endTime" slot-scope="text,task,index">
                        <template v-if="task.type == 'task'">
                            <a-dropdown :trigger="['click']" v-model="task.showEndTime"
                                        :disabled="!!task.deleted">
                                <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted" placement="topLeft">
                                    <template slot="title">
                                        <span>点击设置截止时间</span>
                                    </template>
                                    <div class="field-flex">
                                        <a class="muted name" style="margin: 0">
                                            <template v-if="!task.setEndTime">设置截止时间</template>
                                            <template v-else>{{task.end_time_format}}</template>
                                        </a>
                                    </div>
                                </a-tooltip>
                                <div class="field-flex" v-else>
                                    <a class="muted name" style="margin: 0">
                                        <template v-if="!task.setEndTime">设置截止时间</template>
                                        <template v-else>{{task.end_time_format}}</template>
                                    </a>
                                </div>
                                <div slot="overlay">
                                    <a-date-picker
                                        v-model="task.end_time"
                                        size="small"
                                        format="MM月DD日 HH:mm"
                                        showTime
                                        allowClear
                                        :showToday="false"
                                        :open="task.showEndTime"
                                        @ok="doEndTime(task, true)"
                                    >
                                        <template slot="renderExtraFooter">
                                            <a style="position: absolute;" size="small"
                                               @click="doEndTime(task, false)">清除</a>
                                        </template>
                                    </a-date-picker>
                                </div>
                            </a-dropdown>
                        </template>
                    </template>
                    <template slot="executor" slot-scope="text,task,index">
                        <template v-if="task.type == 'task'">
                            <a-dropdown
                                :trigger="['click']"
                                v-model="task.visibleTaskMemberMenu"
                                :disabled="!!task.deleted"
                                placement="bottomCenter"
                            >
                                <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted"  placement="topLeft">
                                    <template slot="title">
                                        <span>点击设置执行者</span>
                                    </template>
                                    <div class="field-flex">
                                        <template v-if="task.executor">
                                            <a-avatar :src="task.executor.avatar" icon="user"
                                                      size="small"/>
                                            <a class="muted name">{{task.executor.name}}</a>
                                        </template>
                                        <template v-if="!task.executor">
                                            <a-avatar icon="user" size="small"/>
                                            <a class="muted name">待认领</a>
                                        </template>
                                    </div>
                                </a-tooltip>
                                <div class="field-flex" v-else>
                                    <template v-if="task.executor">
                                        <a-avatar :src="task.executor.avatar" icon="user"
                                                  size="small"/>
                                        <a class="muted name">{{task.executor.name}}</a>
                                    </template>
                                    <template v-if="!task.executor">
                                        <a-avatar icon="user" size="small"/>
                                        <a class="muted name">待认领</a>
                                    </template>
                                </div>
                                <div slot="overlay">
                                    <task-member-menu
                                        v-if="task.visibleTaskMemberMenu"
                                        :projectCode="code"
                                        :taskCode="task.code"
                                        @close="init(false)"
                                        @inviteProjectMember="
                                                            showInviteMember = true,
                                                            task.visibleTaskMemberMenu = false"
                                    ></task-member-menu>
                                </div>
                            </a-dropdown>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-spin>
        <invite-project-member v-model="showInviteMember" :project-code="code"
                               v-if="showInviteMember"></invite-project-member>
    </div>
</template>

<script>
import moment from 'moment';
import taskMemberMenu from "@/components/project/taskMemberMenu"
import taskTagMenu from "@/components/project/taskTagMenu"
import projectMemberMenu from "@/components/project/projectMemberMenu"
import inviteProjectMember from '@/components/project/inviteProjectMember'
import {relativelyTaskTime, relativelyTime} from "@/assets/js/dateTime";
import ATextarea from "ant-design-vue/es/input/TextArea";
import {taskTree} from "@/api/taskStages";
import {edit} from "@/api/task";
import {checkResponse} from "assets/js/utils";

export default {
    name: "task-table",
    components: {
        ATextarea,
        taskMemberMenu,
        taskTagMenu,
        projectMemberMenu,
        inviteProjectMember
    },
    props: {
        projectCode: {
            type: [String],
            default() {
                return ''
            }
        },
        width: {
            type: [String, Number],
            default() {
                return '1200'
            }
        }
    },
    data() {
        return {
            moment,
            ready: false,
            loading: false,
            code: this.projectCode,
            projectCodeCurrent: '',
            taskTableData: [],
            columns: [
                {
                    title: '标题',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: {
                        customRender: 'name'
                    },
                },
                {
                    title: '开始时间',
                    dataIndex: 'begin_time',
                    key: 'begin_time',
                    scopedSlots: {
                        customRender: 'beginTime'
                    },
                },
                {
                    title: '截止时间',
                    dataIndex: 'end_time',
                    key: 'end_time',
                    scopedSlots: {
                        customRender: 'endTime'
                    },
                },
                {
                    title: '执行人',
                    dataIndex: 'executor',
                    key: 'executor',
                    scopedSlots: {
                        customRender: 'executor'
                    },
                },
            ],

            showInviteMember: false,
        }
    },
    created() {
        this.init();
    },
    mounted() {
    },
    filters: {
        formatLogTime(value) {
            return relativelyTime(value)
        }
    },
    methods:{
        init(loading = true) {
            if (loading) {
                this.loading = true;
            }
            this.getTaskTree();
        },
        getTaskTree() {
            let app = this;
            taskTree({projectCode: this.code}).then(res => {
                let list = res.data;
                list.forEach((v)=>{
                    v = app.formatTask(v);
                    if (v.tasks && v.tasks.length) {
                        v.tasks.forEach((v2)=>{
                            v2 = app.formatTask(v2);
                            if (v2.tasks && v2.tasks.length) {
                                v2.tasks.forEach((v3)=>{
                                    v3 = app.formatTask(v3);
                                    if (v3.tasks && v3.tasks.length) {
                                        v3.tasks.forEach((v4)=>{
                                            v4 = app.formatTask(v4);
                                        })

                                    }
                                })

                            }
                        })
                    }
                })
                this.taskTableData = this.formatTask(res.data);
                this.loading = false;
                if (!this.ready) {
                    this.ready = true;
                }
            });
        },
        formatTask(task) {
            if (task.type == 'task') {
                task.visibleTaskMemberMenu = false;
                task.showEndTime = false;
                task.showBeginTime = false;
                task.showRealTime = false;
                if (!task.tasks.length) {
                    delete task.tasks;
                }
                if (!task.end_time) {
                    task.setEndTime = false;
                    task.end_time = moment(moment().format('YYYY-MM-DD') + ' 18:00');
                } else {
                    task.setEndTime = true;
                    task.end_time = moment(task.end_time);
                }
                task.end_time_format = relativelyTaskTime(task.end_time, true);
                if (!task.begin_time) {
                    task.setBeginTime = false;
                    task.begin_time = moment(moment().format('YYYY-MM-DD') + ' 18:00');
                } else {
                    task.setBeginTime = true;
                    task.begin_time = moment(task.begin_time);
                }
                task.begin_time_format = relativelyTaskTime(task.begin_time, true);
            }
            return task
        },
        editTask(task,data) {
            data.taskCode = task.code;
            edit(data).then((res) => {
                const result = checkResponse(res);
                if (!result) {
                    return false;
                }
                this.getTaskTree();
            });
        },
        doEndTime(task, setEndTime = false, showEndTime = false) {
            task.setEndTime = setEndTime;
            task.showEndTime = showEndTime;
            let endTime = '';
            if (setEndTime) {
                endTime = moment(task.end_time).format('YYYY-MM-DD HH:mm');
                task.end_time_format = moment(task.end_time).format('MM月DD日 HH:mm');
            } else {
                endTime = '';
            }
            this.editTask(task, {end_time: endTime});
        },
        doBeginTime(task, setBeginTime = false, showBeginTime = false) {
            task.setBeginTime = setBeginTime;
            task.showBeginTime = showBeginTime;
            let beginTime = '';
            if (setBeginTime) {
                beginTime = moment(task.begin_time).format('YYYY-MM-DD HH:mm');
                task.begin_time_format = moment(task.begin_time).format('MM月DD日 HH:mm');
            } else {
                beginTime = '';
            }
            this.editTask(task, {begin_time: beginTime});
        },
        rowClick(record, index) {
            return {
                on: {
                    click: (e) => {
                        console.log(record, index)
                        if (record.type == 'task') {
                            const taskId = record.id;
                        }
                    }
                }
            }
        },
    }
}
</script>

<style lang="less">
.task-table{
    .ant-table-body{
        background: #fff;
    }
    .field-flex .name{
        margin: 0 8px;
    }
}
</style>


