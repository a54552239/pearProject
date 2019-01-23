<template>
    <div class="members-profile">
        <div class="header">
            <div class="member-info">
                <template v-if="member">
                    <div class="base">
                        <a-avatar size="large" class="m-r" :src="member.avatar"></a-avatar>
                        <div class="title">
                            {{member.name}}
                        </div>
                    </div>
                    <div class="mail muted">
                        <a-icon type="mail"></a-icon>
                        {{member.email}}
                    </div>
                </template>
            </div>
        </div>
        <div class="actions">
            <a-tabs :animated="false" defaultActiveKey="1">
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
                <a-tab-pane class="info-content" tab="最近动态" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
                <a-tab-pane class="info-content" tab="任务安排" key="3">Content of Tab Pane 3</a-tab-pane>
                <a-tab-pane class="info-content" tab="Ta的项目" key="4">Content of Tab Pane 3</a-tab-pane>
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
    </div>
</template>

<script>
    import _ from 'lodash'
    import inviteDepartmentMember from '../../components/project/inviteDepartmentMember'
    import createDepartment from '../../components/project/createDepartment'
    import pagination from "../../mixins/pagination";
    import {checkResponse} from "../../assets/js/utils";
    import {editAccount, read} from "../../api/user";

    export default {
        name: "memberProfile",
        components: {
            inviteDepartmentMember,
            createDepartment,
        },
        mixins: [pagination],
        data() {
            return {
                code: this.$route.params.code,
                member: {},
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
            init() {
                this.getMember();
            },
            getMember() {
                read(this.code).then(res => {
                    this.member = res.data;
                });
            },
            showEditBaseInfo() {
                this.actionInfo.modalStatus = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        name: this.member.name,
                        mobile: this.member.mobile,
                        email: this.member.email,
                        position: this.member.position,
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
        }
    }
</script>

<style lang="less">
    .members-profile {
        margin: 24px auto;
        width: 800px;
        padding: 0 12px;

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
