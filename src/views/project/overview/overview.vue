<template>
    <div class="project-overview">
        <wrapper-content pageTitle="">
            <div slot="page-header" class="page-header">
                <Row>
                    <i-col span="16">
                        <div class="header-title">
                            <span>『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》</span> <a class="muted" @click="getYiYan">
                            <Icon type="md-refresh" />
                        </a>
                        </div>
                        <div class="header-main">
                            <img class="avatar img-circle" :src="user_info.avatar" alt="">
                            <div class="content">
                                <div class="content-title">{{hello_time}}{{ user_info.realname }}，祝你开心每一天！</div>
                                <div class="">{{ user_info.level_name }} | {{ user_info.team_path }}－{{
                                    user_info.p_eng_name }}
                                </div>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="8">
                        <div class="page-header-extra">
                            <div>
                                <p>任务数</p>
                                <p>{{task_list.count}}</p>
                            </div>
                            <div>
                                <p>团队内排名</p>
                                <p>2<span> / 6</span></p>
                            </div>
                            <div>
                                <p>项目总数</p>
                                <p>{{project_list.count}}</p>
                            </div>
                        </div>
                    </i-col>
                </Row>
            </div>
            <div class="data-content">
                <Row class="project-list">
                    <i-col span="12" class="project-item">
                        <h3>开发中的项目 <span v-if="project_list.count > 0"> · {{ project_list.count }}</span></h3>
                        <h3 class="all-list" v-if="project_list.count > page_size">
                            <router-link to="/project/my_project/list">全部项目</router-link>
                        </h3>
                        <vue-scroll>
                            <Table :loading="loading_project" border size="small" :columns="columns"
                               :data="project_list.list" class="no-border-table"></Table>
                        </vue-scroll>
                    </i-col>
                    <i-col span="12" class="project-item">
                        <h3>未完成的任务 <span v-if="task_list.count > 0"> · {{ task_list.count }}</span></h3>
                        <vue-scroll>
                            <Table :loading="loading_task" border no-data-text="恭喜你，所有的任务都完成了"
                                   :columns="task_columns" size="small" :data="task_list.list"
                                   class="no-border-table"></Table>
                        </vue-scroll>
                    </i-col>
                </Row>
                <Row class="project-list">
                    <i-col span="12" class="project-item">
                        <h3>未安排的项目 <span v-if="no_scheduled_project_list.count > 0"> · {{ no_scheduled_project_list.count }}</span>
                        </h3>
                        <h3 class="all-list" v-if="no_scheduled_project_list.count > page_size">
                            <router-link to="/project/my_project/list">全部项目</router-link>
                        </h3>
                        <vue-scroll>
                            <Table :loading="loading_no_scheduled_project" border size="small"
                                   :columns="no_scheduled_columns" :data="no_scheduled_project_list.list"
                                   class="no-border-table"></Table>
                        </vue-scroll>
                    </i-col>
                    <i-col span="12" class="project-item">
                        <h3>测试中的项目 <span v-if="test_project_list.count > 0"> · {{ test_project_list.count }}</span></h3>
                        <h3 class="all-list" v-if="test_project_list.count > page_size">
                            <router-link to="/project/my_project/list">全部项目</router-link>
                        </h3>
                        <vue-scroll>
                            <Table :loading="loading_test_project" border :columns="test_columns" size="small"
                               :data="test_project_list.list" class="no-border-table"></Table>
                        </vue-scroll>
                    </i-col>
                </Row>
                <Row class="team-dynamic">
                    <i-col class="project-item" span="12">
                        <h3>动态</h3>
                        <div class="m-t-sm" style="height: 945px;">
                            <vue-scroll>
                                <div v-for="(item,index) in team_task_log.list" class="vs-list-item">
                                <div class="vs-list-item-meta">
                                    <div class="vs-list-item-meta-avatar">
                                        <img class="avatar img-circle hinted m-t-xs" :src="item.avatar">

                                    </div>
                                    <div class="vs-list-item-meta-content">
                                        <h4 class="vs-list-item-meta-title">
                                            <div class="title">
                                                <span>
                                                    {{ item.realname }} {{ item.content }}
                                                </span>
                                                <a @click="showTaskDetail(item.task_id, index)">
                                                    {{ item.task_name }}
                                                </a>
                                                <div class="extra"></div>
                                            </div>
                                        </h4>
                                        <div class="vs-list-item-meta-description">
                                            <div>
                                                <div class="description"></div>
                                                <div class="datetime">
                                                    <span>{{ item.project_name }}</span> － <span
                                                        :title="showTaskLogTime(item.create_time,false)">{{ showTaskLogTime(item.create_time, true) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </vue-scroll>
                        </div>
                    </i-col>
                    <i-col class="project-item task-statistics" span="24">
                        <!--<h3>任务统计</h3>-->
                        <Tabs value="week">
                            <TabPane label="本周" name="week">
                                <div class="m-t-sm" style="position: relative">
                                    <chart :options="chart_data" ref="chart_data" auto-resize></chart>
                                </div>
                            </TabPane>
                            <TabPane label="本月" name="month">
                                <div class="m-t-sm">
                                    <chart :options="chart_data_month" ref="chart_data_month" auto-resize></chart>
                                </div>
                            </TabPane>
                        </Tabs>
                    </i-col>
                    <div class="team-dynamic">
                            <i-col class="project-item m-t" span="24" style="height: 510px;">
                            <h3>成员
                                <span class="pull-right m-l"><router-link
                                        :to="'/team/user/list/' + user_info.team_id">我的团队</router-link></span>
                                <span class="pull-right"><router-link
                                        :to="'/project/taskoverview/'+ user_info.team_id">任务概况</router-link></span>
                            </h3>
                                    <div class="m-t-sm" style="height: 95%;">
                                        <vue-scroll>
                                            <div v-for="(item,index) in team_user.list" class="vs-list-item">
                                                <div class="vs-list-item-meta">
                                                    <div class="vs-list-item-meta-avatar">
                                                        <img class="avatar img-circle hinted m-t-xs" :src="item.avatar">

                                                    </div>
                                                    <div class="vs-list-item-meta-content">
                                                        <h4 class="vs-list-item-meta-title">
                                                            <router-link class="title" :to="'/team/user/detail/' + item.user_id">
                                                            <span>
                                                                {{ item.realname }} {{ item.account }}
                                                            </span>
                                                                <div class="extra"></div>
                                                            </router-link>
                                                        </h4>
                                                        <div class="vs-list-item-meta-description">
                                                            <div>
                                                                <div class="description">{{ item.level_name }}</div>
                                                                <div class="datetime"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </vue-scroll>
                                    </div>
                        </i-col>
                    </div>
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
    .project-overview .system-notice {
        padding-right: 20px;
        padding-bottom: 10px;
    }

    .project-overview .layout-content {
        background: #f1f1f1;
        box-shadow: none;
        padding: 0;
    }

    .project-overview .wrapper-content .data-content {
        margin-top: 0;
    }

    .project-overview .project-list {
        margin-bottom: 20px;
    }

    .project-overview .project-item {
        box-shadow: 0 1px 3px #ced3d9;
        padding: 15px 15px 25px 15px;
        background: #fff;
        margin-right: 20px;
        height: 368px;
        width: calc(100% / 2 - 20px);
    }

    .project-overview .project-item > h3 {
        font-weight: normal;
        font-size: 14px;
        display: inline-block;
    }

    .project-overview .project-item .ivu-table-body {
        overflow-x: hidden;
    }

    .project-overview .project-item .all-list {
        font-size: 12px;
        float: right;
        font-weight: normal;
    }

    .page-header {
        padding: 15px 30px;
        background: #FFF;
    }

    .project-overview .table-row-title {
        white-space: nowrap;
    }

    .page-header .header-title {
        font-size: 14px;
        line-height: 1.5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 16px;
    }

    .page-header .header-main {
        display: flex;
    }

    .page-header .header-main .avatar {
        width: 72px;
        height: 72px;
    }

    .page-header .header-main .content {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        line-height: 36px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
    }

    .page-header .header-main .content .content-title {
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
    }

    .page-header .page-header-extra {
        margin-top: 36px;
        zoom: 1;
        float: right;
    }

    .page-header .page-header-extra > div {
        padding: 0 32px;
        position: relative;
        float: left;
    }

    .page-header .page-header-extra > div > p:first-child {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 4px;
    }

    .page-header .page-header-extra > div:last-child {
        padding-right: 0;
    }

    .page-header .page-header-extra > div > p {
        color: rgba(0, 0, 0, 0.85);
        font-size: 30px;
        line-height: 38px;
        margin: 0;
    }

    .page-header .page-header-extra:before, .page-header-extra:after {
        content: " ";
        display: table;
    }

    .page-header .page-header-extra > div:after {
        background-color: #e8e8e8;
        position: absolute;
        top: 8px;
        right: 0;
        width: 1px;
        height: 40px;
        content: '';
    }

    .page-header .page-header-extra > div:last-child:after {
        width: 0;
    }

    .page-header .page-header-extra:after {
        clear: both;
        visibility: hidden;
        font-size: 0;
        height: 0;
    }

    .page-header .page-header-extra > div > p > span {
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
    }

    .team-dynamic .project-item {
        height: auto;
    }

    .team-dynamic .project-item h3 {
        width: 100%;
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 10px;
    }

    .team-dynamic .vs-list-item {
        padding: 10px 0 10px 10px;
        margin-right: 15px;
        cursor: default;
    }

    .project-overview .task-statistics .echarts {
        width: 750px !important;
    }

    .project-overview .task-statistics .ivu-tabs-ink-bar.ivu-tabs-ink-bar-animated {
        min-width: 60px !important;
    }

    .project-overview .echarts {
        width: 100% !important;
    }
</style>
<script type="es6">
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import WrapperContent from '../../../components/wrapper-content.vue'
    import TaskDetail from '../../../components/task-detail.vue'
    import {mapState} from 'vuex'
    import {showHelloTime} from "../../../assets/js/date_time";
    import {showBeforeTime} from "../../../assets/js/time_format";
    import {getListForUser, getTaskForUser, getTeamTaskLog, getTaskStatisticsByTeam} from "@/api/project";
    import {getTeamUser} from "@/api/team";
    import {getYiYan} from "@/api/other";

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
                keyword: '',
                loading_project: false,
                loading_no_scheduled_project: false,
                loading_test_project: false,
                loading_task: false,
                columns: [
                    {
                        title: '名称',
                        key: 'name',
                        // minWidth: 100,
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
                        // width: 120,
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        // width: 100,
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
                        // width: 160,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.business_info.realname)
                        }
                    },
                ],
                project_list: [],
                test_columns: [
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
                        // width: 120,
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        // width: 100,
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
                        // width: 160,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.business_info.realname)
                        }
                    },
                ],
                test_project_list: [],
                no_scheduled_columns: [
                    {
                        title: '名称',
                        key: 'name',
                        // minWidth: 100,
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
                        // width: 120,
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        // width: 100,
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
                        // width: 160,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.business_info.realname)
                        }
                    },
                ],
                no_scheduled_project_list: [],
                task_columns: [
                    {
                        title: '内容',
                        key: 'name',
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    title: params.row.name,
                                    class: 'table-row-title',
                                    to: '/project/task/' + params.row.project + '?id=' + params.row.id
                                }
                            }, params.row.name);
                        }
                    },
                    {
                        title: '状态',
                        key: 'task_execute_name',
                        width: 100,
                        render: (h, params) => {
                            let state_class = 'table-state ' + params.row.task_execute.color
                            // switch (params.row.task_execute_name) {
                            //   case '进行中':
                            //     state_class += ' success'
                            //     break;
                            //   default :
                            //     state_class += ' default'
                            // }
                            return h('span', {
                                class: state_class
                            }, params.row.task_execute_name)
                        }
                    },
                    {
                        title: '项目',
                        key: 'name',
                        width: 100,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    class: 'table-row-title',
                                    title: params.row.title,
                                }
                            }, params.row.project_info.name);
                        }
                    },
                ],
                task_list: [],
                team_task_log: {},
                team_user: {},
                yiyan: {},
                show_task_detail: false,
                task_id: 0,
                task_index: 0,
                chart_data: {
                    title: {
                        text: '团队任务统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['待办', '需求', '新增', 'BUG', '其他']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 1
                    },
                    series: []
                },
                chart_data_month: {
                    title: {
                        text: '团队任务统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['待办', '需求', '新增', 'BUG', '其他']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 1
                    },
                    series: []
                }
            }
        },
        watch: {
            user_keyword: function () {
                this.user_search()
            },
            keyword: function () {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.list_reload) {
                    this.getProjectList(0);
                    this.getProjectList(2);
                    this.getProjectList(5);
                    this.getTaskList()
                }
            }
        },
        computed: {
            ...mapState(['list_reload','user_info', 'notify_no_read_list']),
            hello_time() {
                return showHelloTime()
            }
        },
        created: function () {
            let app = this;
            app.$store.dispatch('SET_PAGE_LOADING', true);
            this.getProjectList(0);
            this.getProjectList(2);
            this.getProjectList(5);
            this.getTaskList();
            this.getTeamTaskLog();
            this.getTeamUserList();
            this.getYiYan();
            this.getTaskStatisticsByTeam('week');
            this.getTaskStatisticsByTeam('month');
            setInterval(function () {
                app.getYiYan()
            }, 1000 * 60 * 30)
        },
        methods: {
            getProjectList(state) {
                let app = this;
                let loading_key = '';
                let list_key = '';
                switch (state) {
                    case 2:
                        loading_key = 'loading_project';
                        list_key = 'project_list';
                        break;
                    case 5:
                        loading_key = 'loading_test_project';
                        list_key = 'test_project_list';
                        break;
                    default:
                        loading_key = 'loading_no_scheduled_project';
                        list_key = 'no_scheduled_project_list';
                }
                app[loading_key] = true;
                getListForUser(state, app.page_size, app.page_num, app.keyword).then(res => {
                    app[loading_key] = false;
                    app[list_key] = res.data;
                });
            },
            getTaskList() {
                let app = this;
                app.loading_task = true;
                getTaskForUser(1, 0).then(res => {
                    app.loading_task = false;
                    app.task_list = res.data;
                });
            },
            getTeamTaskLog() {
                let app = this;
                getTeamTaskLog().then(res => {
                    app.team_task_log = res.data;
                    app.$store.dispatch('SET_PAGE_LOADING', false);
                });
            },
            getTeamUserList() {
                let app = this;
                getTeamUser(0, 50).then(res => {
                    app.team_user = res.data
                });
            },
            getTaskStatisticsByTeam(type) {
                let app = this;
                let chart_str = '';
                if (type === 'week') {
                    chart_str = 'chart_data';
                } else {
                    chart_str = 'chart_data_month';
                }
                getTaskStatisticsByTeam(type).then(res => {
                    app[chart_str].series = res.data.data;
                    app[chart_str].xAxis.data = res.data.field;
                    app[chart_str].legend.data = res.data.task_type_list;
                });
            },
            showTaskLogTime(time, prettyTime) {
                if (prettyTime) {
                    return showBeforeTime(time)
                } else {
                    return showBeforeTime(time, false)
                }
            },
            getYiYan() {
                let app = this;
                getYiYan(function (data) {
                    app.yiyan = data
                }, 'd')
            },
            showTaskDetail(task_id, task_index) {
                this.show_task_detail = true;
                this.task_id = task_id;
                this.task_index = task_index;
            },
            modalChange(value) {
                this.show_task_detail = value;
            },
        }
    };
</script>
