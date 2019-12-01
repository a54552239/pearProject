<template>
    <div class="analysis-index">
        <div class="page-wrapper">
            <a-row :gutter="24">
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="项目总数" :total="projectData.count | NumberFormat">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div class="chart-wrapper">
                            <ve-histogram
                                    :data="projectData.chartData"
                                    :settings="projectData.chartSettings"
                                    :extend="chartExtend"
                                    :legend-visible="false"
                                    height="55px"></ve-histogram>
                        </div>
                        <template slot="footer">本月立项 <span>3</span></template>
                    </chart-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="任务总数" :total="taskData.count | NumberFormat">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div>
                            <div class="chart-wrapper">
                                <ve-line
                                        :data="taskData.chartData"
                                        :settings="taskData.chartSettings"
                                        :extend="chartExtend"
                                        :legend-visible="false"
                                        height="55px"></ve-line>
                            </div>
                        </div>
                        <template slot="footer">今日任务<span> {{ '8' | NumberFormat }}</span></template>
                    </chart-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="逾期任务" :total="taskData.taskOverdueCount | NumberFormat">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div>
                            <trend flag="up" style="margin-right: 16px;">
                                <span slot="term">周同比</span>
                                12%
                            </trend>
                            <trend flag="down">
                                <span slot="term">日同比</span>
                                11%
                            </trend>
                        </div>
                        <template slot="footer">逾期率 <span>{{taskData.taskOverduePercent}}%</span></template>
                    </chart-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="整体进度" :total="`${projectData.projectSchedule}%`">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div>
                            <mini-progress color="#ffd401" :target="80" :percentage="projectData.projectSchedule" height="8px"/>
                        </div>
                        <template slot="footer">
                            <trend flag="down" style="margin-right: 16px;">
                                <span slot="term">周同比</span>
                                12%
                            </trend>
                            <trend flag="up">
                                <span slot="term">日环比</span>
                                80%
                            </trend>
                        </template>
                    </chart-card>
                </a-col>
            </a-row>
            <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
                <div class="salesCard">
                    <a-tabs default-active-key="1" size="large"
                            :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                        <div class="extra-wrapper" slot="tabBarExtraContent">
                            <div class="extra-item">
                                <a>今日</a>
                                <a>本周</a>
                                <a>本月</a>
                                <a>本年</a>
                            </div>
                            <a-range-picker :style="{width: '256px'}"/>
                        </div>
                        <a-tab-pane forceRender tab="项目数" key="1">
                            <a-row>
                                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                    <div class="chart-wrappers-single">
                                        <ve-histogram
                                                :data="projectTotalData.chartData"
                                                :settings="projectTotalData.chartSettings"
                                                :extend="projectTotalData.chartExtend"
                                                :legend-visible="false"
                                                height="300px"></ve-histogram>
                                    </div>
                                </a-col>
                                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                                    <rank-list title="项目数排行榜" :list="rankList"/>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane forceRender tab="任务数" key="2">
                            <a-row>
                                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                    <div class="chart-wrappers-single">
                                        <ve-histogram
                                                :data="projectTotalData.chartData"
                                                :settings="projectTotalData.chartSettings"
                                                :extend="projectTotalData.chartExtend"
                                                :legend-visible="false"
                                                height="300px"></ve-histogram>
                                    </div>
                                </a-col>
                                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                                    <rank-list title="任务数排行榜" :list="rankList"/>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-card>
            <a-row :gutter="12">
                <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-card :loading="loading" :bordered="false" title="我的项目" :style="{ marginTop: '24px' }">
                        <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
                            <a class="ant-dropdown-link" href="#">
                                <a-icon type="ellipsis"/>
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <a href="javascript:;">操作一</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;">操作二</a>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                        <p v-for="project in projectList" :key="project.id">{{project.name}}</p>
                        <a-pagination v-model="pagination.page" :total="projectTotal"  size="small" @change="pageChange"/>
                    </a-card>
                </a-col>
                <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-card :loading="loading" :bordered="false" title="任务优先级分布" :style="{ marginTop: '24px' }">
                        <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
                            <a class="ant-dropdown-link" href="#">
                                <a-icon type="ellipsis"/>
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <a href="javascript:;">操作一</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;">操作二</a>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                        <p>card content</p>
                        <p>card content</p>
                        <p>card content</p>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import moment from "moment";
    import VeLine from 'v-charts/lib/line.common'
    import VeHistogram from 'v-charts/lib/histogram.common'
    import ChartCard from '@/components/chart/ChartCard'
    import Trend from '@/components/Trend'
    import MiniProgress from '@/components/chart/MiniProgress'
    import RankList from '@/components/chart/RankList'
    import pagination from "@/mixins/pagination";
    import {analysis, selfList as getProjectList} from "../../../api/project";

    const rankList = [];
    for (let i = 0; i < 7; i++) {
        rankList.push({
            name: 'XX公司 ' + (i + 1) + ' 号员工',
            total: 1234.56 - i * 100
        })
    }
    const taskList = [];
    for (let i = 1; i < 20; i++) {
        taskList.push({
            "日期": `1月${i}日`,
            "任务": (Math.random() * 10 + 1).toFixed(0)
        })
    }
    const projectList = [];
    for (let i = 1; i < 13; i++) {
        projectList.push({
            "日期": `${i}月`,
            "数量": (Math.random() * 10 + 1).toFixed(0)
        })
    }
    export default {
        components: {
            VeLine,
            VeHistogram,
            ChartCard,
            MiniProgress,
            Trend,
            RankList
        },
        mixins: [pagination],
        data() {
            return {
                loading: false,
                rankList,
                chartExtend: {
                    grid: {
                        left: '-25',
                        right: '0',
                        top: '10',
                        bottom: '-15'
                    },
                    series: {
                        barWidth: 15,
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
                projectData: {
                    count: 0,
                    projectSchedule: 0,
                    chartData: {
                        columns: ['日期', '数量'],
                        rows: projectList
                    },
                    chartSettings: {
                        itemStyle: {
                            color: '#1890ff'
                        },
                    },
                },
                taskData: {
                    count: 0,
                    taskOverdueCount: 0,
                    taskOverduePercent: 0,
                    chartData: {
                        columns: ['日期', '任务'],
                        rows: taskList
                    },
                    chartSettings: {
                        area: true,
                        itemStyle: {
                            color: '#b68eec'
                        },
                        areaStyle: {
                            color: '#b68eec'
                        }
                    },
                },
                projectTotalData: {
                    chartData: {
                        columns: ['日期', '数量'],
                        rows: projectList
                    },
                    chartSettings: {
                        itemStyle: {
                            color: '#1890ff'
                        },
                    },
                    chartExtend: {
                        grid: {
                            left: '30',
                            right: '0',
                            top: '15',
                            bottom: '0'
                        },
                        series: {
                            barWidth: 45,
                        },
                    }
                },
                projectList: [],
                projectTotal: 0,
                projectLoading: false,
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            }),
        },
        created() {
            this.init();
        },
        methods: {
            init(reset = true) {
                analysis({type: 1}).then(res => {
                    this.projectData.count = res.data.projectCount;
                    this.projectData.projectSchedule = res.data.projectSchedule;
                    this.projectData.chartData.rows = res.data.projectList;
                    this.projectTotalData.chartData.rows = res.data.projectList;

                    this.taskData.count = res.data.taskCount;
                    this.taskData.taskOverdueCount = res.data.taskOverdueCount;
                    this.taskData.taskOverduePercent = res.data.taskOverduePercent;
                    this.taskData.chartData.rows = res.data.taskList;
                });
                if (reset) {
                    this.pagination.page = 1;
                    this.pagination.pageSize = 10;
                }
                this.getProjectList(true);
            },
            getProjectList(loading) {
                if (loading) {
                    this.projectLoading = true;
                }
                getProjectList(this.requestData).then(res => {
                    this.projectList = res.data.list;
                    this.projectTotal = res.data.total;
                    this.projectLoading = false;
                });
            },
            pageChange(page, pageSize) {
                this.pagination.page = page;
                this.getProjectList(true);
            }
        }
    }
</script>
<style lang="less">
    .analysis-index {
        .page-wrapper {
            margin: 24px;

            .extra-wrapper {
                line-height: 55px;
                padding-right: 24px;

                .extra-item {
                    display: inline-block;
                    margin-right: 24px;

                    a {
                        margin-left: 24px;
                    }
                }
            }

            .chart-wrapper {
                position: absolute;
                bottom: -10px;
                width: 100%;
            }

            .chart-wrappers-single {
                /*width: 500px;*/

                div {
                    width: auto !important;
                }
            }
        }
    }
</style>
