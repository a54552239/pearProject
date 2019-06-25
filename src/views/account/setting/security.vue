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
                                                <li @click="editMobile"><a>
                                                    <span v-if="userInfo.mobile">修改</span>
                                                    <span v-else>绑定</span>
                                                </a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>邮箱帐号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">
                                                                  <span v-if="userInfo.email">已绑定邮箱 : {{userInfo.email}}</span>
                                                                <span v-else>未绑定邮箱</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li @click="editMail"><a>
                                                    <span v-if="userInfo.email">修改</span>
                                                    <span v-else>绑定</span>
                                                </a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>钉钉账号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">
                                                                  <span v-if="userInfo.dingtalk_unionid">已绑定</span>
                                                                <span v-else>未绑定钉钉账号</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li v-if="userInfo.dingtalk_unionid" @click="unbindDingtalk"><a>解除绑定</a></li>
                                                <li v-else @click="bindDingtalk"><a>绑定</a></li>
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
        <a-modal
                class="mobile-modal"
                :width="385"
                v-model="mobileInfo.modalStatus"
                :title="mobileInfo.modalTitle"
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
                    :form="mobileForm"
                    hideRequiredMark
                    @submit.prevent="handleMobileSubmit">
                <a-form-item
                >
                    <a-input size="large" type="text" placeholder="手机号"
                             v-decorator="[
                                'mobile',
                                {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}
                            ]">
                        <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                    </a-input>
                </a-form-item>

                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="16">
                        <a-form-item
                        >
                            <a-input size="large" type="text" placeholder="验证码"
                                     v-decorator="[
                                'captcha',
                                {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}
                            ]">
                                <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <a-button
                                class="getCaptcha"
                                size="large"
                                tabindex="-1"
                                :disabled="mobileInfo.state.smsSendBtn"
                                @click.stop.prevent="getCaptcha"
                                v-text="!mobileInfo.state.smsSendBtn && '获取验证码' || (mobileInfo.state.time+' s')"
                        ></a-button>
                    </a-col>
                </a-row>
                <a-form-item
                >
                    <a-button type='primary' htmlType='submit' block size="large" :loading="mobileInfo.confirmLoading"
                              :disabled="mobileInfo.confirmLoading">绑定
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                class="mail-modal"
                :width="385"
                v-model="mailInfo.modalStatus"
                :title="mailInfo.modalTitle"
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
                    :form="mailForm"
                    hideRequiredMark
                    @submit.prevent="handleMailSubmit">
                <a-form-item
                >
                    <a-input size="large" type="text" placeholder="邮箱地址"
                             v-decorator="[
                                'mail',
                                {rules: [{ required: true, pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '请输入正确的邮箱地址' }], validateTrigger: 'change'}
                            ]">
                        <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                    </a-input>
                </a-form-item>
                <a-form-item
                >
                    <a-button type='primary' htmlType='submit' block size="large" :loading="mailInfo.confirmLoading"
                              :disabled="mailInfo.confirmLoading">保存
                    </a-button>
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
    import {_bindMail, _bindMobile, _unbindDingtalk, editPassword, getCaptcha} from "../../../api/user";
    import {dingTalkOauth} from "../../../api/oauth";

    export default {
        name: "settingSecurity",
        components: {
            AccountSetting
        },
        data() {
            return {
                form: this.$form.createForm(this),
                mobileForm: this.$form.createForm(this),
                mailForm: this.$form.createForm(this),
                errorTips: '',
                passwordInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '修改密码',
                    okText: '保存',
                    cancelText: '放弃',
                },
                mobileInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '修改手机',
                    okText: '保存',
                    cancelText: '放弃',
                    state: {
                        time: 60,
                        smsSendBtn: false
                    },
                },
                mailInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '修改邮箱',
                    okText: '保存',
                    cancelText: '放弃',
                    state: {
                        time: 60,
                        smsSendBtn: false
                    },
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            })
        },
        methods: {
            editPassword() {
                this.passwordInfo.modalStatus = true;
            },
            editMobile() {
                this.mobileInfo.modalStatus = true;
            },
            editMail() {
                this.mailInfo.modalStatus = true;
            },
            bindDingtalk() {
                let url = dingTalkOauth() + '?redirectPath=' + this.$route.fullPath + '&bindDingtalk=1';
                location.href = url;
            },
            unbindDingtalk() {
                let app = this;
                this.$confirm({
                    title: '确认解绑',
                    content: `解除绑定后将无法使用该帐号进行登录`,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: `再想想`,
                    onOk() {
                        _unbindDingtalk().then((res) => {
                            const result = checkResponse(res);
                            if (!result) {
                                return false;
                            }
                            app.$store.dispatch('SET_USER', res.data);
                        });
                        return Promise.resolve();
                    }
                });
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
            handleMobileSubmit() {
                let app = this;
                this.mobileForm.validateFields(
                    (err, values) => {
                        if (!err) {
                            let obj = app.mobileForm.getFieldsValue();
                            this.setErrorTips('');
                            app.mobileInfo.confirmLoading = true;
                            _bindMobile(obj).then(res => {
                                app.mobileInfo.confirmLoading = false;
                                if (!checkResponse(res)) {
                                    return;
                                }
                                const obj = {
                                    userInfo: res.data.member,
                                    tokenList: res.data.tokenList
                                };
                                app.$store.dispatch('SET_LOGGED', obj);
                                this.mobileInfo.modalStatus = false;
                                app.mobileForm && app.mobileForm.resetFields();
                            });
                        }
                    },
                );
            },
            handleMailSubmit() {
                let app = this;
                this.mailForm.validateFields(
                    (err, values) => {
                        if (!err) {
                            let obj = app.mailForm.getFieldsValue();
                            this.setErrorTips('');
                            app.mailInfo.confirmLoading = true;
                            _bindMail(obj).then(res => {
                                app.mailInfo.confirmLoading = false;
                                if (!checkResponse(res)) {
                                    return;
                                }
                                this.mailInfo.modalStatus = false;
                                app.mailForm && app.mailForm.resetFields();
                            });
                        }
                    },
                );
            },
            setErrorTips(content = '') {
                this.errorTips = content;
            },
            getCaptcha(e) {
                e.preventDefault();
                const app = this;

                this.mobileForm.validateFields(['mobile'], {force: true}, (err, values) => {
                    if (!err) {
                        this.mobileInfo.state.smsSendBtn = true;

                        const interval = window.setInterval(() => {
                            if (app.mobileInfo.state.time-- <= 0) {
                                app.mobileInfo.state.time = 60;
                                app.mobileInfo.state.smsSendBtn = false;
                                window.clearInterval(interval)
                            }
                        }, 1000);

                        const hide = this.$message.loading('验证码发送中..', 0);
                        getCaptcha(values.mobile)
                            .then(res => {
                                this.$message.destroy();

                                if (!checkResponse(res)) {
                                    return false;
                                }
                                let tips = '验证码获取成功';
                                if (res.data) {
                                    tips += '，您的验证码为：' + res.data;
                                }
                                this.$notification['success']({
                                    message: '提示',
                                    description: tips,
                                    duration: 8,
                                    placement: 'bottomLeft'
                                });
                            })
                            .catch(err => {
                                // setTimeout(hide, 1);
                                clearInterval(interval);
                                app.mobileInfo.state.time = 60;
                                app.mobileInfo.state.smsSendBtn = false;
                                this.requestFailed(err)
                            })
                    }
                })
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

    .mobile-modal {
        .getCaptcha {
            display: block;
            width: 100%;
            height: 40px;
        }
    }
</style>
