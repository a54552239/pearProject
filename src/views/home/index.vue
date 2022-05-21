<template>
    <div class="home-index">
        <div class="page-header">
            <p class="day-text muted">『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》 <a class="muted" @click="getYiYan">
                <a-icon type="reload"/>
            </a>
            </p>
            <div class="header-content" v-if="userInfo">
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
            <a-row class="page-wrapper-content" :gutter="24">
                <a-col class="project-list-content" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-card
                            class="project-list"
                            :loading="loading"
                            style="margin-bottom: 24px;"
                            :bordered="false"
                            title="进行中的项目"
                            :body-style="{ padding: 0 }">
                        <router-link to="/project/list/my" slot="extra">全部项目</router-link>
                        <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: start;">
                            <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projectList">
                                <a-card :bordered="false" :body-style="{ padding: 0 }" @click="routerLink('/project/space/task/' + item.code)">
                                    <img
                                        slot="cover"
                                        alt="example"
                                        :src="item.cover"
                                    />
                                    <a-card-meta>
                                        <div slot="title" class="card-title">
<!--                                            <a-avatar size="small" :src="item.cover"/>-->
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
                        style="padding: 0 12px;flex: 1"
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
                                            <a class="task-title-wrap">
                                                <a-tooltip title="优先级">
                                                    <a-tag :color="priColor(item.pri)">{{item.priText}}</a-tag>
                                                </a-tooltip>
                                                <a-tooltip placement="top">
                                                    <template slot="title">
                                                        <template v-if="item.pcode">
                                                            <span v-if="item.parentDone" style="font-size: 12px;">父任务已完成，无法重做子任务</span>
                                                            <span v-else-if="item.hasUnDone" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                                                        </template>
                                                        <template v-else>
                                                            <span v-if="item.hasUnDone" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                                                        </template>
                                                    </template>
                                                     <span class="check-box-wrapper task-item"
                                                           @click.stop="()=>{if(item.deleted || item.hasUnDone || (item.pcode && item.parentDone)) return false;taskDone(item.code, !item.done)}">
                                                        <a-icon class="check-box"
                                                                :class="{'disabled': item.deleted || item.parentDone || item.hasUnDone}"
                                                                :type="item.done ? 'check-square' : 'border'"
                                                                :style="{fontSize:'16px'}"/>
                                                </span>
                                                </a-tooltip>
                                                <a-tooltip :title="item.name">
                                                    <span @click="showTaskDetail = true;taskCode = item.code">{{ item.name }}</span>
                                                </a-tooltip>
                                            </a>
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
                    <a-card class="events-list" :loading="events.loading" :title="`日程 · ${events.eventList.length}`" :bordered="false"  style="margin-bottom: 24px">
                        <router-link to="/calendar" slot="extra">日程日历</router-link>
                        <div class="list-content">
                            <a-list
                                :loading="events.loading"
                            >
                                <a-list-item class="list-item" :key="index" v-for="(item, index) in events.eventList">
                                    <a-list-item-meta>
                                        <div slot="title" style="display:flex;line-height: 20px;">
                                            <div class="info-item">
                                                <div class="text-center text-grey">
                                                    <div>{{ moment(item.begin_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                                    <div> ~</div>
                                                    <div>{{ moment(item.end_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                                </div>
                                            </div>
                                            <div class="info-item">
                                                <div class="line-item" style="font-size: 18px;margin-bottom: 20px;">
                                                    <span> {{ item.title }}</span>
                                                </div>
                                                <div class="line-item text-grey"> <a-icon type="environment" class="m-r-xs"/>{{ item.position }}</div>
                                                <template v-if="item.description">
                                                    <!--                                                <div class="line-item">备注</div>-->
                                                    <div class="line-item text-grey">{{item.description}}</div>
                                                </template>
                                                <div class="line-item">参与者 · {{item.memberList.length}}</div>
                                                <div class="line-item">
                                                    <template v-for="member in item.memberList">
                                                        <a-tooltip :title="`${member.memberInfo.name} ${member.is_owner ? ' · 组织者' : member.status ? member.status == 1 ? ' · 已接受' : ' · 已拒绝' : ' · 未响应'}`" :key="member.id">
                                                            <a-avatar :size="24" icon="user" :src="member.memberInfo.avatar"
                                                                      class="m-r-sm" />
                                                        </a-tooltip>
                                                    </template>
                                                </div>
                                                <template v-if="item.projectName">
                                                    <div class="line-item m-t text-grey" @click="routerLink('/project/space/events/' + item.project_code)">
                                                        <a-tag color="#52c41a" style="cursor: pointer;">{{item.projectName}}</a-tag>
                                                    </div>
                                                </template>
                                            </div>
                                            <div class="actions" style="position: absolute;right: 0;">
                                                <template v-if="item.waitConfirm">
                                                    <a-tooltip title="接受">
                                                        <a class="m-l-xs muted"><a-icon type="check"  @click="confirmJoinEvents(item, 1)"/></a>
                                                    </a-tooltip>
                                                    <a-tooltip title="拒绝">
                                                        <a class="m-l muted"> <a-icon type="close" @click="confirmJoinEvents(item, 2)"/></a>
                                                    </a-tooltip>
                                                </template>
                                            </div>
                                        </div>
                                    </a-list-item-meta>
                                    <div class="other-info muted">
                                    </div>
                                </a-list-item>
                                <div v-if="events.showLoadingMore" slot="loadMore"
                                     :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                    <a-spin v-if="events.loadingMore"/>
                                    <a-button v-else @click="onLoadMoreEvents">查看更多日程</a-button>
                                </div>
                            </a-list>
                        </div>
                    </a-card>
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
        <a-modal
            destroyOnClose
            class="task-detail-modal"
            width="min-content"
            :closable="false"
            :visible="showTaskDetail"
            title=""
            :footer="null"
            @cancel="detailClose"
        >
            <task-detail :taskCode="taskCode" @close="detailClose"></task-detail>

        </a-modal>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import moment from "moment";
    import taskDetail from '../../components/project/taskDetail'
    import {getYiYan} from "@/api/other";
    import {formatTaskTime, relativelyTime, showHelloTime} from "assets/js/dateTime";
    import {selfList as getProjectList} from "../../api/project";
    import {list as accountList} from "../../api/user";
    import pagination from "../../mixins/pagination";
    import {getLogBySelfProject, selfList, taskDone} from "@/api/task";
    import task from "../project/space/task";
    import {confirmJoin, myList} from "@/api/projectEvents";
    import {checkResponse} from "assets/js/utils";

    export default {
        components: {
            taskDetail
        },
        mixins: [pagination],
        data() {
            return {
                moment,
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
                    pageSize: 30,
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
                showTaskDetail: false,
                taskCode: '',
                events: {
                    eventList: [],
                    showLoadingMore: false,
                    loadingMore: false,
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    loading: false,
                }
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
                this.getEvents();
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
            getEvents() {
                let app = this;
                myList({page: this.events.page, pageSize: this.events.pageSize, deleted: 0}).then(res => {
                    app.events.eventList = app.events.eventList.concat(res.data.list);
                    app.events.total = res.data.total;
                    app.events.showLoadingMore = app.events.total > app.events.eventList.length;
                    app.events.loading = false;
                    app.events.loadingMore = false
                })
            },
            getYiYan() {
                let app = this;
                getYiYan(function (data) {
                    app.yiyan = data
                }, 'd')
            },
            getTasks(reload = true) {
                if (reload) {
                    this.task.page = 1;
                }
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
                this.getTasks();
            },
            taskSelectChange(value) {
                this.task.done = value;
                this.task.loadingMore = true;
                this.getTasks();
            },
            onLoadMoreTask(page, PageSize) {
                this.task.loadingMore = true;
                this.task.page = page;
                this.getTasks(false);
            },
            onLoadMoreAccounts(page, PageSize) {
                this.accounts.loadingMore = true;
                this.accounts.page = page;
                this.getAccountList();
            },
            detailClose() {
                this.taskCode = '';
                this.showTaskDetail = false;
                this.getTasks(false);
            },
            taskDone(taskCode, done) {
                done ? done = 1 : done = 0;
                taskDone(taskCode, done).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.getTasks(false);
                });
            },
            onLoadMoreEvents(page, PageSize) {
                this.events.loadingMore = true;
                this.events.page = page;
                this.getEvents();
            },
            confirmJoinEvents(events, status) {
                let app = this;
                confirmJoin({eventsCode: events.code, status: status}).then(res=>{
                    if (checkResponse(res)) {
                        events.waitConfirm = 0;
                        events.memberList.forEach(v => {
                            if (v.member_code == app.$store.state.userInfo.code ) {
                                v.status = status;
                            }
                        })
                    }
                });
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

            .page-wrapper-content {
                display: flex;
            }

            .project-list {
                .project-card-grid {
                    width: 25%;
                    padding: 12px;
                    cursor: pointer;
                }

                .ant-card-cover {
                    height: 125px;
                    img {
                        display: block !important;
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover !important;
                    }
                }


                .card-title {
                    font-size: 0;

                    a {
                        color: rgba(0, 0, 0, 0.85);
                        //margin-left: 12px;
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

                .ant-card-meta-title {
                    margin-bottom: 0px;
                    margin-top: 8px;
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

                        .check-box-wrapper {
                            text-align: center;
                            margin: 11px 2px 0 0;
                            padding: 10px 0;
                            transition: background 218ms;
                            border-radius: 3px;
                            .check-box {
                                color: #A6A6A6;
                                cursor: pointer;
                                border-radius: 3px;
                                margin: 5px;
                            }
                            &:hover {
                                .check-box {
                                    color: grey;
                                }

                                background: #f5f5f5;
                            }
                        }
                    }
                }
            }

            .events-list {
                .ant-card-body {
                    padding: 0px 6px;

                    .ant-list-item-meta, .ant-list-item-meta-content{
                        width: 100%;
                    }
                }
                .list-content {

                    .list-item-title {
                        padding: 10px 20px;

                        .ant-list-item-action {
                            li {
                                color: #fff;
                            }

                            em {
                                width: 0;
                            }
                        }
                    }

                    .list-item {
                        margin-top: 10px;
                        border-bottom: none;
                        margin-bottom: 2px;
                        border-bottom: 1px solid #f5f5f5;
                        padding: 10px 20px;
                        transition: background-color 218ms;

                        &:hover {
                            //cursor: pointer;
                            //background-color: #f5f5f5;
                        }

                        .ant-list-item-meta-title {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            position: relative;
                            margin-bottom: 0;
                            line-height: 32px;
                        }

                        .ant-list-item-action {
                            em {
                                width: 0;
                            }
                        }
                    }

                    .info-item {
                        margin-right: 35px;
                    }

                    .line-item {
                        margin-bottom: 10px;
                    }

                    .other-info {
                        display: flex;

                        .info-item {
                            display: flex;
                            flex-direction: column;
                            padding-left: 0;
                            width: 105px;
                            text-align: right;
                        }

                        .schedule {
                            width: 250px;
                        }
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
