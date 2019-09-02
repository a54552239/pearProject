<template>
    <div class="project-space-overview" :class="project.task_board_theme">
        <div class="project-navigation">
            <div class="project-nav-header">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <router-link to="/home">
                            <a-icon type="home"/>
                            首页
                        </router-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>
                        <project-select class="nav-title" style="display: inline-block" :code="code"></project-select>
                        <span class="actions">
                             <a-tooltip :mouseEnterDelay="0.3" :title="project.collected ? '取消收藏' : '加入收藏'"
                                        @click="collectProject">
                            <a-icon type="star" theme="filled" style="color: grey;" v-show="!project.collected"/>
                            <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="project.collected"/>
                        </a-tooltip>
                        </span>
                        <span class="label label-normal" v-if="project.private === 0"><a-icon type="global"/> 公开</span>
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
                                    @click="$router.push('/project/space/features/' + project.code)">
                        版本</a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper-content :showHeader="false">
            <div class="overview-item m-b">
                <div class="content-item">
                    <h3 class="m-sm m-b text-center">任务燃尽图*</h3>
                    <ve-line
                            :data="burnoutMap.chartData"
                            :settings="burnoutMap.chartSettings"
                            :extend="burnoutMap.chartExtend"
                            :series="burnoutMap.series"
                            :legend-visible="false"
                            height="200px"
                    ></ve-line>
                </div>
            </div>
            <div class="overview-item">
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
                                            <span v-if="item.is_comment == 0"> <span
                                                    v-html="item.remark "></span></span>&nbsp;
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
                                                {{item.owner_name}} 创建于 {{moment(item.create_time).format('YYYY年MM月DD日')}}
                                            </div>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </a-list>
                            </div>
                        </div>
                        <p class="">{{project.description}}</p>
                        <div class="project-date m-b-lg m-t-lg">
                            <div class="muted m-b-xs">
                                <a-tag color="green">项目周期</a-tag>
                            </div>
                            <a-range-picker
                                    v-model="projectDate"
                                    format="YYYY年MM月DD日"
                                    @change="ondateChange"/>
                        </div>
                        <div class="project-stats m-b-lg">
                            <div class="muted m-b-xs">
                                <a-tag color="green">项目统计</a-tag>
                            </div>
                            <div class="stats-content">
                                <div class="stats-item" :key="index" v-for="(stats, index) in projectStats">
                                    <div class="stats-title muted">{{stats.title}}</div>
                                    <div class="stats-number">{{stats.number}}</div>
                                    <a-tooltip placement="right" :mouseEnterDelay="0.3"
                                               :title="`${stats.schedule}%`">
                                        <a-progress strokeColor="#1890ff" :strokeWidth="3" :showInfo="false" :percent="stats.schedule" />
                                    </a-tooltip>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="muted">
                                <a-tag color="green">新增任务趋势</a-tag>
                            </div>
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
            </div>
        </wrapper-content>
    </div>
</template>

<script>
    import moment from "moment";
    import VeLine from 'v-charts/lib/line.common'
    import {_projectStats, doData, read as getProject} from "../../../api/project";
    import {collect} from "../../../api/projectCollect";
    import {checkResponse} from "../../../assets/js/utils";
    import {getLogBySelfProject, dateTotalForProject} from "../../../api/task";
    import {relativelyTime} from "../../../assets/js/dateTime";
    import pagination from "../../../mixins/pagination";
    import projectSelect from '@/components/project/projectSelect'


    export default {
        name: "project-space-overview",
        components: {
            VeLine,
            projectSelect,
        },
        mixins: [pagination],
        data() {
            return {
                code: this.$route.params.code,
                loading: true,
                project: {task_board_theme: 'simple'},
                projectDate: [],
                activities: [],
                showLoadingMore: false,
                loadingMore: false,
                burnoutMap: {
                    chartData: {
                        columns: ['日期', '剩余任务', '基线'],
                        rows: [
                            {'日期': '07-09'},
                            {'日期': '07-10'},
                            {'日期': '07-11'},
                            {'日期': '07-12'},
                            {'日期': '07-13'},
                            {'日期': '07-14'}
                        ]
                    },
                    series: [
                        {
                            type: 'line',
                            name: '剩余任务',
                            smooth: false,
                            color: '#1890ff',
                            data: [10, 9, 1, 7, 2, 3],
                        },
                        {
                            type: 'line',
                            name: '基线',
                            color: '#52C41A',
                            smooth: false,
                            lineStyle: {
                                type: 'dashed'
                            },
                            data: [10, 8, 6, 4, 2, 0]
                        },
                    ],
                    chartSettings: {},
                    chartExtend: {
                        grid: {
                            left: '5',
                            right: '20',
                            top: '10',
                            bottom: '0'
                        },
                        xAxis: {
                            show: true,
                            // boundaryGap: false,
                            splitLine: {
                                show: false
                            }
                        },
                        yAxis: {
                            show: true,
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed',
                                    color: ['#e4e4e4']
                                }
                            }
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
                },
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
                },

                projectStats: [
                    {
                        title: '未完成',
                        key: 'unDone',
                        number: 0,
                        schedule: 0
                    },
                    {
                        title: '已完成',
                        key: 'done',
                        number: 0,
                        schedule: 0
                    },
                    {
                        title: '已逾期',
                        key: 'overdue',
                        number: 0,
                        schedule: 0
                    },
                    {
                        title: '待认领',
                        key: 'toBeAssign',
                        number: 0,
                        schedule: 0
                    },
                    {
                        title: '今日到期',
                        key: 'expireToday',
                        number: 0,
                        schedule: 0
                    },
                    {
                        title: '逾期完成',
                        key: 'doneOverdue',
                        number: 0,
                        schedule: 0
                    },
                ]
            }
        },
        created() {
            this.getProject();
            this.init();
        },
        methods: {
            moment,
            init() {
                this.getProjectLog();
                this.overviewForProject();
                this.getProjectStats();
            },
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                    if (this.project.begin_time) {
                        this.projectDate = [moment(this.project.begin_time), moment(this.project.end_time)];
                    }
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
            getProjectStats() {
                _projectStats({
                    projectCode: this.code
                }).then(res=>{
                    const taskStats = res.data;
                    const total = taskStats['total'];
                    this.projectStats.forEach((v,k)=>{
                        v.number = taskStats[v.key];
                        if (total) {
                            v.schedule = parseInt(v.number / total * 100);
                        }
                    })
                });
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
            ondateChange(e) {
                console.log(e);
                const project = this.project;
                doData({
                    projectCode: project.code,
                    begin_time: e.length ? e[0].format('YYYY-MM-DD') : '',
                    end_time: e.length ? e[1].format('YYYY-MM-DD') : '',
                });
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

            .overview-item {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .content-item {
                background: #fff;
                padding: 6px 18px 18px 18px;
                border-radius: 4px;
                width: 100%;

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

                .project-date {
                    .ant-calendar-picker {
                        border: none;

                        &:focus {
                            border: none;
                        }

                    }

                    .ant-calendar-picker-input {
                        border: none;
                    }
                }

                .project-stats {
                    .stats-content {
                        display: flex;
                        flex-wrap: wrap;

                        .stats-item {
                            width: 80px;
                            /*height: 100px;*/
                            margin-right: 16px;
                            margin-bottom: 16px;
                            padding: 12px;

                            .stats-title {
                            }

                            .stats-number {
                                /*font-weight: bold;*/
                                font-size: 32px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
