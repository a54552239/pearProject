<template>
    <div class="project-space-events">
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
                    <li><a class="app" data-app="works"
                           @click="$router.push('/project/space/files/' + code)">
                        文件</a>
                    <li><a class="app" data-app="build"
                           @click="$router.push('/project/space/overview/' + code)">
                        概览</a>
                    </li>
                    <li class=""><a class="app" data-app="build"
                                    @click="$router.push('/project/space/features/' + code)">
                        版本</a>
                    </li>
                    <li class="actives"><a class="app" data-app="works"
                                           @click="$router.push('/project/space/events/' + code)">
                        日程</a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper-content :showHeader="false">
            <div class="content-wrapper">
                <div class="content-item log-list">
                    <div class="header">
                        <span class="title">项目日程</span>
                        <div class="header-actions">
                            <a-button icon="plus" type="primary" @click="rowClick(null,'add')">新建日程</a-button>
                        </div>
                    </div>
                    <div class="list-content">
                        <a-list
                            :loading="loading"
                        >
                            <!-- <a-list-item class="list-item-title">
                                 <a-list-item-meta>
                                     <div class="muted" slot="title">
                                         名称
                                     </div>
                                 </a-list-item-meta>
                                 <div class="other-info muted">
                                     <div class="info-item">
                                         <span>时间</span>
                                     </div>
                                     <div class="info-item">
                                         <span>地点</span>
                                     </div>
                                     <div class="info-item">
                                         <span>创建人</span>
                                     </div>
                                 </div>
                                 <span slot="actions" :key="item" v-for="item in 3">
                                     <span>位</span>
                                 </span>
                             </a-list-item>-->
                            <a-list-item class="list-item" :key="index" v-for="(item, index) in eventList">
                                <a-list-item-meta>
                                    <div slot="title" style="display:flex;line-height: 20px;">
                                        <div class="info-item text-grey" style="">
                                            <div class="text-center">
                                                <div>{{ moment(item.begin_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                                <div> ~</div>
                                                <div>{{ moment(item.end_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                            </div>
                                        </div>
                                        <div class="info-item">
                                            <div class="line-item" style="font-size: 18px;margin-bottom: 20px">{{ item.title }}</div>
                                            <div class="line-item text-grey"> <a-icon type="environment"  class="m-r-xs"/>{{ item.position }}</div>
                                            <template v-if="item.description">
                                                <!--                                                <div class="line-item">备注</div>-->
                                                <div class="line-item m-t text-grey">{{item.description}}</div>
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
                                        </div>
                                    </div>
                                </a-list-item-meta>
                                <div class="other-info muted">
                                </div>
                                <template v-if="item.created_by == currentMemberCode">
                                    <span slot="actions" @click="rowClick(item, 'edit', index)">
                                    <a-tooltip title="编辑">
                                        <a-icon type="edit"/>
                                    </a-tooltip>
                                </span>
                                    <span slot="actions" @click="rowClick(item, 'del', index)">
                                    <a-tooltip title="取消日程">
                                          <a-icon type="delete"/>
                                    </a-tooltip>
                                </span>
                                </template>
                            </a-list-item>
                            <div v-if="showLoadingMore" slot="loadMore"
                                 :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                <a-spin v-if="loadingMore"/>
                                <a-button v-else @click="onLoadMore">查看更多日程</a-button>
                            </div>
                        </a-list>
                    </div>
                </div>
            </div>
        </wrapper-content>
        <a-modal
            class="v-field-form vertical-modal"
            destroyOnClose
            :maskClosable="false"
            :title="actionInfo.modalTitle"
            :confirmLoading="submitting"
            v-model="actionInfo.modalStatus"
            :width="600"
            @ok="handleSubmit"
        >
            <a-spin :spinning="loading">
                <!--<a-alert class="m-b alert-white" type="info" message="提示"
                         showIcon></a-alert>-->
                <a-form-model class="m-b" :model="formData" ref="ruleForm" :rules="rules"
                              @submit.prevent="handleSubmit">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-model-item
                                label='标题'
                                prop="title"
                            >
                                <a-input v-model="formData.title"/>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-row :gutter="16">
                                <a-col :span="12">
                                    <a-form-model-item
                                        label='开始时间'
                                        prop="begin_time"
                                    >
                                        <a-date-picker v-model="formData.begin_time" showTime format="YYYY年MM月DD日 HH:mm"
                                                       style="width: 100%"
                                                       placeholder="选择开始时间"></a-date-picker>
                                    </a-form-model-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-model-item
                                        label='结束时间'
                                        prop="end_time"
                                    >
                                        <a-date-picker v-model="formData.end_time" showTime format="YYYY年MM月DD日 HH:mm"
                                                       style="width: 100%"
                                                       placeholder="选择结束时间"></a-date-picker>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item
                                label='所属项目'
                                prop="memberList"
                            >
                                <a-select style="width: 100%" v-model="formData.project_code"
                                          allowClear
                                          showSearch
                                          :disabled="!!formData.id"
                                          autoClearSearchValue>
                                    <template v-for="item in projectList">
                                        <a-select-option :key="item.code" :value="item.code">
                                            {{ item.name }}
                                        </a-select-option>
                                    </template>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item
                                label='日程地点'
                                prop="position"
                            >
                                <a-input v-model="formData.position"/>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item
                                label='选择成员'
                                prop="memberList"
                            >
                                <a-select style="width: 100%;" v-model="formData.member_list"
                                          allowClear
                                          showSearch
                                          autoClearSearchValue
                                          :maxTagCount="4"
                                          optionLabelProp="label"
                                          mode="multiple">
                                    <template v-for="item in projectMemberList">
                                        <a-select-option :disabled="!canRemove(item.code)" :key="item.code"
                                                         :value="item.code" :label="item.name">
                                            <a-avatar :size="24" icon="user" :src="item.avatar" class="m-r-sm"/>
                                            {{ item.name }}
                                        </a-select-option>
                                    </template>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item
                                label='备注'
                                prop="description"
                            >
                                <a-textarea :rows="4" v-model="formData.description" placeholder='填写备注，不超过250字'/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </a-form-model>
            </a-spin>
        </a-modal>
    </div>
</template>

<script>
import moment from "moment";
import {read as getProject} from "@/api/project";
import {collect} from "@/api/projectCollect";
import {checkResponse} from "assets/js/utils";
import {doData, list, del} from "@/api/projectEvents";
import pagination from "@/mixins/pagination";
import projectSelect from '@/components/project/projectSelect'
import {list as getProjectMemberList} from "@/api/projectMember";
import {selfList as getProjectList} from "@/api/project";


export default {
    name: "project-space-events",
    mixins: [pagination],
    data() {
        return {
            moment,
            currentMemberCode: this.$store.state.userInfo.code,
            code: this.$route.params.code,
            loading: true,
            showLoadingMore: false,
            loadingMore: false,
            project: {task_board_theme: 'simple'},
            currentFileIndex: {},
            eventList: [],

            submitting: false,
            projectList: [],
            projectMemberList: [],

            actionInfo: {
                modalStatus: false,
                confirmLoading: false,
                modalTitle: '新建日程',
                okText: '确定',
                cancelText: '放弃',
            },

            formData: {
                id: 0,
                title: undefined,
                description: undefined,
                begin_time: null,
                end_time: null,
                all_day: false,
                project_code: this.$route.params.code,
                position: undefined,
                member_list: [],
            },
            rules: {
                title: [
                    {required: true, message: '请选择必填项', trigger: 'blur'}
                ],
                project_code: [
                    {required: true, message: '请选择必填项', trigger: 'blur'}
                ],
                begin_time: [
                    {required: true, message: '请选择开始时间', trigger: 'change'}
                ],
                end_time: [
                    {required: true, message: '请选择结束时间', trigger: 'change'}
                ],
            },
        }
    },
    components: {
        projectSelect,
    },
    computed: {},
    watch: {},
    created() {
        this.init();
        this.formData.member_list.push(this.currentMemberCode);
        this.getProject();
        this.getProjectList();
        this.getProjectMemberList();
    },
    mounted() {
    },
    methods: {
        getProject() {
            this.loading = true;
            getProject(this.code).then((res) => {
                this.loading = false;
                this.project = res.data;
                this.$store.dispatch('setTempData', {
                    projectCode: this.project.code,
                })
            });
        },
        getProjectMemberList() {
            getProjectMemberList({projectCode: this.code, pageSize: 300}).then(res => {
                this.projectMemberList = res.data.list;
            })
        },
        getProjectList() {
            getProjectList({archive: 0, pageSize: 300}).then(res => {
                this.projectList = res.data.list;
            })
        },
        init(reset = true) {
            let app = this;
            if (reset) {
                this.pagination.page = 1;
                this.pagination.pageSize = 50;
                this.showLoadingMore = false;
            }
            app.requestData.projectCode = this.code;
            app.requestData.deleted = 0;
            list(app.requestData).then(res => {
                if (reset) {
                    this.eventList = [];
                }
                res.data.list.forEach((v) => {
                    v.editing = false;
                });
                app.eventList = app.eventList.concat(res.data.list);
                app.pagination.total = res.data.total;
                app.showLoadingMore = app.pagination.total > app.eventList.length;
                app.loading = false;
                app.loadingMore = false
            })
        },
        onLoadMore() {
            this.loadingMore = true;
            this.pagination.page++;
            this.init(false);
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
        handleSubmit() {
            let app = this;
            app.$refs.ruleForm.validate(valid => {
                if (valid) {
                    app.handleOk();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleOk() {
            let app = this;
            app.submitting = true;
            let obj = {...app.formData};
            console.log(obj);
            // app.$emit('fieldsSave', obj);
            obj.member_list = JSON.stringify(obj.member_list);
            obj.begin_time = moment(obj.begin_time).format('YYYY-MM-DD HH:mm:ss')
            obj.end_time = moment(obj.end_time).format('YYYY-MM-DD HH:mm:ss')
            doData(obj).then(res => {
                app.submitting = false;
                if (!checkResponse(res, true)) {
                    return;
                }
                app.init(true);
                app.actionInfo.modalStatus = false;
            });
        },
        async rowClick(record, action, index = null) {
            let app = this;
            app.formData.id = 0;
            if (action == 'add' || action == 'edit' || action == 'new') {
                app.formData = {
                    id: 0,
                    title: undefined,
                    description: undefined,
                    begin_time: null,
                    end_time: null,
                    all_day: false,
                    project_code: app.$route.params.code,
                    position: undefined,
                    member_list: [app.currentMemberCode],
                };
                app.actionInfo.modalTitle = '新增日程';
                if (action == 'edit') {
                    app.actionInfo.modalTitle = '编辑日程';
                    app.formData.id = record.id;
                    let member_list = [];
                    record.memberList.forEach((v=>{
                        member_list.push(v.member_code);
                    }))
                    record.member_list = member_list;
                    app.formData = {...record};
                }
                app.actionInfo.modalStatus = true;
                app.$nextTick(() => {
                    app.$refs.ruleForm.clearValidate();
                });
            } else if (action == 'del') {
                app.$confirm({
                    title: `确定要删除?`,
                    content: '关联的相关信息将会同时被删除',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '放弃',
                    onOk() {
                        del({eventsCode: record.code}).then(res=>{
                            if (!checkResponse(res, true)) {
                                return;
                            }
                            app.init(true);
                        })
                    }
                });
            }
        },
        canRemove(memberCode) {
            console.log(this.formData.memberList);
            if (this.formData.memberList) {
                const member = this.formData.memberList.find(item => item.member_code == memberCode);
                if (member && member.is_owner) {
                    return false;
                }
                return true;
            }
            return memberCode != this.currentMemberCode;
        }
    }
}
</script>

<style lang="less">
/*@import "../../../assets/css/components/task";*/

.project-space-events {
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
            padding: 6px 0 18px 0;
            border-radius: 4px;

            .header {
                padding: 12px 20px 6px 20px;
                display: flex;
                justify-content: space-between;

                .title {
                    font-size: 18px;
                }
            }
        }

        .content-wrapper {
            width: 100%;

            .log-list {
                background: #fff;

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
        }

        .content-right {
            width: 325px;
        }
    }
}
</style>
