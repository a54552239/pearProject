<template>
    <div class="home-index">
        <div class="page-header">
            <p class="day-text muted">『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》 <a class="muted" @click="getYiYan">
                <a-icon type="reload"/>
            </a>
            </p>
            <div class="header-content">
                <div class="left-content">
                    <div class="avatar">
                        <a-avatar :size="64" :src="userInfo.avatar">{{userInfo.name}}</a-avatar>
                    </div>
                    <div class="user-info">
                        <div class="title">{{helloTime}}{{ userInfo.name }}，祝你开心每一天！</div>
                        <div class="team muted" v-if="userInfo.position">{{userInfo.position}}
                            <template v-if="userInfo.department"> | {{ userInfo.department }}</template>
                        </div>
                    </div>
                </div>
                <div class="right-content">
                    <!--<div class="content-item">
                        <div class="item-title muted">
                            任务数
                        </div>
                        <div class="item-text">
                            <span>{{task.total}}</span>
                        </div>
                    </div>-->
                    <div class="content-item">
                        <div class="item-title muted">
                            团队人数
                        </div>
                        <div class="item-text">
                            <span>{{accounts.total}}</span>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="item-title muted">
                            项目总数
                        </div>
                        <div class="item-text">
                            <span>{{projectTotal}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--<wrapper-content :showHeader="false">-->
        <div class="page-wrapper">
            <a-row :gutter="24">
                <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-card
                            class="project-list"
                            :loading="loading"
                            style="margin-bottom: 24px;"
                            :bordered="false"
                            title="进行中的项目"
                            :body-style="{ padding: 0 }">
                        <router-link to="/project/list/my" slot="extra">全部项目</router-link>
                        <div>
                            <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projectList">
                                <a-card :bordered="false" :body-style="{ padding: 0 }" @click="routerLink('/project/space/task/' + item.code)">
                                    <a-card-meta>
                                        <div slot="title" class="card-title">
                                            <a-avatar size="small" :src="item.cover"/>
                                            <router-link :to="'/project/space/task/' + item.code">
                                                <a-icon type="star" theme="filled" style="color: #ffaf38;margin-right: 6px;" v-show="item.collected"/>{{ item.name }}
                                            </router-link>
                                        </div>
                                        <div slot="description" class="card-description">
                                            <a-tooltip :mouseEnterDelay="0.3"
                                                       :title="item.description">
                                            <span class="description-text">
                                                <span v-if="item.description">{{ item.description }}</span>
                                                <span v-else>暂无介绍</span>
                                            </span>
                                            </a-tooltip>
                                            <a-tooltip placement="right" :mouseEnterDelay="0.3"
                                                       :title="`当前进度：${item.schedule}%`">
                                                <a-progress :strokeWidth="2" :showInfo="false"
                                                            :percent="item.schedule"/>
                                            </a-tooltip>
                                        </div>
                                    </a-card-meta>
                                    <div class="project-item">
                                        <a href="/#/">{{ item.owner_name }}</a>
                                        <span class="datetime">{{ formatTime(item.create_time) }}</span>
                                    </div>
                                </a-card>
                            </a-card-grid>
                            <p class="muted text-center m-t-md m-b-md" v-if="!projectList.length">暂无项目</p>
                        </div>
                    </a-card>
                    <a-card class="activities-list" :loading="loading" title="动态"  :bordered="false">
                        <a-list>
                            <a-list-item :key="index" v-for="(item, index) in activities">
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" :src="item.member_avatar"/>
                                    <div slot="title">
                                        <span>{{ item.member_name }}</span>
                                        <span v-if="item.is_comment == 0">  <span v-html="item.remark "></span></span>&nbsp;
                                        <template v-if="item.is_comment == 1">发表了评论
                                            <p class="comment-text">{{ item.content }}</p>
                                        </template>
                                        <router-link target="_blank"
                                                :to="`/project/space/task/${item.project_code}/detail/${item.source_code}`"
                                                class="right-item">「 {{ item.task_name }} 」
                                        </router-link>
                                    </div>
                                    <div slot="description">
                                        <!--<a-tooltip :mouseEnterDelay="0.3" :title="item.create_time">-->
                                        {{ formatTime(item.create_time) }} -
                                        <router-link target="_blank" :to="`/project/space/task/${item.project_code}`" class="muted">
                                            {{item.project_name}}
                                        </router-link>
                                        <!--</a-tooltip>-->
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-card>
                </a-col>
                <a-col
                        style="padding: 0 12px"
                        :xl="8"
                        :lg="24"
                        :md="24"
                        :sm="24"
                        :xs="24">
                    <a-card class="tasks-list" style="margin-bottom: 24px"
                            :bordered="false">
                        <div slot="title">
                            <div class="flex ant-row-flex-space-between ant-row-flex-middle">
                                <span>我的任务 · {{task.total}}</span>
                                <a-select v-model="task.done" @select="taskSelectChange" :defaultActiveFirstOption="false">
                                    <a-select-option :key="0">未完成</a-select-option>
                                    <a-select-option :key="1">已完成</a-select-option>
                                </a-select>
                            </div>
                        </div>
                        <a-tabs defaultActiveKey="1" :animated="false" @change="taskTabChange">
                            <a-tab-pane key="1">
                                <span slot="tab"><a-icon type="bars" />我执行的</span>
                            </a-tab-pane>
                            <a-tab-pane key="2">
                                <span slot="tab"><a-icon type="team" />我参与的</span>
                            </a-tab-pane>
                            <a-tab-pane key="3">
                                <span slot="tab"><a-icon type="rocket" />我创建的</span>
                            </a-tab-pane>
                        </a-tabs>
                        <a-list :loading="task.loading">
                            <a-list-item :key="index" v-for="(item, index) in task.list">
                                <a-list-item-meta>
                                    <div slot="title">
                                        <div style="display: flex;justify-content: space-between ">
                                            <router-link target="_blank"
                                                         class="task-title-wrap"
                                                         :to="`/project/space/task/${item.projectInfo.code}/detail/${item.code}`">
                                                <a-tooltip title="优先级">
                                                    <a-tag :color="priColor(item.pri)">{{item.priText}}</a-tag>
                                                </a-tooltip>
                                                <a-tooltip :title="item.name">
                                                    {{ item.name }}
                                                </a-tooltip>
                                            </router-link>
                                            <div>
                                                <a-tooltip title="任务开始 - 截止时间" v-if="item.end_time">
                                                    <span class="label m-r-sm" :class="showTimeLabel(item.end_time)">{{showTaskTime(item.begin_time, item.end_time)}}</span>
                                                </a-tooltip>
                                                <a-tooltip title="子任务" v-if="item.pcode">
                                                    <a-icon type="cluster" class="m-r-sm muted"/>
                                                </a-tooltip>
                                                <router-link target="_blank" class="muted" :to="'/project/space/task/' + item.projectInfo.code">
                                                    <a-tooltip title="所属项目">{{ item.projectInfo.name }}</a-tooltip>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                   <!-- <div slot="description">
                                    </div>-->
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                        <a-pagination class="pull-right m-b" size="small" :defaultPageSize="task.pageSize" v-model="task.page" :total="task.total" @change="onLoadMoreTask"/>
                    </a-card>
                    <!-- <a-col
                             style="padding: 0 12px"
                             :xl="8"
                             :lg="24"
                             :md="24"
                             :sm="24"
                             :xs="24">
                         <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false"
                                 :body-style="{padding: 0}">
                             <div class="item-group">
                                 <a>操作一</a>
                                 <a>操作二</a>
                                 <a>操作三</a>
                                 <a>操作四</a>
                                 <a>操作五</a>
                                 <a>操作六</a>
                                 <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
                             </div>
                         </a-card>-->
                    <!--    <a-card title="XX 指数" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false" :body-style="{ padding: 0 }">
                            <div style="min-height: 400px;">
                                &lt;!&ndash; :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  &ndash;&gt;
                                <radar :data="radarData" />
                            </div>
                        </a-card>-->
                    <a-card :loading="loading" :title="'团队  · ' + accounts.total" :bordered="false">
                        <div class="members">
                            <a-row>
                                <a-col :span="8" v-for="(item, index) in accounts.list" :key="index">
                                    <a @click="routerLink('/members/profile/' + item.membar_account_code + '?key=3')" style="display: flex;align-items: center"
                                    >
                                        <a-avatar size="small" :src="item.avatar"/>
                                        <span class="member">{{ item.name }}</span>
                                    </a>
                                </a-col>
                            </a-row>
                        </div>
                        <a-pagination class="pull-right m-b" :defaultPageSize="accounts.pageSize" size="small" v-show="accounts.total > accounts.pageSize" v-model="accounts.page" :total="accounts.total" @change="onLoadMoreAccounts"/>
                    </a-card>
                </a-col>
            </a-row>
        </div>
        <!--</wrapper-content>-->
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import moment from "moment";
    import {getYiYan} from "../../api/other";
    import {formatTaskTime, relativelyTime, showHelloTime} from "../../assets/js/dateTime";
    import {selfList as getProjectList} from "../../api/project";
    import {list as accountList} from "../../api/user";
    import pagination from "../../mixins/pagination";
    import {getLogBySelfProject, selfList} from "../../api/task";
    import task from "../project/space/task";

    export default {
        components: {},
        mixins: [pagination],
        data() {
            return {
                loading: false,
                yiyan: {},
                projectList: [],
                projectTotal: 0,
                activities: [],
                tasks: [],
                tasksTotal: 0,
                // accounts: [],
                accounts: {
                    list: [],
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    loading: false,
                },
                task: {
                    list: [],
                    taskType: '1',
                    done: 0,
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    loading: false,
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
                socketAction: state => state.socketAction,
            }),
            helloTime() {
                return showHelloTime()
            }
        },
        created() {
            this.getYiYan();
            this.init();
        },
        watch:{
            $route: function (to, from) {
                this.init();
            },
            socketAction(val) {
                console.log(val);
                if (val.action === 'organization:task') {
                    this.init(false, false);
                }
            },
        },
        methods: {
            init(reset = true, loading = true) {
                if (reset) {
                    this.projectList = [];
                    this.pagination.page = 1;
                    this.pagination.pageSize = 9;
                }
                this.getProjectList(loading);
                this.getTasks();
                this.getTaskLog();
                this.getAccountList();

            },
            getProjectList(loading) {
                if (loading) {
                    this.loading = true;
                }
                getProjectList(this.requestData).then(res => {
                    this.projectList = res.data.list;
                    this.projectTotal = res.data.total;
                    this.loading = false;
                });
            },
            getTaskLog() {
                getLogBySelfProject().then(res => {
                    this.activities = res.data;
                })
            },
            getAccountList() {
                this.accounts.loading = true;
                accountList({page: this.accounts.page, pageSize: this.accounts.pageSize}).then(res => {
                    this.accounts.loading = false;
                    this.accounts.list =  res.data.list;
                    this.accounts.total = res.data.total;
                })
            },
            getYiYan() {
                let app = this;
                getYiYan(function (data) {
                    app.yiyan = data
                }, 'd')
            },
            getTasks() {
                this.task.loading = true;
                selfList({page: this.task.page, pageSize: this.task.pageSize, taskType: this.task.taskType, type: this.task.done}).then(res => {
                    this.task.loading = false;
                    this.task.list =  res.data.list;
                    // this.task.list =  this.task.list.concat(res.data.list);;
                    this.task.total = res.data.total;
                })
            },
            taskTabChange(key) {
                console.log(key);
                this.task.taskType = key;
                this.task.loadingMore = true;
                this.task.page = 1;
                this.getTasks();
            },
            taskSelectChange(value) {
                this.task.done = value;
                this.task.loadingMore = true;
                this.task.page = 1;
                this.getTasks();
            },
            onLoadMoreTask(page, PageSize) {
                this.task.loadingMore = true;
                this.task.page = page;
                this.getTasks();
            },
            onLoadMoreAccounts(page, PageSize) {
                this.accounts.loadingMore = true;
                this.accounts.page = page;
                this.getAccountList();
            },
            priColor(pri) {
                switch (pri) {
                    case 1:
                        return '#ff9900';
                    case 2:
                        return '#ed3f14';
                    default:
                        return 'green';

                }
            },
            formatTime(time) {
                return relativelyTime(time);
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
            },
            showTimeLabel(time) {
                let str = 'label-primary';
                if (time == null) {
                    return str;
                }
                let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
                if (cha < 0) {
                    str = 'label-danger';
                } else if (cha == 0) {
                    str = 'label-warning';
                } else if (cha > 7) {
                    str = 'label-normal'
                }
                return str;
            },
        }
    }
</script>
<style lang="less">
    .home-index {
        .page-header {
            .header-content {
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;

                .left-content {
                    display: flex;
                    align-items: center;

                    .user-info {
                        margin-left: 12px;
                        line-height: 33px;

                        .title {
                            font-size: 20px;
                        }

                        .team {

                        }
                    }
                }

                .right-content {
                    display: flex;

                    .content-item {
                        padding: 0 32px;
                        position: relative;

                        .item-text {
                            font-size: 30px;

                            .small {
                                font-size: 20px;
                            }
                        }

                        &:after {
                            background-color: #e8e8e8;
                            position: absolute;
                            top: 8px;
                            right: 0;
                            width: 1px;
                            height: 40px;
                            content: "";
                        }

                        &:last-child {
                            &:after {
                                width: 0;
                            }
                        }
                    }
                }
            }
        }

        .page-wrapper {
            margin: 24px;

            .project-list {

                .card-title {
                    font-size: 0;

                    a {
                        color: rgba(0, 0, 0, 0.85);
                        margin-left: 12px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        vertical-align: top;
                        font-size: 14px;

                        &:hover {
                            color: #1890ff;
                        }
                    }
                }

                .card-description {
                    color: rgba(0, 0, 0, 0.45);
                    height: 44px;
                    line-height: 22px;
                    overflow: hidden;
                    .description-text{
                        height: 22px;
                    }
                }

                .project-item {
                    display: flex;
                    margin-top: 8px;
                    overflow: hidden;
                    font-size: 12px;
                    height: 20px;
                    line-height: 20px;

                    a {
                        color: rgba(0, 0, 0, 0.45);
                        display: inline-block;
                        flex: 1 1 0;

                        &:hover {
                            color: #1890ff;
                        }
                    }

                    .datetime {
                        color: rgba(0, 0, 0, 0.25);
                        flex: 0 0 auto;
                        float: right;
                    }
                }

                .ant-card-meta-description {
                    color: rgba(0, 0, 0, 0.45);
                    height: 44px;
                    line-height: 22px;
                    overflow: hidden;
                }
            }

            .activities-list {
                .ant-list-item-meta-title {
                    position: relative;
                }

                .comment-text {
                    margin-bottom: 0;
                }

                .right-item {
                    float: right;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }

            .tasks-list {
                .ant-card-body {
                    padding: 6px 24px;

                    .ant-list-item-meta, .ant-list-item-meta-content{
                        width: 100%;
                    }

                    .task-title-wrap{
                        /*max-width: 310px;*/
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding-right: 10px;
                    }
                }
            }

            .item-group {
                padding: 20px 0 8px 24px;
                font-size: 0;

                a {
                    color: rgba(0, 0, 0, 0.65);
                    display: inline-block;
                    font-size: 14px;
                    margin-bottom: 13px;
                    width: 25%;
                }
            }

            .members {
                a {
                    display: block;
                    margin: 12px 0;
                    line-height: 24px;
                    height: 24px;

                    .member {
                        font-size: 14px;
                        color: rgba(0, 0, 0, .65);
                        line-height: 24px;
                        max-width: 100px;
                        vertical-align: top;
                        margin-left: 6px;
                        transition: all 0.3s;
                        display: inline-block;
                    }

                    &:hover {
                        span {
                            color: #1890ff;
                        }
                    }
                }
            }
        }
    }
</style>
