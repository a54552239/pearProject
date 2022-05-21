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
                           @click="$router.push('/project/space/task/' + code)">任务</a></li>
                    <li class=""><a class="app" data-app="works"
                                    @click="$router.push('/project/space/files/' + code)">
                        文件</a>
                    <li class="actives"><a class="app" data-app="build"
                                           @click="$router.push('/project/space/overview/' + code)">
                        概览</a>
                    </li>
                    <li class=""><a class="app" data-app="build"
                                    @click="$router.push('/project/space/features/' + code)">
                        版本</a>
                    </li>
                    <li><a class="app" data-app="build"
                           @click="$router.push('/project/space/events/' + code)">
                        日程</a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper-content :showHeader="false">
            <div class="overview-item m-b">
                <div class="content-item">
                    <h3 class="m-sm m-b text-center">任务燃尽图</h3>
                    <a-spin :spinning="burnoutMap.loading">
                        <ve-line
                                v-if="!burnoutMap.loading"
                                :data="burnoutMap.chartData"
                                :settings="burnoutMap.chartSettings"
                                :extend="burnoutMap.chartExtend"
                                :series="burnoutMap.series"
                                :legend-visible="false"
                                height="200px"
                        ></ve-line>
                    </a-spin>
                </div>
            </div>
            <div class="overview-item">
                <div class="content-left">
                    <div class="content-item log-list">
                        <div class="title">
                            项目信息
                            <a-tooltip :mouseEnterDelay="0.5">
                                <template slot="title">
                                    <span>添加信息</span>
                                </template>
                                <a class="pull-right muted" @click="createInfo()">
                                    <a-icon type="plus-circle"/>
                                </a>
                            </a-tooltip>
                        </div>
                        <div class="list-content">
                            <a-list>
                                <a-list-item :key="index" v-for="(item, index) in projectInfoList">
                                    <a-list-item-meta>
                                        <div slot="title">
                                            <a-tooltip :mouseEnterDelay="0.5">
                                                <template slot="title">
                                                    <span>{{item.description ? item.description : '暂无描述'}}</span>
                                                </template>
                                                <span>{{ item.name }} </span>
                                            </a-tooltip>
