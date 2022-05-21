<template>
    <div class="members-profile">
        <a-breadcrumb separator=">" class="breadcrumb">
            <a-breadcrumb-item>
                <router-link to="/">
                    <a-icon type="home"/>
                    首页
                </router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/members">
                    <a-icon type="team"/>
                    成员
                </router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{member.name}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="header">
            <div class="member-info">
                <template v-if="member">
                    <div class="base">
                        <a-avatar size="large" class="m-r" icon="user" :src="member.avatar"></a-avatar>
                        <div class="title">
                            {{member.name}}
                        </div>
                    </div>
                    <div class="mail muted">
                        <a-icon type="mail"></a-icon>
                        {{member.email}}
                        <a-tooltip>
                            <template slot="title">
                                <span>更新基础资料</span>
                            </template>
                            <a class="muted m-l-sm" @click="syncDetail">
                                <a-icon type="reload"/>
                            </a>
                        </a-tooltip>
                    </div>
                </template>
            </div>
        </div>
        <div class="actions">
            <a-tabs :animated="false" defaultActiveKey="1" v-model="tabKey" @change="tabChange">
                <a-tab-pane class="info-content base-info" tab="详细资料" key="1">
                    <p class="action-wrapper">
                        <span class="title">详细资料</span>
                        <a class="muted" @click="showEditBaseInfo">
                            <a-icon type="edit"/>
                            编辑</a>
                    </p>
                    <a-row class="content-wrapper">
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">姓名</span>
                                <span>{{member.name}}</span>
                            </div>
                        </a-col>
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">手机</span>
                                <span>{{member.mobile}}</span>
                            </div>
                        </a-col>
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">邮箱</span>
                                <span>{{member.email}}</span>
                            </div>
                        </a-col>
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">职位</span>
                                <span>{{member.position}}</span>
                            </div>
                        </a-col>
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">部门</span>
                                <span>{{member.departments}}</span>
                            </div>
                        </a-col>
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">加入时间</span>
                                <span>{{member.create_time}}</span>
                            </div>
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <!--<a-tab-pane class="info-content" tab="最近动态*" key="2" forceRender>
                    <p class="action-wrapper">
                        <span class="title">最近动态</span>
                    </p>
                </a-tab-pane>-->
                <a-tab-pane class="info-content" tab="任务安排" key="3">
                    <p class="action-wrapper">
                        <span class="title">
                            任务安排
                             <a-dropdown :trigger="['click']">
                                    <a class="muted m-l-sm" style="font-size: 14px;">
                                        <span v-if="task.type[0] == 0">未完成的任务 </span>
                                        <span v-else>全部 </span>
                                        <a-icon type="down"/>
                                    </a>
                                    <a-menu v-model="task.type" @click="changeTaskType" class="field-right-menu"
                                            slot="overlay"
                                            selectable>
                                        <a-menu-item key="0">
                                            <div class="menu-item-content">
                                                <span>未完成的任务</span>
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item key="-1">
                                            <div class="menu-item-content">
                                                <span>全部</span>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                        </span>
                    </p>
                    <a-list class="content-wrapper list" :loading="task.loading">
                        <a-list-item :key="index" v-for="(item, index) in task.list">
                            <a-list-item-meta @click="showTaskDetail(item)">
                                <div slot="title">
                                    <a-icon type="border" v-if="!item.done"/>
                                    <a-icon type="check-square" v-if="item.done"/>
                                    <span class="m-l-sm">{{item.name}}</span>
                                    <span class="muted m-l tips">
                                        <a-icon type="project"/>
                                        <router-link target="_blank" class="muted m-l-xs"
                                                     :to="'/project/space/task/' + item.projectInfo.code">{{ item.projectInfo.name }}
                                    </router-link>
                                    </span>
                                    <span class="label m-r-xs pull-right" :class="showTimeLabel(item.end_time)"
                                          v-if="item.end_time && !item.done">{{showTaskTime(item.begin_time, item.end_time)}}</span>
                                </div>
                                <div slot="description">

                                </div>
                            </a-list-item-meta>
                        </a-list-item>
                    </a-list>
                </a-tab-pane>
                <a-tab-pane class="info-content" tab="Ta的项目" key="4">
                    <p class="action-wrapper">
                        <span class="title">Ta的项目</span>
                    </p>
                    <a-list class="content-wrapper list default-list" :loading="project.loading">
                        <a-list-item :key="index" v-for="(item, index) in project.list">
                            <a-list-item-meta @click="routerLink(`/project/space/task/${item.code}`)">
                                <a-avatar slot="avatar" icon="user" :src="item.cover"/>
                                <div slot="title">
                                    <span class="m-l-sm">{{item.name}}</span>
                                    <a-tag color="green" class="m-l" v-show="!item.private">公开</a-tag>
                                </div>
                                <div slot="description">
                                    <span class="m-l-sm">{{item.description}}</span>
                                    <!--                                    <a-progress :strokeWidth="5" :percent="item.schedule"/>-->
                                </div>
                            </a-list-item-meta>
                        </a-list-item>
                    </a-list>
                </a-tab-pane>
            </a-tabs>
        </div>
        <a-modal
                v-model="actionInfo.modalStatus"
                :width="600"
                :title="actionInfo.modalTitle"
                :bodyStyle="{padding:'6px 18px 1px 18px'}"
                :footer="null"
        >
            <a-form
                    :form="form"
                    @submit.prevent="handleSubmitBaseInfo"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='姓名'
                        >
                            <a-input placeholder='输入姓名' size="large"
                                     v-decorator="['name',{rules: [{ required: true, message: '请填写姓名' }], validateTrigger: 'blur'}]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='邮箱'
                        >
                            <a-input placeholder='输入电子邮箱地址' size="large"
                                     v-decorator="['email',{rules: [{ required: true, message: '请填写电子邮箱地址' }], validateTrigger: 'blur'}]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='手机'
                        >
                            <a-input placeholder='输入手机' size="large"
                                     v-decorator="['mobile']"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='职位'
                        >
                            <a-input placeholder='输入职位' size="large"
                                     v-decorator="['position']"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                        >
                            <a-input placeholder='输入描述' size="large" type="textarea" :rows="3"
                                     v-decorator="['description']"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item
                >
                    <div class="action-btn" style="text-align: center">
                        <a-button type="primary" htmlType='submit'
                                  block
                                  size="large"
                                  :loading="actionInfo.confirmLoading"
                                  class="middle-btn">保存
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                class="task-detail-modal"
                width="min-content"
                :closable="false"
                v-model="task.modalStatus"
                title=""
                :footer="null"
                @cancel="detailClose"
        >
            <task-detail v-if="task.currentTask.code" :taskCode="task.currentTask.code"
                         @close="detailClose"></task-detail>
        </a-modal>
    </div>
