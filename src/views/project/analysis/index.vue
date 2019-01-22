<template>
    <div class="analysis-index">
        <div class="page-wrapper">
            <a-row :gutter="24">
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="项目总数" :total="12 | NumberFormat">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div class="chart-wrapper">
                            <ve-histogram
                                    :data="projectData.chartData"
                                    :settings="projectData.chartSettings"
                                    :extend="projectData.chartExtend"
                                    :legend-visible="false"
                                    height="55px"></ve-histogram>
                        </div>
                        <template slot="footer">本月立项 <span>3</span></template>
                    </chart-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="任务总数" :total="135 | NumberFormat">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div>
                            数据图
                        </div>
                        <template slot="footer">今日任务<span> {{ '8' | NumberFormat }}</span></template>
                    </chart-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="逾期任务" total="6">
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
                        <template slot="footer">逾期率 <span>26%</span></template>
                    </chart-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                    <chart-card :loading="loading" title="整体进度" total="78%">
                        <a-tooltip title="指标说明" slot="action">
                            <a-icon type="info-circle-o"/>
                        </a-tooltip>
                        <div>
                            <mini-progress color="#ffd401" :target="80" :percentage="78" height="8px"/>
                        </div>
                        <template slot="footer">
                            <trend flag="down" style="margin-right: 16px;">
                                <span slot="term">同周比</span>
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
                        <a-tab-pane loading="true" tab="销售额" key="1">
                            <a-row>
                                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                    销售额排行图表
                                </a-col>
                                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                                    <rank-list title="门店销售排行榜" :list="rankList"/>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane tab="访问量" key="2">
                            <a-row>
                                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                    销售额趋势图表
                                </a-col>
                                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                                    <rank-list title="门店销售排行榜" :list="rankList"/>
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
                        <p>项目名称</p>
                        <p>项目名称</p>
                        <p>项目名称</p>
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
    import VeHistogram from 'v-charts/lib/histogram.common'
    import ChartCard from '@/components/chart/ChartCard'
    import Trend from '@/components/Trend'
    import MiniProgress from '@/components/chart/MiniProgress'
    import RankList from '@/components/chart/RankList'
    import pagination from "@/mixins/pagination";

    const rankList = [];
    for (let i = 0; i < 7; i++) {
        rankList.push({
            name: '白鹭岛 ' + (i + 1) + ' 号店',
            total: 1234.56 - i * 100
        })
    }
    export default {
        components: {
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
                projectData: {
                    chartData: {
                        columns: ['日期', '访问用户'],
                        rows: [
                            {'日期': '1/1', '访问用户': 1393},
                            {'日期': '1/2', '访问用户': 3530},
                            {'日期': '1/3', '访问用户': 2923},
                            {'日期': '1/4', '访问用户': 1723},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/5', '访问用户': 3792},
                            {'日期': '1/6', '访问用户': 4593}
                        ]
                    },
                    chartSettings: {
                        itemStyle: {
                            color: '#1890ff'
                        },
                    },
                    chartExtend: {
                        grid: {
                            left: '-35',
                            right: '0',
                            top: '10',
                            bottom: '-20'
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
                    }
                }
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
                if (reset) {
                    this.pagination.page = 1;
                    this.pagination.pageSize = 9;
                }
            },
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
                bottom: -5px;
                width: 100%;
            }
        }
    }
</style>
