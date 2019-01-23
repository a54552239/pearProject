<template>
    <div class="project-statistics">
        <wrapper-content pageTitle="">
            <div class="data-content">
                <Row class="statistics-top">
                    <i-col class="top-item" span="6">
                        <Card class="text-default-second">
                            <span slot="extra">
                                <Tooltip content="指标说明">
                                    <Icon size="16" type="ios-information-outline"></Icon>
                                </Tooltip>
                            </span>
                            <div class="item-top muted-dark">
                                <span>项目总量</span>
                                <h1 class="text-default">{{ project_total }}</h1>
                            </div>
                            <div class="item-content">
                                <div class="chart-content">
                                    <chart :options="chart_data_project" ref="chart_data" auto-resize></chart>
                                </div>
                            </div>
                            <div class="item-footer">
                                <div class="trend-item">
                                    <span>月项目数 <span class="trend-text">{{ project_month_total }}</span></span>
                                </div>
                            </div>
                        </Card>
                    </i-col>
                    <i-col class="top-item" span="6">
                        <Card class="text-default-second">
                            <span slot="extra">
                                <Tooltip content="指标说明">
                                    <Icon size="16" type="ios-information-outline"></Icon>
                                </Tooltip>
                            </span>
                            <div class="item-top muted-dark">
                                <span>总任务数</span>
                                <h1 class="text-default">{{ task_total }}</h1>
                            </div>
                            <div class="item-content">
                                <div class="chart-content">
                                    <chart :options="chart_data" ref="chart_data" auto-resize></chart>
                                </div>
                            </div>
                            <div class="item-footer">
                                <div class="trend-item">
                                    <span>今日任务 <span class="trend-text">{{ task_today_total }}</span></span>
                                </div>
                            </div>
                        </Card>
                    </i-col>
                    <i-col class="top-item" span="6">
                        <Card class="text-default-second">
                            <span slot="extra">
                                <Tooltip content="指标说明">
                                    <Icon size="16" type="ios-information-outline"></Icon>
                                </Tooltip>
                            </span>
                            <div class="item-top muted-dark">
                                <span>逾期任务</span>
                                <h1 class="text-default">49</h1>
                            </div>
                            <div class="item-content">
                                <div class="content-fixed">
                                    <div class="trend-item">
                                        <span>周同比 <span class="trend-text">12%</span></span>
                                        <span class="text-danger"><Icon type="arrow-up-b"></Icon></span>
                                    </div>
                                    <div class="trend-item">
                                        <span>日环比 <span class="trend-text">8%</span></span>
                                        <span class="text-success"><Icon type="arrow-down-b"></Icon></span>
                                    </div>
                                </div>
                            </div>
                            <div class="item-footer">
                                <div class="trend-item">
                                    <span>逾期率 <span class="trend-text">7%</span></span>
                                </div>
                            </div>
                        </Card>
                    </i-col>
                    <i-col class="top-item" span="6">
                        <Card class="text-default-second">
                            <span slot="extra">
                                <Tooltip content="指标说明">
                                    <Icon size="16" type="ios-information-outline"></Icon>
                                </Tooltip>
                            </span>
                            <div class="item-top muted-dark">
                                <span>整体进度</span>
                                <h1 class="text-default">76%</h1>
                            </div>
                            <div class="item-content">
                                <div class="content-fixed">
                                    <Progress :percent="76" status="active" hide-info></Progress>
                                </div>
                            </div>
                            <div class="item-footer">
                                <div class="trend-item">
                                    <span>周同比 <span class="trend-text">27%</span></span>
                                    <span class="text-danger"><Icon type="arrow-up-b"></Icon></span>
                                </div>
                                <div class="trend-item">
                                    <span>日环比 <span class="trend-text">68%</span></span>
                                    <span class="text-success"><Icon type="arrow-down-b"></Icon></span>
                                </div>
                            </div>
                        </Card>
                    </i-col>
                </Row>
                <Row class="statistics-content">
                    <i-col class="content-item" span="24">
                        <Card class="text-default-second" dis-hover>
                            <Tabs>
                                <TabPane label="项目数" name="project">
                                    <Row>
                                        <i-col span="18">
                                            <chart :options="chart_data_project_num" ref="chart_data_project_num"
                                                   auto-resize></chart>
                                        </i-col>
                                        <i-col span="6">
                                            <div class="item-right">
                                                <div class="item-right-title">
                                                    <span class="trend-text">项目数量排名</span>
                                                </div>
                                                <div class="item-right-content text-default-second m-t">
                                                    <ul>
                                                        <li v-for="(user,index) in project_total_user.list"
                                                            :key="index">
                                                            <span>
                                                                <Badge class-name="sort-badge" :count="index + 1"
                                                                       v-if="index <= 2"></Badge>
                                                                <Badge class-name="sort-badge-second" :count="index + 1"
                                                                       v-else></Badge>
                                                            </span>
                                                            <span>{{ user.realname }}</span>
                                                            <span class="pull-right">{{ user.last }}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </i-col>
                                    </Row>
                                </TabPane>
                                <TabPane label="绩效值" name="task">
                                    <Row>
                                        <i-col span="18">
                                            <chart :options="chart_data_project_jixiao" ref="chart_data_project_jixiao"
                                                   auto-resize></chart>
                                        </i-col>
                                        <i-col span="6">
                                            <div class="item-right">
                                                <div class="item-right-title">
                                                    <span class="trend-text">项目绩效排名</span>
                                                </div>
                                                <div class="item-right-content text-default-second m-t">
                                                    <ul>
                                                        <li v-for="(user,index) in project_total_user.list"
                                                            :key="index">
                                                            <span>
                                                                <Badge class-name="sort-badge" :count="index + 1"
                                                                       v-if="index <= 2"></Badge>
                                                                <Badge class-name="sort-badge-second" :count="index + 1"
                                                                       v-else></Badge>
                                                            </span>
                                                            <span>{{ user.realname }}</span>
                                                            <span class="pull-right">{{ user.last }}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </i-col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </i-col>
                    <i-col class="content-item" span="12">
                        <Card class="text-default-second" dis-hover>
                            <div class="card-head">
                                <span class="card-head-title">最近项目</span>
                            </div>
                            <div class="card-body">
                                <Table border size="small" :columns="columns"
                                       :data="project_list.list" class="no-border-table"></Table>
                                <Page v-if="project_list_total > 0" :total="project_list_total" :current="page_num"
                                      @on-change="changeProjectListPage" size="small" class="table-page"></Page>
                            </div>
                        </Card>
                    </i-col>
                    <i-col class="content-item" span="12">
                        <Card class="text-default-second" style="height: 570px;" dis-hover>
                            <div class="card-head">
                                <span class="card-head-title">项目类型占比</span>
                            </div>
                            <div class="card-body project-type">
                                <chart :options="chart_data_project_type" ref="chart_data_project_type"
                                       auto-resize></chart>
                            </div>
                        </Card>
                    </i-col>
                </Row>
            </div>
        </wrapper-content>
        <task-detail :showModal="show_task_detail" :task_id="task_id" @on-modal-change="modalChange">
        </task-detail>
        <transition name="router-slid">
            <router-view></router-view>

        </transition>

    </div>
