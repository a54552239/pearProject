<template>
    <div class="project-space-features" :class="project.task_board_theme">
        <div class="project-navigation">
            <div class="project-nav-header">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <a-tooltip :mouseEnterDelay="0.3" :title="project.name">
                            <span class="nav-title">{{ project.name }}</span>
                        </a-tooltip>
                        <span class="actions">
                             <a-tooltip :mouseEnterDelay="0.3" :title="project.collected ? '取消收藏' : '加入收藏'"
                                        @click="collectProject">
                            <a-icon type="star" theme="filled" style="color: grey;" v-show="!project.collected"/>
                            <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="project.collected"/>
                        </a-tooltip>
                        </span>
                        <span class="label label-normal" v-if="project.private === 0"><a-icon
                                type="global"/> 公开</span>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li><a class="app" data-app="tasks"
                           @click="$router.push('/project/space/task/' + project.code)">任务</a></li>
                    <li class=""><a class="app" data-app="works"
                                    @click="$router.push('/project/space/files/' + project.code)">
                        文件</a>
                    <li><a class="app" data-app="build"
                           @click="$router.push('/project/space/overview/' + project.code)">
                        概览</a>
                    </li>
                    <li class="actives"><a class="app" data-app="build"
                                           @click="$router.push('/project/space/features/' + project.code)">
                        版本管理</a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper-content :showHeader="false">
            <div class="content-wrapper">
                <div class="content-item features-content">
                    <div class="actions m-t">
                        <a-dropdown placement="bottomCenter" trigger="click">
                             <span class="m-r features-list-dropdown">
                                 <span class="m-r-xs">已完成</span>
                                 <a-icon type="down"/>
                            </span>
                            <a-menu class="field-right-menu" slot="overlay"
                                    :selectable="false">
                                <a-menu-item key="done">
                                    <div class="menu-item-content">
                                        <a-tag color="green">已完成</a-tag>
                                        <a-icon type="check" class="check muted"></a-icon>
                                    </div>
                                </a-menu-item>
                                <a-menu-item key="undone">
                                    <div class="menu-item-content">
                                        <a-tag color="grey">未完成</a-tag>
                                        <a-icon type="check" class="check muted"></a-icon>
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                        <a-button icon="plus">添加版本库</a-button>
                        <a-divider class="m-b-lg m-t-lg"></a-divider>
                    </div>
                    <template v-if="versionTotal">
                        <div :key="versionType" v-for="(versionItem,versionType) in versionList">
                            <p class="muted m-l-sm" v-if="versionType == 'published'">已发布版本</p>
                            <div class="version-content">
                                <template v-for="version in versionItem">
                                    <a-card class="version-item" :key="version.code" hoverable>
                                        <template slot="title">
                                            <span>{{version.name}}</span>
                                            <a-dropdown placement="bottomCenter" trigger="click"
                                                        v-show="versionType == 'normal'">
                                             <span class="version-status">
                                                 <a-icon type="schedule"/> <span class="m-l-xs">已完成</span>
                                            </span>
                                                <a-menu class="field-right-menu" slot="overlay"
                                                        :selectable="false">
                                                    <a-menu-item key="done">
                                                        <div class="menu-item-content">
                                                            <a-tag color="green">已完成</a-tag>
                                                            <a-icon type="check" class="check muted"></a-icon>
                                                        </div>
                                                    </a-menu-item>
                                                    <a-menu-item key="undone">
                                                        <div class="menu-item-content">
                                                            <a-tag color="grey">未完成</a-tag>
                                                            <a-icon type="check" class="check muted"></a-icon>
                                                        </div>
                                                    </a-menu-item>
                                                </a-menu>
                                            </a-dropdown>
                                        </template>
                                        <div class="muted" v-show="version.publish_time">
                                            <span v-if="versionType == 'normal'">预计发布时间：</span>
                                            <span v-else>发布时间：</span>
                                            {{version.publish_time}}
                                        </div>
                                        <a-tooltip v-show="versionType == 'normal'" placement="top"
                                                   :mouseEnterDelay="0.3"
                                                   :title="`当前进度：${version.schedule}%`">
                                            <a-progress :strokeWidth="5" :showInfo="false"
                                                        :percent="version.schedule"/>
                                        </a-tooltip>
                                    </a-card>
                                </template>
                                <a-card class="version-item version-create" hoverable v-show="versionType == 'normal'">
                                    <a class="muted">
                                       <div>
                                           <a-icon type="plus"></a-icon>
                                           <div>创建版本</div>
                                       </div>
                                    </a>
                                </a-card>
                            </div>
                        </div>
                    </template>
                    <div class="text-center" v-else>
                        <p class="muted">暂无可用版本</p>
                        <a-button type="primary">创建版本</a-button>
                    </div>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>