</template>

<script>
    import moment from "moment";
    import taskDetail from '@/components/project/taskDetail'
    import pagination from "../../mixins/pagination";
    import {checkResponse} from "../../assets/js/utils";
    import {editAccount, read, syncDetail} from "../../api/user";
    import {selfList} from "../../api/task";
    import {selfList as getProjectList} from "../../api/project";
    import {formatTaskTime} from "../../assets/js/dateTime";

    export default {
        name: "memberProfile",
        components: {
            taskDetail
        },
        mixins: [pagination],
        data() {
            return {
                code: this.$route.params.code,
                tabKey: this.$route.query.key ? this.$route.query.key : '1',
                member: {},
                task: {
                    page: 1,
                    pageSize: 1000,
                    loading: false,
                    modalStatus: false,
                    currentTask: {},
                    type: ['0'],
                    total: 0,
                    list: []
                },
                project: {
                    page: 1,
                    pageSize: 1000,
                    loading: false,
                    total: 0,
                    list: []
                },
                form: this.$form.createForm(this),
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '组织成员信息',
                }
            }
        },
        computed: {},
        watch: {},
        created() {
            this.init();
        },
        methods: {
            async init() {
                await this.getMember();
                this.tabChange(this.tabKey)
            },
            tabChange(key) {
                switch (key) {
                    case '3':
                        this.getTasks();
                        break;
                    case '4':
                        this.getProjectList();
                }
            },
            getMember() {
                return read(this.code).then(res => {
                    this.member = res.data;
                });
            },
            syncDetail() {
                syncDetail({code: this.code}).then(res => {
                    this.getMember();
                });
            },
            getTasks() {
                this.task.loading = true;
                selfList({
                    memberCode: this.member.member_code,
                    type: Number(this.task.type[0]),
                    page: this.task.page,
                    pageSize: this.task.pageSize
                }).then(res => {
                    this.task.loading = false;
                    this.task.list = res.data.list;
                    this.task.total = res.data.total;
                })
            },
            changeTaskType(obj) {
                this.$nextTick(() => {
                    this.getTasks();
                })
            },
            showTaskDetail(task) {
                this.task.currentTask = JSON.parse(JSON.stringify(task));
                this.task.modalStatus = true;
            },
            detailClose() {
                this.task.modalStatus = false;
                setTimeout(() => {
                    this.task.currentTask.code = '';
                }, 500);
            },
            getProjectList() {
                this.task.loading = true;
                getProjectList({
                    memberCode: this.member.member_code,
                    page: this.task.page,
                    pageSize: this.task.pageSize
                }).then(res => {
                    this.project.loading = false;
                    this.project.list = res.data.list;
                    this.project.total = res.data.total;
                })
            },
            showEditBaseInfo() {
                this.actionInfo.modalStatus = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        name: this.member.name,
                        mobile: this.member.mobile,
                        email: this.member.email,
                        position: this.member.position,
                        description: this.member.description,
                    });
                });
            },
            handleSubmitBaseInfo() {
                let app = this;
                app.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            values.code = app.member.code;
                            editAccount(values).then(res => {
                                const result = checkResponse(res);
                                if (result) {
                                    this.actionInfo.modalStatus = false;
                                    Object.assign(app.member, values);
                                }
                            });
                        }
                    })
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
            },
            showTimeLabel(time) {
                let str = 'label-primary';
                if (time == null) {
                    return str;
                }
                let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
                if (cha < 0) {
                    str = 'label-danger';
                } else if (cha == 0) {
                    str = 'label-warning';
                } else if (cha > 7) {
                    str = 'label-normal'
                }
                return str;
            },
        }
    }
</script>

<style lang="less">
    .members-profile {
        margin: 18px auto;
        width: 800px;
        padding: 0 12px;

        .breadcrumb {
            margin-bottom: 18px;
        }

        .header {
            background: #FFF;
            width: 100%;
            padding: 18px;


            .member-info {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .base {
                    display: flex;
                    align-items: center;
                }
            }
        }

        .actions {
            .ant-tabs-nav-container {
                background: #FFF;
                padding: 12px 18px 0;
            }

            .info-content {
                .action-wrapper {
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 0;

                    .title {
                        font-size: 16px;

                    }
                }

                .content-wrapper {
                    padding: 0 36px;
                    background: #FFF;

                    &.list {
                        padding: 4px 0;

                        .ant-list-item {
                            padding: 12px;
                            border-bottom: none;
                            margin: 0 12px;

                            .tips {
                                font-size: 12px;
                            }

                            &:hover {
                                background-color: #f5f5f5;
                                cursor: pointer;
                            }
                        }
                    }

                    &.default-list {
                        .ant-list-item-meta {
                            align-items: center;
                        }
                    }
                }

            }

            .base-info {
                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 28px 0;
                    margin-right: 24px;
                }
            }
        }
    }

</style>