</template>
<style>
    .project-statistics .system-notice {
        padding-right: 20px;
        padding-bottom: 10px;
    }

    .project-statistics .layout-content {
        background: #f1f1f1;
        box-shadow: none;
        padding: 0;
    }

    .project-statistics .wrapper-content .data-content {
        margin-top: 0;
    }

    .project-statistics .ivu-card-body {
        padding-bottom: 10px;
    }

    .project-statistics .top-item {
        padding: 0 10px;
    }

    .project-statistics .top-item .item-top h1 {
        font-weight: 400;
        font-size: 30px;
    }

    .project-statistics .trend-item {
        display: inline-block;
        padding-right: 10px;
    }

    .project-statistics .trend-text {
        padding-left: 5px;
        color: #383838;
    }

    .project-statistics .item-content {
        position: relative;
        width: 100%;
        height: 45px;
    }

    .project-statistics .content-fixed {
        position: absolute;
        width: 100%;
        bottom: 0;
    }

    .project-statistics .content-item {
        padding: 20px 10px 0 10px;
    }

    .project-statistics .item-footer {
        border-top: 1px solid #e8e8e8;
        padding-top: 8px;
        margin-top: 10px;
    }

    .chart-content {
        position: absolute;
        bottom: -15px;
        width: 100%;
    }

    .project-statistics .statistics-top .echarts {
        width: 100% !important;
        height: 100px !important;
    }

    .project-statistics .statistics-content .echarts {
        width: 100% !important;
        height: 250px !important;
    }

    .project-statistics .statistics-content .content-item .ivu-card {
        padding-bottom: 20px;
    }

    .project-statistics .sort-badge {
        font-weight: 500;
        background-color: #314659;
    }

    .project-statistics .sort-badge-second {
        font-weight: 500;
        background-color: #f5f5f5;
        color: rgba(0, 0, 0, .65);
    }

    .project-statistics .item-right-content ul > li {
        padding: 5px 0;
    }

    .project-statistics .item-right-content ul > li span {
        padding-right: 10px;
    }

    .project-statistics .card-head {
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 15px;
    }

    .project-statistics .card-head .card-head-title {
        font-size: 14px;
    }

    .project-statistics .card-body {
        padding-top: 15px;
    }

    .project-statistics .card-body.project-type .echarts {
        height: 350px !important;
        margin-top: 40px;
    }
