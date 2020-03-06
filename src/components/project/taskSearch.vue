<template>
    <div class="task-search">
        <a-spin :spinning="loading">
            <!--<div class="header">
            </div>-->
            <div class="search-content">
                <a-form
                        class="m-t-md"
                        :form="form"
                        @submit.prevent="handleSubmit">
                    <a-form-item
                            label='标题'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-input
                                placeholder='搜索项目内任务'
                                v-decorator="[
                                            'title',
                                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            label='执行者'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                mode="multiple"
                                showSearch
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'executor',
                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="member.code" v-for="member in projectMemberList">
                                <div class="task-search-member-item">
                                    <a-avatar :size="24" icon="user" :src="member.avatar" class="m-r-sm"/>
                                    <div>
                                        <div>{{member.name}}</div>
                                        <div class="muted">{{member.email}}</div>
                                    </div>
                                </div>
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label='创建者'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                mode="multiple"
                                showSearch
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'creator',
                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="member.code" v-for="member in projectMemberList">
                                <div class="task-search-member-item">
                                    <a-avatar :size="24" icon="user" :src="member.avatar" class="m-r-sm"/>
                                    <div>
                                        <div>{{member.name}}</div>
                                        <div class="muted">{{member.email}}</div>
                                    </div>
                                </div>
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label='参与者'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                mode="multiple"
                                showSearch
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'joiner',
                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="member.code" v-for="member in projectMemberList">
                                <div class="task-search-member-item">
                                    <a-avatar :size="24" icon="user" :src="member.avatar" class="m-r-sm"/>
                                    <div>
                                        <div>{{member.name}}</div>
                                        <div class="muted">{{member.email}}</div>
                                    </div>
                                </div>
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label='是否完成'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'done',
                                             {initialValue: -1}

                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="-1">全部</a-select-option>
                            <a-select-option :key="1">是</a-select-option>
                            <a-select-option :key="0">否</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label='优先级'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                mode="multiple"
                                showSearch
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'pri',
                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="0">普通</a-select-option>
                            <a-select-option :key="1">紧急</a-select-option>
                            <a-select-option :key="2">非常紧急</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label='执行状态'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                mode="multiple"
                                showSearch
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'status',
                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="status.id" v-for="(status, index) in taskStatusList">{{status.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <!--<a-form-item
                            label='任务列表'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-select
                                mode="multiple"
                                showSearch
                                allowClear
                                placeholder='请选择'
                                v-decorator="[
                                            'stage',
                                            ]"
                                optionFilterProp="children"
                        >
                            <a-select-option :key="stage.code" v-for="stage in taskStageList">{{stage.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>-->
                    <a-form-item
                            label='截止日期'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-range-picker
                                style="width: 100%"
                                allowClear
                                format="YYYY-MM-DD"
                                v-decorator="[
                                            'end_time',
                                            ]"
                        >
                        </a-range-picker>
                    </a-form-item>
                    <a-form-item
                            label='创建日期'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-range-picker
                                style="width: 100%"
                                allowClear
                                format="YYYY-MM-DD"
                                v-decorator="[
                                            'create_time',
                                            ]"
                        >
                        </a-range-picker>
                    </a-form-item>
                    <a-form-item
                            label='完成日期'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-range-picker
                                style="width: 100%"
                                allowClear
                                format="YYYY-MM-DD"
                                v-decorator="[
                                            'done_time',
                                            ]"
                        >
                        </a-range-picker>
                    </a-form-item>
                    <a-form-item
                            label='开始日期'
                            :colon="false"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                    >
                        <a-range-picker
                                style="width: 100%"
                                allowClear
                                format="YYYY-MM-DD"
                                v-decorator="[
                                            'begin_time',
                                            ]"
                        >
                        </a-range-picker>
                    </a-form-item>
                </a-form>
                <div class="footer m-t-md">
                    <a-button class="m-r" type="primary" size="large" @click="handleSubmit">搜索</a-button>
                    <a-button size="large" @click="resetForm">重置</a-button>
                </div>
            </div>
        </a-spin>
    </div>
</template>
<script>
    import _ from 'lodash'
    import moment from 'moment';
    import {list as getProjectMember} from "../../api/projectMember";
    import {_getAll as getTaskStage} from "../../api/taskStages";
    import {notice} from "../../assets/js/notice";
    import {COMMON} from "../../const/common";

    export default {
        name: "taskSearch",
        props: {
            projectCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            },
        },
        data() {
            return {
                moment,
                form: this.$form.createForm(this),
                loading: false,
                projectMemberList: [],
                taskStageList: [],
                taskStatusList: COMMON.TASK_STATUS,
            };
        },
        watch: {
            projectCode() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.projectCode) {
                    this.resetForm();
                    this.loading = true;
                    this.getProjectMemberList();
                    this.getTaskStageList();
                }
            },
            getProjectMemberList() {
                getProjectMember({projectCode: this.projectCode, pageSize: 300}).then(res => {
                    this.projectMemberList = res.data.list;
                    this.loading = false;
                });
            },
            getTaskStageList() {
                getTaskStage({projectCode: this.projectCode}).then(res => {
                    this.taskStageList = res.data;
                    this.loading = false;
                });
            },
            resetForm() {
                this.form.resetFields();
            },
            handleSubmit() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = this.form.getFieldsValue();
                        params.executor = JSON.stringify(params.executor);
                        params.creator = JSON.stringify(params.creator);
                        params.joiner = JSON.stringify(params.joiner);
                        params.status = JSON.stringify(params.status);
                        console.log(params);
                        if (params.end_time && params.end_time.length) {
                            params.endTime = JSON.stringify([moment(params.end_time[0]).format('YYYY-MM-DD'), moment(params.end_time[1]).format('YYYY-MM-DD')]);
                        } else {
                            params.endTime = undefined;
                        }
                        if (params.begin_time && params.begin_time.length) {
                            params.beginTime = JSON.stringify([moment(params.begin_time[0]).format('YYYY-MM-DD'), moment(params.begin_time[1]).format('YYYY-MM-DD')]);
                        } else {
                            params.beginTime = undefined;
                        }
                        if (params.create_time && params.create_time.length) {
                            params.createTime = JSON.stringify([moment(params.create_time[0]).format('YYYY-MM-DD'), moment(params.create_time[1]).format('YYYY-MM-DD')]);
                        } else {
                            params.createTime = undefined;
                        }
                        if (params.done_time && params.done_time.length) {
                            params.doneTime = JSON.stringify([moment(params.done_time[0]).format('YYYY-MM-DD'), moment(params.done_time[1]).format('YYYY-MM-DD')]);
                        } else {
                            params.doneTime = undefined;
                        }
                        console.log(params);
                        this.$emit('search', params)
                    }
                })
            },
        }
    }
</script>
<style lang="less">
    .task-search {
        .ant-drawer-body {
            padding-top: 0 !important;
        }

        .search-content {
            padding: 0 24px 120px 24px !important;
        }

        .footer {
            display: flex;

            .ant-btn {
                flex: 1;
            }
        }
    }

    .ant-select-selection__choice__content {
        .task-search-member-item {
            .ant-avatar {
                display: none;
            }
        }
    }

    .task-search-member-item {
        display: flex;
        align-items: center;

    }
</style>

