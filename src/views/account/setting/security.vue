<template>
    <div class="account-setting-security">
        <wrapper-content :showHeader="false">
            <div class="setting-content">
                <account-setting :keys="['security']"></account-setting>
                <div class="layout-item right">
                    <div class="setting-info-title">
                        <span>安全设置</span>
                    </div>
                    <div class="setting-info">
                        <div class="setting-info-content">
                            <div class="ant-list ant-list-split">
                                <div class="ant-spin-nested-loading">
                                    <div class="ant-spin-container">
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>账户密码</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">当前密码强度 : 强</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li @click="editPassword"><a>修改</a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>手机账号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">
                                                                <span v-if="userInfo.mobile">已绑定手机 : {{userInfo.mobile}}</span>
                                                                <span v-else>未绑定手机</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li><a>修改</a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>邮箱帐号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">已绑定邮箱 : {{userInfo.email}}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li><a>修改</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </wrapper-content>
        <a-modal
                :width="385"
                v-model="passwordInfo.modalStatus"
                :title="passwordInfo.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <a-alert style="margin-bottom: 12px;"
                     v-show="errorTips"
                    :message="errorTips"
                    type="error"
            />
            <a-form
                    layout="vertical"
                    :form="form"
                    :autoFormCreate="(form)=>{this.form = form}"
                    hideRequiredMark
                    @submit.prevent="handlePasswordSubmit">
                <a-form-item
                        label='原密码'
                >
                    <a-input
                            type="password"
                            v-decorator="[
                                            'password',
                                            {rules: [{ required: true, message: '请输入原密码' }]}
                                            ]"
                    />
                </a-form-item>
                <a-form-item
                        label='新密码'
                >
                    <a-input
                            type="password"
                            v-decorator="[
                                            'newPassword',
                                            {rules: [{ required: true, message: '请输入新密码' }]}
                                            ]"
                    />
                </a-form-item>
                <a-form-item
                        label='确认新密码'
                >
                    <a-input
                            type="password"
                            v-decorator="[
                                            'confirmPassword',
                                            {rules: [{ required: true, message: '请确认新密码' }]}
                                            ]"
                    />
                </a-form-item>
                <a-form-item
                >
                    <a-button type='primary' htmlType='submit' block size="large">保存</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import md5 from 'md5'
    import {mapState} from 'vuex'
    import AccountSetting from "@/components/layout/account/setting"
    import {checkResponse} from "../../../assets/js/utils";
    import {editPassword} from "../../../api/user";

    export default {
        name: "settingSecurity",
        components: {
            AccountSetting
        },
        data() {
            return {
                form: this.$form.createForm(this),
                errorTips: '',
                passwordInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '修改密码',
                    okText: '保存',
                    cancelText: '放弃',
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            })
        },
        methods: {
            editPassword(){
                this.passwordInfo.modalStatus = true;
            },
            handlePasswordSubmit() {
                let app = this;
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            let obj = app.form.getFieldsValue();
                            if (obj.password.length < 6 || obj.newPassword.length < 6 || obj.confirmPassword.length < 6) {
                                this.setErrorTips('密码必须包含6个字符');
                                return false;
                            }
                            if (obj.newPassword != obj.confirmPassword) {
                                this.setErrorTips('两次新密码不匹配');
                                return false;
                            }
                            this.setErrorTips('');
                            obj.id = app.userInfo.id;
                            obj.password = md5(obj.password);
                            obj.newPassword = md5(obj.newPassword);
                            obj.confirmPassword = md5(obj.confirmPassword);
                            editPassword(obj).then(res => {
                                app.loading = false;
                                if (!checkResponse(res)) {
                                    return;
                                }
                                this.passwordInfo.modalStatus = false;
                                app.form && app.form.resetFields();
                            });
                        }
                    },
                );
            },
            setErrorTips(content = '') {
                this.errorTips = content;
            },
        }
    }
</script>

<style lang="less">
    .account-setting-security {
        .wrapper-main {
            padding-left: 0;
        }

        .setting-content {
            display: flex;
            flex-direction: row;

            .right {
                flex: 1 1 0;
                padding: 8px 40px;

                .setting-info-title {
                    font-size: 20px;
                }

                .setting-info {
                    display: flex;
                    flex-direction: row;
                    padding-top: 12px;

                    &-content {
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