<!--                                            <span class="right-item muted"> {{ formatTime(item.create_time) }}-->
<!--                                        </span>-->
                                        </div>
                                        <div slot="description">
                                            {{ item.value }}
                                        </div>
                                    </a-list-item-meta>
                                    <span slot="actions" @click="editInfo(item)">
                                         <a-tooltip title="编辑">
                                             <a-icon type="edit"/>
                                         </a-tooltip>
                                    </span>
                                    <span slot="actions" @click="delInfo(item,index)">
                                         <a-tooltip title="删除">
                                              <a-icon type="delete"/>
                                         </a-tooltip>
                                    </span>
                                </a-list-item>
                            </a-list>
                        </div>
                    </div>
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
                                                {{item.owner_name}} 创建于
                                                {{moment(item.create_time).format('YYYY年MM月DD日')}}
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
                                        <a-progress strokeColor="#1890ff" :strokeWidth="3" :showInfo="false"
                                                    :percent="stats.schedule"/>
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
        <!--项目信息-->
        <a-modal
                class="project-info"
                :width="400"
                v-model="infoModal.modalStatus"
                :title="infoModal.modalTitle"
                :confirmLoading="infoModal.loading"
                @ok="handleSubmit"
        >
            <a-form
                    @submit.prevent="handleSubmit"
                    :form="infoModal.form"
            >
                <a-form-item
                >
                    <a-input placeholder='名称'
                             v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入名称' }]}
                                            ]"/>
                </a-form-item>
                <a-form-item
                >
                    <a-textarea placeholder='内容'
                                :rows="2"
                                v-decorator="['value']"
                    />
                </a-form-item>
                <a-form-item
                >
                    <a-textarea placeholder='描述'
                                :rows="2"
                                v-decorator="['description']"
                    />
                </a-form-item>
                <a-form-item
                >
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import moment from "moment";
    import VeLine from 'v-charts/lib/line.common'
    import {_getProjectReport, _projectStats, doData, read as getProject} from "../../../api/project";
    import {doData as doInfo, list as getInfoList, del as delProjectInfo} from "../../../api/projectInfo";
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
                projectInfoList: [],
                showLoadingMore: false,
                loadingMore: false,
                infoModal: {
                    form: this.$form.createForm(this),
                    newData: {
                        code: ''
                    },
                    loading: false,
                    modalStatus: false,
                    modalTitle: '项目信息',
                },
                burnoutMap: {
                    loading: true,
                    chartData: {
                        columns: ['日期', '实际剩余任务', '理想剩余任务'],
                        rows: []
                    },
                    series: [
                        {
                            type: 'line',
                            name: '实际剩余任务',
                            smooth: false,
                            color: '#1890ff',
                            data: [],
                        },
                        {
                            type: 'line',
                            name: '理想剩余任务',
                            color: '#52C41A',
                            smooth: false,
                            lineStyle: {
                                type: 'dashed'
                            },
                            data: []
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
                    rows: [],
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
                this.getProjectInfoList();
                this.getProjectLog();
                this.overviewForProject();
                this.getProjectStats();
                this.getProjectReport();
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
            getProjectReport() {
                let app = this;
                _getProjectReport({projectCode: this.code}).then(res => {
                    let rows = [];
                    res.data.date.forEach((v) => {
                        rows.push({'日期': v})
                    });
                    app.burnoutMap.loading = false;
                    app.burnoutMap.chartData.rows = rows;
                    app.burnoutMap.series[0].data = res.data.undoneTask;
                    app.burnoutMap.series[1].data = res.data.baseLineList;

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
            getProjectInfoList() {
                let app = this;
                getInfoList({projectCode: app.code}).then(res => {
                    app.projectInfoList = res.data;
                });
            },
            getProjectStats() {
                _projectStats({
                    projectCode: this.code
                }).then(res => {
                    const taskStats = res.data;
                    const total = taskStats['total'];
                    this.projectStats.forEach((v, k) => {
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
            createInfo() {
                let app = this;
                app.infoModal.newData = {code: ''};
                setTimeout(function () {
                    app.infoModal.form && app.infoModal.form.resetFields();
                }, 0);
                app.infoModal.modalStatus = true;
                app.infoModal.modalTitle = '添加字段';
            },
            editInfo(info) {
                let app = this;
                app.infoModal.newData = info;
                app.infoModal.modalStatus = true;
                setTimeout(function () {
                    app.infoModal.modalTitle = '编辑字段';
                    app.infoModal.form.setFieldsValue({
                        name: info.name,
                        value: info.value,
                        description: info.description,
                    });
                }, 0);
            },
            delInfo(info, index) {
                let app = this;
                app.$confirm({
                    title: '确定删除当前字段吗？',
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '再想想',
                    onOk() {
                        delProjectInfo({infoCode: info.code}).then(() => {
                            app.projectInfoList.splice(index, 1);
                            // app.init();
                        });
                        return Promise.resolve();
                    }
                });
            },
            handleSubmit() {
                let app = this;
                app.infoModal.form.validateFields(
                    (err) => {
                        if (!err) {
                            app.handleOk();
                        }
                    })
            },
            handleOk() {
                let app = this;
                app.infoModal.loading = true;
                let obj = app.infoModal.form.getFieldsValue();
                if (app.infoModal.newData.code) {
                    //编辑
                    obj.infoCode = app.infoModal.newData.code;
                } else {
                    //新增
                    Object.assign(obj, app.infoModal.newData);
                }
                obj.projectCode = app.code;
                console.log(obj);
                doInfo(obj).then(res => {
                    app.infoModal.loading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    app.infoModal.form.resetFields();
                    app.infoModal.newData = {code: 0};
                    app.infoModal.modalStatus = false;
                    app.getProjectInfoList();
                });
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
    .project-info {
        .ant-modal-body {
            padding-bottom: 0;
        }
    }

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
                    margin-bottom: 15px;

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
