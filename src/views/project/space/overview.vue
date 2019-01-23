<template>
    <div class="project-space-overview">
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
                    <li class="actives"><a class="app" data-app="build"
                                           @click="$router.push('/project/space/overview/' + project.code)">
                        概览</a>
                    </li>
                    <li class=""><a class="app" data-app="build"
                                    @click="$router.push('/project/build/' + project_id)">
                        版本 * </a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper-content :showHeader="false">
            <div class="content-left">
                <div class="content-item log-list">
                    <div class="title">
                        项目动态
                    </div>
                    <div class="list-content">
                        <a-list>
                            <div v-if="showLoadingMore" slot="loadMore"
                                 :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                <a-spin v-if="loadingMore"/>
                                <a-button v-else @click="onLoadMore">查看更多动态</a-button>
                            </div>
                            <a-list-item :key="index" v-for="(item, index) in activities">
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" :src="item.member_avatar"/>
                                    <div slot="title">
                                        <span>{{ item.member_name }} </span>
                                        <span v-if="item.is_comment == 0"> <span v-html="item.remark "></span></span>&nbsp;
                                        <template v-if="item.is_comment == 1">发表了评论
                                            <p class="comment-text">{{ item.content }}</p>
                                        </template>
                                        <span class="right-item muted"> {{ formatTime(item.create_time) }}
                                        </span>
                                    </div>
                                    <div slot="description">
                                        <template v-if="item.action_type == 'task'">
                                            <router-link class="muted"
                                                         :to="`/project/space/task/${item.project_code}/detail/${item.source_code}`"
                                            >
                                                {{ item.sourceInfo.name }}
                                            </router-link>
                                        </template>
                                        <template v-if="item.action_type == 'project'">
                                            <span v-html="item.content"></span>
                                        </template>
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </div>
                </div>
            </div>
            <div class="content-right">
                <div class="content-item">
                    <div class="list-content">
                        <div class="default-list">
                            <a-list>
                                <a-list-item :key="index" v-for="(item, index) in [project]">
                                    <a-list-item-meta>
                                        <a-avatar slot="avatar" :src="item.cover"/>
                                        <div slot="title">
                                            <span>{{ item.name }}</span>
                                        </div>
                                        <div slot="description">
                                            {{item.owner_name}}
                                        </div>
                                    </a-list-item-meta>
                                </a-list-item>
                            </a-list>
                        </div>
                    </div>
                    <p class="muted">{{project.description}}</p>
                    <div>
                        <ve-line
                                :data="chartData"
                                :settings="chartSettings"
                                :extend="chartExtend"
                                :legend-visible="false"
                                height="200px"
                        ></ve-line>
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
        name: "project-space-overview",
        components: {
            VeLine
        },
        mixins: [pagination],
        data() {
            return {
                code: this.$route.params.code,
                loading: true,
                project: {},
                activities: [],
                showLoadingMore: false,
                loadingMore: false,
                chartData: {
                    columns: ['日期', '任务'],
                    rows: []
                },
                chartSettings: {
                    area: true,
                    itemStyle: {
                        color: '#1890ff'
                    },
                    areaStyle: {
                        color: '#e6f7ff'
                    }
                },
                chartExtend: {
                    grid: {
                        left: '-20',
                        right: '0',
                        top: '10',
                        bottom: '0'
                    },
                    xAxis: {
                        show: false,
                    },
                    yAxis: {
                        show: false,
                    },
                    tooltip: {
                        backgroundColor: '#fff',
                        textStyle: {
                            color: '#333'
                        },
                        borderWidth: 1,
                        borderColor: '#e8e8e8',
                    },
                    axisPointer: {
                        lineStyle: {
                            width: 0
                        }
                    }
                }
            }
        },
        created() {
            this.getProject();
            this.init();
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

    .project-space-overview {
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
                background: #fff;
                padding: 6px 18px 18px 18px;
                border-radius: 4px;

                .title {
                    font-size: 16px;
                    padding: 6px 0 0 0;
                }
            }

            .content-left {
                width: 730px;

                .log-list {
                    background: #fff;

                    .list-content {
                        padding-top: 12px;

                        .ant-list-item-meta-title {
                            position: relative;
                        }

                        .right-item {
                            float: right;
                            position: absolute;
                            right: 0;
                            top: 0;
                        }
                    }
                }
            }

            .content-right {
                width: 325px;
            }
        }
    }
</style>