</style>
<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import WrapperContent from '../../../components/wrapper-content.vue'
    import TaskDetail from '../../../components/task-detail.vue'
    import {mapState} from 'vuex'
    import {getList,getTaskStatisticsByAll,getStatisticsByAll} from "@/api/project";
    import {getTeamUser} from "@/api/team";

    export default {
        components: {
            WrapperContent,
            TaskDetail,
            chart: ECharts
        },
        data() {
            return {
                data_loading: false,
                send_loading: false,
                page_size: 10,
                page_num: 1,
                task_total: 0,
                task_today_total: 0,
                project_total: 0,
                project_month_total: 0,
                project_total_user: [],
                keyword: '',
                current_user: {},
                show_task_detail: false,
                task_id: 0,
                task_index: 0,
                chart_data: {
                    title: {
                        show: false,
                        text: '团队任务统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        show: false,
                        data: ['待办', '需求', '新增', 'BUG', '其他']
                    },
                    grid: {
                        left: '-5%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        show: false,
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        show: false,
                        type: 'value',
                        minInterval: 1
                    },
                    series: []
                },
                chart_data_project: {
                    title: {
                        show: false,
                        text: '团队任务统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        show: false,
                        data: ['待办', '需求', '新增', 'BUG', '其他']
                    },
                    grid: {
                        left: '-5%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        show: false,
                        type: 'category',
                        // boundaryGap: false,
                    },
                    yAxis: {
                        show: false,
                        type: 'value',
                        minInterval: 1
                    },
                    series: []
                },
                chart_data_project_num: {
                    title: {
                        text: '项目数趋势',
                        textStyle: {
                            color: 'rgba(0,0,0,.85)',
                            fontWeight: 'normal',
                            fontSize: '14'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        show: false,
                        data: ['待办', '需求', '新增', 'BUG', '其他']
                    },
                    grid: {
                        left: '0%',
                        right: '6%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#A6A6A6'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 1,
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#A6A6A6'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                    },
                    series: []
                },
                chart_data_project_jixiao: {
                    title: {
                        text: '绩效值趋势',
                        textStyle: {
                            color: 'rgba(0,0,0,.85)',
                            fontWeight: 'normal',
                            fontSize: '14'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        show: false,
                        data: ['待办', '需求', '新增', 'BUG', '其他']
                    },
                    grid: {
                        left: '0%',
                        right: '6%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#A6A6A6'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 1,
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#A6A6A6'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                    },
                    series: []
                },
                chart_data_project_type: {
                    title: [{
                        text: '项目类型',
                        left: '49%',
                        top: '46%',
                        textAlign: 'center',
                        textBaseline: 'middle',
                        textStyle: {
                            color: '#A6A6A6',
                            fontWeight: 'normal',
                            fontSize: 14
                        }
                    }, {
                        text: 3334,
                        left: '49%',
                        top: '55%',
                        textAlign: 'center',
                        textBaseline: 'middle',
                        textStyle: {
                            color: 'rgba(0, 0, 0, 0.65)',
                            fontWeight: 'normal',
                            fontSize: 25
                        }
                    }],
                    grid: {
                        left: 25
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {d}%"
                    },
                    legend: {
                        orient: 'vertical',
                        top: 'center',
                        align: 'left',
                        icon: 'circle',
                        formatter: function (name) {
                            for (var i = 0; i < 3; i++) {
                                return name + '   |  ' + ((Math.random() * 100 + 1)).toFixed(2) + '%' + '    ' + parseInt(Math.random() * 1000 + 1);
                            }
                        },
                        x: 'right',
                        borderRadius: 25,
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            hoverAnimation: false,
                            radius: ['55%', '70%'],
                            selectedMode: 'single',
                            selectedOffset: 16, //选中是扇区偏移量
                            clockwise: true,
                            startAngle: 90,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 3,
                                    borderColor: '#ffffff',
                                },
                                emphasis: {
                                    borderWidth: 0,
                                    shadowBlur: 5,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                                }
                            },
                            data: [
                                {value: 335, name: '直接访问'},
                                {value: 310, name: '邮件营销'},
                                {value: 234, name: '联盟广告'},
                                {value: 135, name: '视频广告'},
                                {value: 1548, name: '搜索引擎'}
                            ]
                        }
                    ]
                },
                loading_project: true,
                project_list: [],
                project_list_total: 0,
                columns: [
                    {
                        title: '名称',
                        key: 'name',
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    title: params.row.name,
                                    class: 'table-row-title',
                                    to: '/project/task/' + params.row.project_id
                                }
                            }, params.row.name);
                        }
                    },
                    // {
                    //   title: '评级',
                    //   key: 'level_name',
                    //   width: 60,
                    // },
                    {
                        title: '截止',
                        key: 'end',
                        width: 120,
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        width: 100,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#19be6b'
                                }
                            }, params.row.schedule + '%')
                        }
                    },
                    {
                        title: '业务',
                        key: 'business_info',
                        width: 160,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.business_info.realname)
                        }
                    },
                ],
            }
        },
        computed: {
            ...
                mapState([
                    'socketAction',
                ]),
        },
        watch: {
            socketAction(data){
                if (data.type === 'action_synchronize') {
                    const push_data = JSON.parse(data);
                    console.log('overview_action_synchronize')
                }
            },
        },
        created: function () {
            let app = this;
            app.current_user = app.user_info;
            app.getTaskStatisticsByAll();
            app.getProjectStatisticsByAll(false);
            app.getProjectStatisticsByAll(true);
            app.getTeamUserList();
            app.getProjectList()
        },
        methods: {
            getProjectList() {
                let app = this;
                app.loading_project = true;
                getList(-1,this.page_size,this.page_num).then(res => {
                    app.loading_project = false;
                    app.project_list_total = res.data.count;
                    app.project_list = res.data

                });
            },
            changeProjectListPage(page) {
                this.page_num = page;
                this.getProjectList()
            },
            getTaskStatisticsByAll() {
                let app = this;
                getTaskStatisticsByAll().then(res => {
                    app.$store.dispatch('SET_PAGE_LOADING', false);
                    app.task_total = res.data.total;
                    app.task_today_total = res.data.today_total;
                    app.chart_data.series = res.data.data;
                    app.chart_data.xAxis.data = res.data.field;
                    app.chart_data.legend.data = res.data.task_type_list
                });
            },
            getProjectStatisticsByAll(jixiao) {
                let app = this;
                let chart_str = '';
                if (jixiao === false) {
                    chart_str = 'chart_data_project';
                }else{
                    chart_str = 'chart_data_project_jixiao';
                }
                getStatisticsByAll(jixiao).then(res=>{
                    if (jixiao === false) {
                        app.project_total = res.data.total;
                        app.project_month_total = res.data.month_total;
                        app.chart_data_project_num.series = res.data.data;
                        app.chart_data_project_num.xAxis.data = res.data.field;
                        app.chart_data_project_num.legend.data = res.data.task_type_list
                    }
                    app[chart_str].series = res.data.data;
                    app[chart_str].xAxis.data = res.data.field;
                    app[chart_str].legend.data = res.data.task_type_list
                });
            },
            getTeamUserList() {
                let app = this;
                getTeamUser().then(res => {
                    app.project_total_user = res.data
                });
            },
            modalChange(value) {
                this.show_task_detail = value
            },
        }
    };
</script>