<script>
    import moment from "moment";
    import VeLine from 'v-charts/lib/line.common'
    import {read as getProject} from "../../../api/project";
    import {collect} from "../../../api/projectCollect";
    import {checkResponse} from "../../../assets/js/utils";
    import {getLogBySelfProject, dateTotalForProject} from "../../../api/task";
    import {relativelyTime} from "../../../assets/js/dateTime";
    import pagination from "../../../mixins/pagination";

    export default {
        name: "project-space-features",
        components: {
            VeLine
        },
        mixins: [pagination],
        data() {
            return {
                code: this.$route.params.code,
                loading: true,
                project: {},
                featuresList: [],
                versionTotal: 1,
                versionList: {
                    normal: [
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},],
                    published: [
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},
                        {code: 'v1.6', name: 'v1.6', schedule: '56', publish_time: '2019-06-25'},],
                },
                showLoadingMore: false,
                loadingMore: false,
            }
        },
        created() {
            this.getProject();
            // this.init();
        },
        methods: {
            init() {
                this.getProjectLog();
                this.overviewForProject();
            },
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                });
            },
            getProjectLog(reset = true) {
                let app = this;
                if (reset) {
                    app.pagination.page = 1;
                    app.pagination.pageSize = 20;
                    app.showLoadingMore = false;
                }
                this.requestData.projectCode = this.code;
                getLogBySelfProject(this.requestData).then(res => {
                    let list = [];
                    res.data.list.forEach((item) => {
                        list.push(item);
                        //只显示任务的完成动态
                        // if (item.action_type === 'task') {
                        //     if ((item.type === 'done' || item.type === 'redo')) {
                        //         list.push(item);
                        //     }
                        // } else {
                        //     list.push(item);
                        // }
                    });
                    if (reset) {
                        app.activities = [];
                    }
                    app.activities = app.activities.concat(list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.activities.length;
                    app.loading = false;
                    app.loadingMore = false;
                })
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.getProjectLog(false);
            },
            overviewForProject() {
                dateTotalForProject({projectCode: this.code}).then(res => {
                    let list = [];
                    res.data.forEach((v) => {
                        list.push({
                            '日期': moment(v.date).format('M月D日'),
                            '任务': v.total,
                        })
                    });
                    this.chartData.rows = list;
                })
            },
            collectProject() {
                const type = this.project.collected ? 'cancel' : 'collect';
                collect(this.project.code, type).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.project.collected = !this.project.collected;
                })
            },
            formatTime(time) {
                return relativelyTime(time);
            },
        }
    }
</script>

<style lang="less">
    /*@import "../../../assets/css/components/task";*/

    .project-space-features {
        .project-navigation {
            top: 65px;
            z-index: 4;
        }

        .wrapper-main {
            background: initial;

        }

        .layout-content {
            padding: 12px;
            width: 1100px;
            margin: 12px auto auto;
            background: initial;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .content-item {
                /*background: #fff;*/

                .title {
                    font-size: 16px;
                    padding: 6px 0 0 0;
                }
            }

            .content-wrapper {
                width: 100%;
            }

            .actions {

            }

            .version-content {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 28px;
                width: calc(100% + 12px);
                flex-shrink: 0;

                .ant-card {
                    width: 345px;
                    /*height: 102px;*/
                    margin: 0 6px 16px;
                    flex: 0 0 auto;
                    align-items: center;
                    /*display: inline-block;*/

                    .ant-card-head {
                        border-radius: 4px;
                        padding: 0 16px;
                        border-bottom: none;

                        .ant-card-head-title {
                            padding: 12px 0;
                            display: flex;
                            justify-content: space-between;
                            font-size: 14px;

                            .version-status {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                min-width: 82px;
                                height: 28px;
                                border-radius: 4px;
                                background: #f5f5f5;
                            }
                        }
                    }

                    .ant-card-body {
                        height: 100%;
                        padding: 0 16px 16px 16px;
                    }
                }

                .version-create {
                    .ant-card-body {
                        padding-top: 16px;
                    }

                    a {
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                }
            }
        }
    }

    .features-list-dropdown {
        cursor: pointer;
    }
</style>
