<template>
    <div class="version-detail">
        <a-spin class="version-detail-spin" :spinning="loading">
            <div class="task-header">
                    <span class="head-title">
                        <span>{{version.featureName}}</span>
                    </span>
                <span class="header-action text-right">
                        <template>
                             <a-dropdown :trigger="['click']" placement="bottomCenter" v-model="visibleTaskMenu">
                              <a-tooltip :mouseEnterDelay="0.5">
                                 <template slot="title">
                                    <span>打开菜单</span>
                                 </template>
                                  <a class="action-item muted"><a-icon type="ellipsis"/></a>
                              </a-tooltip>
                                <a-menu @click="doVersion" class="field-right-menu"
                                        slot="overlay">
                                    <a-menu-item key="delete">
                                           <a-icon type="delete"></a-icon>
                                            <span>删除版本</span>
                                    </a-menu-item>
                                </a-menu>
                        </a-dropdown>
                        </template>
                         <a-tooltip :mouseEnterDelay="0.5">
                            <template slot="title">
                                <span>关闭面板</span>
                            </template>
                         <a class="action-item muted" @click="detailClose"><a-icon type="close"/></a>
                     </a-tooltip>
                    </span>
            </div>
            <div class="task-wrap">
                <div class="task-content">
                    <div class="content-left">
                        <vue-scroll :ops="scrollOps">
                            <div class="task-title" :class="{'disabled': disableEdit}">
                                <a-input ref="inputTitle" auto-focus @blur="doName" v-model="version.name" size="large"
                                         v-show="showEditName"/>
                                <a-tooltip :mouseEnterDelay="0.5" v-if="!disableEdit">
                                    <template slot="title">
                                        <span>点击即可编辑</span>
                                    </template>
                                    <div class="title-text" @click="editTitle" v-show="!showEditName">
                                        {{version.name}}
                                    </div>
                                </a-tooltip>
                                <div v-else class="title-text" v-show="!showEditName">
                                    {{version.name}}
                                </div>
                            </div>
                            <div class="task-basic-attrs-view muted">
                                <div class="field-list" :class="{'disabled': disableEdit}">
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="check-square"/>
                                                <span class="field-name">状态</span>
                                            </div>
                                            <div class="field-right">
                                                <a-dropdown
                                                        placement="bottomCenter"
                                                        :trigger="['click']"
                                                        :disabled="!!task.deleted || !!task.hasUnDone"
                                                        :class="{'disabled': task.hasUnDone}">
                                                    <a-tooltip placement="top">
                                                        <template slot="title">
                                                            <span v-if="disableEdit"
                                                                  style="font-size: 12px;">版本已发布，不能编辑</span>
                                                        </template>
                                                        <span>
                                                            <span class="version-status"
                                                                  :class="`status-${version.status}`">
                                                                 <a-icon type="schedule"/>
                                                                 <span class="m-l-xs">{{version.statusText}}</span>
                                                            </span>
                                                        </span>
                                                    </a-tooltip>
                                                    <a-menu class="field-right-menu" slot="overlay"
                                                            :selectable="false"
                                                            v-show="!disableEdit"
                                                            @click="changeVersionStatus">
                                                        <a-menu-item key="0">
                                                            <div class="menu-item-content">
                                                                <a-tag>未开始</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="version.status == 0"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="1">
                                                            <div class="menu-item-content">
                                                                <a-tag color="blue">进行中</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="version.status == 1"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="2">
                                                            <div class="menu-item-content">
                                                                <a-tag color="red">延期发布</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="version.status == 2"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="3">
                                                            <div class="menu-item-content">
                                                                <a-tag color="green">已发布</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="version.status == 3"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="calendar"/>
                                                <span class="field-name">开始时间</span>
                                            </div>
                                            <div class="field-right field-date">
                                                <a-dropdown :trigger="['click']" v-model="showStartTime"
                                                            :disabled="disableEdit">
                                                    <a-tooltip :mouseEnterDelay="0.5" v-if="!disableEdit">
                                                        <template slot="title">
                                                            <span>点击设置开始时间</span>
                                                        </template>
                                                        <div class="field-flex">
                                                            <a class="muted name" style="margin: 0">
                                                                <template v-if="!version.setStartTime">设置开始时间</template>
                                                                <template v-else>{{version.start_time_format}}
                                                                </template>
                                                            </a>
                                                        </div>
                                                    </a-tooltip>
                                                    <div class="field-flex" v-else>
                                                        <a class="muted name" style="margin: 0">
                                                            <template v-if="!version.setStartTime">设置开始时间</template>
                                                            <template v-else>{{version.start_time_format}}</template>
                                                        </a>
                                                    </div>
                                                    <div slot="overlay">
                                                        <a-date-picker
                                                                v-model="version.start_time"
                                                                size="small"
                                                                format="MM月DD日 HH:mm"
                                                                showTime
                                                                allowClear
                                                                :showToday="false"
                                                                :open="showStartTime"
                                                                @ok="doStartTime(true)"
                                                        >
                                                            <template slot="renderExtraFooter">
                                                                <a style="position: absolute;" size="small"
                                                                   @click="doStartTime(false)">清除</a>
                                                            </template>
                                                        </a-date-picker>
                                                    </div>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="calendar"/>
                                                <span class="field-name">发布时间</span>
                                            </div>
                                            <div class="field-right field-date">
                                                <a-dropdown :trigger="['click']" v-model="showPlanPublishTime"
                                                            :disabled="disableEdit">
                                                    <a-tooltip :mouseEnterDelay="0.5" v-if="!disableEdit">
                                                        <template slot="title">
                                                            <span>点击设置发布时间</span>
                                                        </template>
                                                        <div class="field-flex">
                                                            <a class="muted name" style="margin: 0">
                                                                <template v-if="!version.setPlanPublishTime">设置发布时间
                                                                </template>
                                                                <template v-else>{{version.plan_publish_time_format}}
                                                                </template>
                                                            </a>
                                                        </div>
                                                    </a-tooltip>
                                                    <div class="field-flex" v-else>
                                                        <a class="muted name" style="margin: 0">
                                                            <template v-if="!version.setPlanPublishTime">设置发布时间
                                                            </template>
                                                            <template v-else>{{version.plan_publish_time_format}}
                                                            </template>
                                                        </a>
                                                    </div>
                                                    <div slot="overlay">
                                                        <a-date-picker
                                                                v-model="version.plan_publish_time"
                                                                size="small"
                                                                format="MM月DD日 HH:mm"
                                                                showTime
                                                                allowClear
                                                                :showToday="false"
                                                                :open="showPlanPublishTime"
                                                                @ok="doPlanPublishTime(true)"
                                                        >
                                                            <template slot="renderExtraFooter">
                                                                <a style="position: absolute;" size="small"
                                                                   @click="doPlanPublishTime(false)">清除</a>
                                                            </template>
                                                        </a-date-picker>
                                                    </div>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="fire"/>
                                                <span class="field-name">完成进度</span>
                                            </div>
                                            <div class="field-right width-block">
                                                <a-tooltip placement="top"
                                                           :mouseEnterDelay="0.3"
                                                           :title="`系统自动统计当前版本的完成进度`">
                                                    <a-progress :strokeWidth="4"
                                                                :percent="version.schedule"/>
                                                </a-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="file-text"/>
                                                <span class="field-name">备注</span>
                                            </div>
                                            <div class="field-right width-block">
                                                <div class="task-description" :class="{'disabled': disableEdit}"
                                                     v-show="!showVersionDescriptionEdit"
                                                     @click="showVersionDesc">
                                                    <div class="description-txt" v-show="version.description"
                                                         v-html="version.description"></div>
                                                    <span v-show="!version.description">添加备注</span>
                                                </div>
                                                <div v-show="showVersionDescriptionEdit">
                                                    <a-input type="textarea" v-model="version.description"></a-input>
                                                    <div class="action-btn pull-right">
                                                        <a type="text" class="cancel-text muted"
                                                           @click="showVersionDescriptionEdit = false">
                                                            取消
                                                        </a>
                                                        <a-button type="primary" htmlType='submit'
                                                                  class="middle-btn"
                                                                  @click="doContent">保存
                                                        </a-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="bars"/>
                                                <span class="field-name">发布内容 <span v-show="versionTaskSchedule !== false"> · {{versionTaskDoneNum}}/{{versionTaskList.length}}</span></span>
                                            </div>
                                            <div class="field-right width-block">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="block-field width-block">
                                                <div class="task-child">
                                                    <div class="task-list" v-show="versionTaskList.length">
                                                        <div v-for="(versionTask, index) in versionTaskList"
                                                             :key="versionTask.code">
                                                            <div class="list-item task">
                                                                <div class="check-box-wrapper task-item"
                                                                     @click.stop="showTaskDetail(versionTask)">
                                                                    <a-icon class="check-box disabled"
                                                                            :type="versionTask.done ? 'check-square' : 'border'"
                                                                            :style="{fontSize:'16px'}"/>
                                                                </div>
                                                                <a-tooltip :mouseEnterDelay="0.5">
                                                                    <template slot="title">
                                                                        <span v-if="versionTask.executor">{{versionTask.executor.name}}</span>
                                                                        <span v-else>待认领</span>
                                                                    </template>
                                                                   <div @click.stop="showTaskDetail(versionTask)">
                                                                       <a-avatar
                                                                               v-if="versionTask.executor"
                                                                               class="task-item"
                                                                               size="small"
                                                                               icon="user"
                                                                               :src="versionTask.executor.avatar"
                                                                       ></a-avatar>
                                                                       <a-avatar
                                                                               v-else
                                                                               class="task-item"
                                                                               size="small"
                                                                               icon="user"
                                                                       ></a-avatar>
                                                                   </div>
                                                                </a-tooltip>
                                                                <div class="task-item task-title"
                                                                     @click.stop="showTaskDetail(versionTask)">
                                                                    <div class="title-text"
                                                                    >
                                                                        {{versionTask.name}}
                                                                    </div>
                                                                </div>
                                                                <span class="m-r muted">
                                                                    <span v-if="versionTask.done" class="text-success">已完成</span>
                                                                    <span v-else>未完成</span>
                                                                </span>
                                                                <a class="muted"
                                                                   @click.stop="removeVersionTask(versionTask)">
                                                                    <a-icon class="task-item" type="delete"/>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a-tooltip placement="top">
                                                        <a class="add-handler"
                                                           :class="{'disabled': disableEdit}"
                                                           v-show="!showChildTask"
                                                           @click="getTaskStages">
                                                            <a-icon type="plus" style="margin-right: 6px;"/>
                                                            添加发布内容
                                                        </a>
                                                    </a-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </vue-scroll>
                    </div>
                    <div class="content-right">
                        <div class="log-wrap">
                            <div class="header">
                                <span class="text-default">
                                    所有动态
                                </span>
                            </div>
                            <vue-scroll>
                                <div class="log-list muted">
                                    <a class="show-more muted" v-show="checkShowMoreLog"
                                       @click="getMoreVersionLog">
                                        <a-icon type="ellipsis"/>
                                        显示较早的 {{versionLogTotal - versionLog.length}} 条动态
                                    </a>
                                    <div class="list-item"
                                         v-for="log in versionLog" :key="log.code">
                                        <template>
                                            <a-icon class="log-item" :type="log.icon"/>
                                            <div class="log-item log-txt">
                                                <div>{{log.member.name}} <span v-html="log.remark"></span></div>
                                                <div v-if="log.content" class="log-content"
                                                     v-html="log.content"></div>
                                            </div>
                                        </template>
                                        <a-tooltip :mouseEnterDelay="0.5">
                                            <template slot="title">
                                                <span>{{log.create_time}}</span>
                                            </template>
                                            <span class="log-item">{{log.create_time | formatLogTime}}</span>
                                        </a-tooltip>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
        <a-modal
                destroyOnClose
                :width="360"
                v-model="publishVersion.modalStatus"
                title="实际发布时间"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <a-form
                    @submit.prevent="handleSubmitPublishVersion"
                    :form="publishVersionForm"
            >
                <a-form-item
                >
                    <a-date-picker showTime format="YYYY年MM月DD日 HH:mm" style="width: 100%"
                                   placeholder="选择实际发布时间" v-decorator="['publishTime']"></a-date-picker>
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn">
                        <a-button type="primary" htmlType='submit'
                                  block
                                  size="large"
                                  :loading="publishVersion.confirmLoading"
                                  class="middle-btn">确认发布
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                destroyOnClose
                class="publish-task-modal"
                :width="800"
                v-model="publishTask.modalStatus"
                title="规划发布内容"
                :footer="null"
        >
            <div>
                <p v-show="publishTask.selectTaskList.length">已选择 <span class="text-warning">{{publishTask.selectTaskList.length}}</span>
                    项</p>
                <p class="muted" v-show="!publishTask.selectTaskList.length">请勾选需要发布的内容</p>
            </div>
            <vue-scroll>
                <div class="publish-task">
                    <a-checkbox-group v-model="publishTask.selectTaskList">
                        <div v-for="(taskStages, stageIndex) in publishTask.taskStages" :key="stageIndex" class="m-b">
                            <strong>{{taskStages.name}}</strong>
                            <a-list
                                    class="publish-task-list"
                                    :loading="taskStages.tasksLoading"
                                    itemLayout="horizontal"
                                    :dataSource="taskStages.tasks"
                            >
                                <a-list-item slot="renderItem" slot-scope="task,index">
                                    <a-list-item-meta
                                    >
                                        <div slot="title" :class="{'muted': task.version_code}">
                                            {{task.name}}
                                        </div>
                                        <div slot="avatar">
                                            <a-checkbox :value="task.code"></a-checkbox>
                                        </div>
                                    </a-list-item-meta>
                                </a-list-item>
                            </a-list>
                        </div>
                    </a-checkbox-group>
                </div>
            </vue-scroll>
            <div class="footer-item text-right m-t">
                <a-button type="primary" size="large" class="middle-btn" @click="addVersionTask">保存</a-button>
            </div>
        </a-modal>
        <a-modal
                destroyOnClose
                class="task-detail-modal"
                width="min-content"
                :closable="false"
                v-model="showTaskDetailModal"
                title=""
                :footer="null"
                @cancel="taskDetailClose"
        >
            <task-detail :taskCode="taskCode" @close="taskDetailClose"></task-detail>

        </a-modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import $ from 'jquery'
    import moment from 'moment';
    import taskDetail from '../../components/project/taskDetail'
    import {
        edit,
        del,
        read as getVersionInfo,
        getVersionTask as getVersionTask,
        getVersionLog
    } from "@/api/projectVersion";
    import {relativelyTaskTime, relativelyTime} from "@/assets/js/dateTime";
    import {checkResponse} from "../../assets/js/utils";
    import {addVersionTask, changeStatus, removeVersionTask} from "../../api/projectVersion";
    import {list as getTaskStages, tasks as getTasks} from "../../api/taskStages";
    import {notice} from "../../assets/js/notice";

    export default {
        name: "version-detail",
        components: {
            taskDetail
        },
        props: {
            versionCode: {
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
                loading: false,
                code: this.versionCode,
                projectCodeCurrent: '',
                task: {},
                showTaskDetailModal: false,
                taskCode: '',
                version: {},

                /*菜单*/
                visibleTaskMenu: false,


                /*标题*/
                versionName: '',

                /*日期*/
                showEditName: false,
                showStartTime: false,
                showPlanPublishTime: false,

                /*备注*/
                showVersionDescriptionEdit: false,

                versionTaskList: [],
                showChildTask: false,
                versionLogTotal: 0,
                versionLog: [],

                publishVersionForm: this.$form.createForm(this),
                publishVersion: {
                    modalStatus: false,
                    confirmLoading: false,
                    status: -1,
                },

                showMoreTaskLog: 0,
                hasMoreVersionLog: false,
                hideShowMore: false,

                publishTask: {
                    modalStatus: false,
                    confirmLoading: false,
                    loading: false,
                    selectTaskList: [],
                    taskStages: []
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            }),
            disableEdit() {
                return this.version.status == 3
            },
            versionTaskDoneNum() {
                const list = this.versionTaskList.filter(item => item.done == 1);
                return list.length;
            },
            checkShowMoreLog() {
                if (!this.hideShowMore) {
                    if (this.versionLogTotal > 5) {
                        return true;
                    }
                }
                return false;
            },
            versionTaskSchedule() {
                if (!this.versionTaskList.length) {
                    return false;
                }
                return this.versionTaskDoneNum / this.versionTaskList.length * 100
            },
            scrollOps() {
                return {
                    rail: {
                        background: '#e5e5e5',
                        opacity: 1
                    },
                    bar: {
                        keepShow: true
                    }
                }
            }
        },
        watch: {
            $route(to, from) {
                // if (from.name == 'taskdetail') {
                //     this.init();
                // }
            },
        },
        created() {
            this.init();
        },
        mounted() {
            this.changeModalHeight();
            window.onresize = () => {
                return (() => {
                    this.changeModalHeight();
                })()
            };
            document.onkeydown = (event) => {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (13 == e.keyCode && e.ctrlKey) {
                    //处理的部分
                    this.createComment();
                }
            };
        },
        filters: {
            formatLogTime(value) {
                return relativelyTime(value)
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.getVersion();
                this.getVersionTask();
            },
            detailClose() {
                this.$emit('close', this.version);
            },
            getVersion() {
                getVersionInfo({versionCode: this.code}).then(res => {
                    this.getVersionLog();
                    this.version = res.data;
                    this.versionName = res.data.name;
                    if (!this.version.start_time) {
                        this.version.setStartTime = false;
                        this.version.start_time = moment(moment().format('YYYY-MM-DD') + ' 18:00');
                    } else {
                        this.version.setStartTime = true;
                        this.version.start_time = moment(this.version.start_time);
                    }
                    this.version.start_time_format = relativelyTaskTime(this.version.start_time, true);

                    if (!this.version.plan_publish_time) {
                        this.version.setPlanPublishTime = false;
                        this.version.plan_publish_time = moment(moment().format('YYYY-MM-DD') + ' 18:00');
                    } else {
                        this.version.setPlanPublishTime = true;
                        this.version.plan_publish_time = moment(this.version.plan_publish_time);
                    }
                    this.version.plan_publish_time_format = relativelyTaskTime(this.version.plan_publish_time, true);
                    this.loading = false;
                });
            },
            getVersionTask() {
                getVersionTask({versionCode: this.code}).then(res => {
                    this.versionTaskList = res.data;
                });
            },
            getVersionLog() {
                getVersionLog({
                    versionCode: this.code, all: this.showMoreVersionLog,
                    pageSize: 5,
                }).then(res => {
                    // this.versionLog = res.data;
                    this.versionLog = res.data.list;
                    this.versionLogTotal = res.data.total;
                    if (res.data.total > 5) {
                        this.hasMoreVersionLog = true;
                        // this.showMoreTaskLog = 1;
                    }
                });
            },
            getMoreVersionLog() {
                this.showMoreVersionLog = 1;
                this.hideShowMore = true;
                this.getVersionLog();
            },
            getTaskStages() {
                if (this.disableEdit) {
                    return false
                }
                this.publishTask.modalStatus = true;
                this.publishTask.loading = true;
                getTaskStages({projectCode: this.version.projectCode, pageSize: 30}).then((res) => {
                    this.publishTask.taskStages = res.data.list;
                    if (this.publishTask.taskStages) {
                        this.publishTask.taskStages.forEach((v) => {
                            getTasks({stageCode: v.code}).then((res) => {
                                v.tasksLoading = false;
                                v.tasks = res.data;
                            })
                        })
                    }
                    this.changeModalHeight();
                    this.publishTask.loading = false;
                })
            },
            showTaskDetail(task) {
                this.showTaskDetailModal = true;
                this.taskCode = task.code;
            },
            taskDetailClose() {
                this.init();
                this.showTaskDetailModal = false;
                this.taskCode = '';
            },
            doVersion(action) {
                let app = this;
                const actionKey = action.key;
                switch (actionKey) {
                    case 'delete':
                        this.$confirm({
                            title: '删除版本',
                            content: `删除版本后，发布内容的版本字段将被清空，是否确定删除？`,
                            okText: '确定',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                del({versionCode: app.code}).then((res) => {
                                    const result = checkResponse(res);
                                    if (!result) {
                                        return false;
                                    }
                                    app.detailClose();
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                }
                this.visibleTaskMenu = false;
            },
            editTitle() {
                this.showEditName = true;
                this.$nextTick(() => {
                    this.$refs.inputTitle.focus();
                });
            },
            deleteTask() {
                let app = this;
                this.$confirm({
                    title: '彻底删除',
                    content: `彻底删除任务后，该任务及其子任务将会被永久被删除。`,
                    okText: '删除',
                    okType: 'danger',
                    cancelText: `再想想`,
                    onOk() {
                        del(app.code).then((res) => {
                            ``
                            app.detailClose();
                        });
                        return Promise.resolve();
                    }
                });
            },
            changeVersionStatus(e) {
                let app = this;
                if (e.key == this.version.code || this.version.status == 3) {
                    return false;
                }
                if (e.key == 3) {
                    //请确认当前版本发布内容已全部完成后再发布。
                    this.$confirm({
                        title: '发布提示',
                        content: `请确认当前版本发布内容已全部完成后再发布。`,
                        okText: '确认发布',
                        okType: 'primary',
                        onOk() {
                            app.publishVersion.status = e.key;
                            app.publishVersion.modalStatus = true;
                            app.$nextTick(function () {
                                app.publishVersionForm.setFieldsValue({
                                    publishTime: moment(),
                                });
                            });
                            return Promise.resolve();
                        }
                    });

                } else {
                    changeStatus({versionCode: this.version.code, status: e.key}).then(res => {
                        this.getVersion();
                    });
                }
            },
            handleSubmitPublishVersion() {
                let app = this;
                app.publishVersionForm.validateFields(
                    (err) => {
                        if (!err) {
                            let obj = app.publishVersionForm.getFieldsValue();
                            obj.publishTime = moment(obj.publishTime).format('YYYY-MM-DD HH:mm');
                            changeStatus({
                                versionCode: this.code,
                                status: this.publishVersion.status,
                                publishTime: obj.publishTime,
                            }).then(res => {
                                app.publishVersion.modalStatus = false;
                                app.getVersion();
                            });
                        }
                    })
            },
            doStartTime(setStartTime = false, showStartTime = false) {
                this.version.setStartTime = setStartTime;
                this.showStartTime = showStartTime;
                let beginTime = '';
                if (setStartTime) {
                    beginTime = moment(this.version.start_time).format('YYYY-MM-DD HH:mm');
                    this.version.start_time_format = moment(this.version.start_time).format('MM月DD日 HH:mm');
                } else {
                    beginTime = '';
                }
                this.editVersion({start_time: beginTime});

            },
            doPlanPublishTime(setPlanPublishTime = false, showPlanPublishTime = false) {
                this.version.setPlanPublishTime = setPlanPublishTime;
                this.showPlanPublishTime = showPlanPublishTime;
                let endTime = '';
                if (setPlanPublishTime) {
                    endTime = moment(this.version.plan_publish_time).format('YYYY-MM-DD HH:mm');
                    this.version.plan_publish_time_format = moment(this.version.plan_publish_time).format('MM月DD日 HH:mm');
                } else {
                    endTime = '';
                }
                this.editVersion({plan_publish_time: endTime});

            },
            doName() {
                this.showEditName = false;
                if (!this.version.name.trim() || this.version.name == this.versionName) {
                    this.version.name = this.versionName;
                    return false;
                }
                this.editVersion({name: this.version.name});
            },
            editVersion(data) {
                data.versionCode = this.code;
                edit(data).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.getVersion();
                });
            },
            showVersionDesc() {
                if (this.disableEdit) {
                    return false;
                }
                this.showVersionDescriptionEdit = true;
            },
            doContent() {
                let content = this.version.description;
                this.editVersion({description: content});
                this.showVersionDescriptionEdit = false;
            },
            addVersionTask() {
                addVersionTask({
                    taskCodeList: JSON.stringify(this.publishTask.selectTaskList),
                    versionCode: this.code
                }).then(res => {
                    notice({title: `成功添加 ${res.data.successTotal} 项发布内容到版本`}, 'notice', 'success');
                    this.publishTask.modalStatus = false;
                    this.publishTask.selectTaskList = [];
                    this.init();
                })
            },
            removeVersionTask(task) {
                let app = this;
                this.$confirm({
                    title: '移除发布内容',
                    content: `确定移除这个发布内容？`,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: `再想想`,
                    onOk() {
                        removeVersionTask({taskCode: task.code}).then((res) => {
                            const result = checkResponse(res);
                            if (!result) {
                                return false;
                            }
                            app.init();
                        });
                        return Promise.resolve();
                    }
                });
            },
            changeModalHeight() {
                const defaultWidth = this.width;
                let width = $(window).width() - 100;
                let height = $(window).height() - 150;
                let logHeight = $(window).height() - 200;
                let publishModalHeight = $(window).height() - 255;
                if (defaultWidth === 'full-screen' || this.$route.query['full-screen'] !== undefined) {
                    //全屏显示
                    $(".task-detail-modal").css("width", $(window).width());
                    $(".version-detail").css("width", $(window).width());
                    $(".ant-modal").css("top", 0);
                    height += 85;
                    logHeight += 85;
                    $(".content-left").css("height", height + "px");
                    $(".log-wrap").css("height", logHeight + "px");
                } else {
                    if (width > defaultWidth) {
                        width = defaultWidth;
                    }
                    $(".version-detail").css("width", width);
                    $(".content-left").css("height", height + "px");
                    $(".log-wrap").css("height", logHeight + "px");
                    $(".publish-task").css("height", publishModalHeight + "px");
                }
            }
        }
    }
</script>


<style lang="less">
    @import "~ant-design-vue/lib/style/themes/default";
    @import "../../assets/css/components/task";

    .field-flex {
        display: flex;
        justify-content: flex-start;
    }

    .task-tag {
        .ant-tag {
            margin-bottom: 6px;
        }
    }

    .version-detail {
        background: #FFF;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        min-height: 1px;
        min-width: 1px;
        margin: auto;

        .version-detail-spin {
            width: 100%;
        }

        .task-header {
            padding: 20px 0;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            vertical-align: middle;


            .head-title {
                padding: 0 20px 0 20px;
                flex: 1 1;

                .breadcrumb {
                    display: inline;

                    a {
                        color: inherit;

                        &:hover {
                            color: #40a9ff;
                        }

                    }
                }
            }

            .header-action {
                font-size: 16px;
                padding: 0 20px;
                display: flex;
                max-height: 24px;

                .action-item {
                    margin-left: 10px;
                    padding: 4px;
                    transition: 218ms;
                    transition-property: background, color;
                    border-radius: 4px;
                    align-items: center;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    min-width: 32px;

                    span {
                        margin-left: 6px;
                        font-size: 14px;
                    }

                    &.active {
                        color: #3da8f5;
                    }

                    &:hover {
                        background: #ecf6fe;
                        color: #3da8f5;
                        border-radius: 4px;
                    }
                }
            }

            &.disabled {
                background: #f5f5f5;
            }
        }

        .task-wrap {
            .task-content {
                display: flex;
                justify-content: flex-start;

                .content-left {
                    border-right: 1px solid #e5e5e5;
                    min-width: 560px;
                    width: 63%;
                    /*width: 760px;*/

                    .task-title {
                        margin: 10px 40px 20px 20px;
                        cursor: text;

                        &.disabled {
                            cursor: not-allowed;

                            &:hover {
                                background: inherit;
                            }

                            .ant-input, .title-text {
                                &:hover, &:focus {
                                    background: inherit;
                                }
                            }
                        }

                        &:hover {
                            background: #f5f5f5;
                        }

                        .title-text {
                            line-height: 24px;
                        }

                        .ant-input, .title-text {
                            font-size: 20px;
                            padding: 8px;
                            border: none !important;
                            border-radius: 4px;

                            &:hover, &:focus {
                                background: #f5f5f5;
                                box-shadow: none !important;
                                border-right-width: 0 !important;
                                border: none !important;
                                border-radius: 4px;
                            }
                        }
                    }

                    .task-basic-attrs-view {
                        .field-list {
                            padding: 0 40px 0 32px;

                            &.disabled {
                                .field-right, a {
                                    cursor: not-allowed !important;
                                }
                            }

                            .component-mount {
                                .field {
                                    display: flex;
                                    justify-content: flex-start;
                                    margin: 12px 0;
                                    min-height: 36px;

                                    .field-left {
                                        align-self: flex-start;
                                        width: 132px;
                                        height: 36px;
                                        padding-right: 12px;
                                    }

                                    .field-right {
                                        cursor: pointer;
                                        max-width: calc(100% - 132px);

                                        .inline-block {
                                            display: inline-block;
                                        }

                                        &.field-date {
                                            display: flex;
                                        }

                                        &.width-block {
                                            width: 100%;

                                            .w-e-text {
                                                cursor: text;
                                            }
                                        }

                                        .name {
                                            margin: 0 8px;
                                        }
                                    }

                                    .block-field {
                                        width: 100%;
                                        border: 1px solid #e5e5e5;
                                        border-radius: 4px;
                                        padding: 2px 0;
                                        margin-bottom: 12px;
                                        display: flex;
                                        justify-content: flex-start;
                                        flex-direction: row;
                                    }

                                    .task-child {
                                        width: 100%;

                                        .task-list {
                                            padding: 8px 0;

                                            .list-item {
                                                padding: 4px 12px 4px 5px;
                                                display: flex;
                                                align-items: center;
                                                /*justify-content: space-between;*/

                                                .task-title, .task-input {
                                                    flex: 1 1;
                                                    margin: 0;
                                                }

                                                .title-text {
                                                    color: #333;
                                                    line-height: 14px;

                                                    &.done {
                                                        color: #a6a6a6;
                                                    }
                                                }

                                                .ant-input, .title-text {
                                                    font-size: 14px;

                                                    &:hover, &:focus {
                                                    }
                                                }

                                                .check-box-wrapper {
                                                    margin-top: 0;
                                                }

                                                .task-item {
                                                    cursor: pointer;
                                                    margin-right: 12px;

                                                    &.disabled {
                                                        cursor: not-allowed;
                                                    }

                                                    &.check-box {
                                                        .anticon-check {
                                                            visibility: visible;
                                                            top: 14px;
                                                            left: 18px;
                                                        }
                                                    }

                                                }
                                            }

                                            .action-btn {
                                                padding: 2px 12px 2px 16px;
                                            }
                                        }

                                        .add-handler {
                                            /*margin-bottom: 8px;*/
                                            padding-left: 16px;
                                            padding-right: 12px;
                                            display: flex;
                                            align-items: center;
                                            height: 36px;
                                        }
                                    }

                                    .file-list {
                                        width: 100%;
                                        padding: 8px;

                                        .ant-list-item {
                                            padding: 10px 12px;
                                            border-bottom: none;
                                            border-radius: 4px;
                                            margin-bottom: 2px;

                                            &:hover {
                                                background-color: #f5f5f5;
                                            }

                                            .ant-list-item-meta-title {
                                                margin-bottom: 0;
                                                line-height: 24px;
                                            }
                                        }
                                    }
                                }

                                .field-name {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    padding-left: 8px;
                                }

                                .task-description {
                                    &:hover {
                                        background: #f5f5f5;
                                        border-radius: 4px;
                                    }

                                    &.disabled {
                                        &:hover {
                                            background: inherit;
                                        }
                                    }

                                    padding: 8px;
                                    margin: -8px;

                                    .description-txt {
                                        max-height: 300px;
                                        overflow: hidden;
                                    }

                                    p {
                                        margin: 0;
                                    }
                                }
                            }
                        }
                    }
                }

                .content-right {
                    width: 37%;
                    /*width: 440px;*/

                    .header {
                        padding: 15px 20px 20px 20px;
                    }

                    .member-list {
                        padding-top: 12px;
                        display: flex;
                        justify-content: flex-start;

                        .member-item {
                            margin-right: 10px;

                            &.invite {
                                cursor: pointer;
                            }
                        }
                    }

                    .log-wrap {
                        border-top: none;
                        border-bottom: none;
                        padding-bottom: 12px;

                        .header {
                            width: 100%;
                        }

                        .log-list {
                            /*font-size: 12px;*/
                            padding: 0 20px 0 20px;

                            .show-more {
                                display: block;
                                margin-bottom: 20px;
                            }

                            .list-item {
                                display: flex;
                                justify-content: flex-start;
                                align-items: baseline;
                                vertical-align: middle;
                                width: 100%;

                                &.log-comment {
                                    align-items: end;
                                }

                                .log-item {
                                    margin-right: 12px;
                                    margin-bottom: 24px;

                                    .anticon {
                                        font-size: 14px;
                                    }

                                    .log-content {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        border-left: 5px solid #ccc;
                                        padding-left: 12px;
                                        margin-top: 6px;
                                    }
                                }

                                .log-txt {
                                    flex: 1 1;
                                }
                            }
                        }
                    }

                    .footer {
                        padding: 20px 20px 0 20px;
                        display: flex;
                    }
                }
            }
        }
    }

    .publish-task-modal {
        .ant-modal-body {
            padding: 12px 12px 12px 24px;
        }

        .publish-task {
            padding-right: 18px;

            .ant-checkbox-group {
                width: 100%;
            }
        }
    }
</style>
