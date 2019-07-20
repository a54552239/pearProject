<template>
    <div class="main user-layout-forgot">
        <template v-if="!sended">
            <h3><span>通过邮箱重置</span></h3>
            <a-form
                    :form="formCaptcha"
                    ref="formForgot"
                    id="formForgot">
                <a-form-item>
                    <a-input size="large" type="text" placeholder="注册邮箱地址"
                             v-decorator="['email',{rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}]">
                        <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }"/>

                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            class="forgot-button"
                            :loading="forgotBtn"
                            @click.stop.prevent="handleSubmitCaptcha"
                            :disabled="forgotBtn">获取验证码
                    </a-button>
                    <router-link class="login" :to="{ name: 'login' }">使用其他账户登录</router-link>
                </a-form-item>

            </a-form>
        </template>
        <template v-else>
            <h3><span>重置密码</span></h3>
            <a-form
                    :form="form"
                    ref="formRegister"
                    id="formRegister">
                <a-form-item>
                    <a-input size="large" type="text" placeholder="邮箱" :value="email" disabled>
                        <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }"/>
                    </a-input>
                </a-form-item>

                <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
                    <template slot="content">
                        <div :style="{ width: '240px' }">
                            <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span>
                            </div>
                            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
                            <div style="margin-top: 10px;">
                                <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                            </div>
                        </div>
                    </template>
                    <a-form-item>
                        <a-input
                                v-decorator="['password',{rules: [{ required: true, message: '至少6位密码，区分大小写' },{ validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
                                size="large" type="password" @click="handlePasswordInputClick" autocomplete="false"
                                 placeholder="密码须至少6位，且区分大小写">
                            <a-icon slot="prefix" type='lock' :style="{ color: 'rgba(0,0,0,.25)' }"/>
                        </a-input>
                    </a-form-item>
                </a-popover>

                <a-form-item>
                    <a-input
                            v-decorator="['password2',{rules: [{ required: true, message: '至少6位密码，区分大小写' },{ validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
                            size="large" type="password" autocomplete="false" placeholder="再次确认您的密码">
                        <a-icon slot="prefix" type='check-circle' :style="{ color: 'rgba(0,0,0,.25)' }"/>

                    </a-input>
                </a-form-item>

                <a-form-item>
                    <a-input
                            v-decorator="['captcha',{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: ['blur']}]"
                            size="large" type="text" placeholder="验证码">
                        <a-icon slot="prefix" type='safety-certificate' :style="{ color: 'rgba(0,0,0,.25)' }"/>
                    </a-input>
                </a-form-item>

                <a-form-item>
                    <a-button
                            block
                            size="large"
                            type="primary"
                            htmlType="submit"
                            class="register-button"
                            :loading="registerBtn"
                            @click.stop.prevent="handleSubmit"
                            :disabled="registerBtn">提交
                    </a-button>
                </a-form-item>

            </a-form>
        </template>
    </div>
</template>

<script>
    import md5 from 'md5'
    import {forgot} from '@/api/user'
    import {checkResponse} from "../../assets/js/utils";
    import {notice} from "../../assets/js/notice";
    import {_getMailCaptcha, _resetPasswordByMail} from "../../api/user";

    const levelNames = {
        0: '低',
        1: '低',
        2: '中',
        3: '强'
    };
    const levelClass = {
        0: 'error',
        1: 'error',
        2: 'warning',
        3: 'success'
    };
    const levelColor = {
        0: '#ff0000',
        1: '#ff0000',
        2: '#ff7e05',
        3: '#52c41a',
    };
    export default {
        name: 'Forgot',
        components: {},
        data() {
            return {
                form: this.$form.createForm(this),
                formCaptcha: this.$form.createForm(this),
                email: '',
                sended: false,
                forgotBtn: false,

                state: {
                    time: 60,
                    smsSendBtn: false,
                    passwordLevel: 0,
                    passwordLevelChecked: false,
                    percent: 10,
                    progressColor: '#FF0000'
                },
                registerBtn: false,
            }
        },
        computed: {
            passwordLevelClass() {
                return levelClass[this.state.passwordLevel]
            },
            passwordLevelName() {
                return levelNames[this.state.passwordLevel]
            },
            passwordLevelColor() {
                return levelColor[this.state.passwordLevel]
            },
        },
        methods: {


            handleSubmitCaptcha() {
                this.formCaptcha.validateFields((err, values) => {
                    if (!err) {
                        this.forgotBtn = true;
                        let params = this.formCaptcha.getFieldsValue();
                        this.email = params.email;
                        _getMailCaptcha(this.email)
                            .then(res => {
                                this.sended = true;
                                this.forgotBtn = false;
                                this.$message.destroy();
                                if (!checkResponse(res)) {
                                    return false;
                                }
                                let tips = '验证码获取成功';
                                if (res.data) {
                                    tips += '，您的验证码为：' + res.data;
                                }
                                notice({title: '提示', msg: tips}, 'notification', 'success', 8);
                            })
                    }
                })
            },
            handleSubmit() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.hidePasswordLevelChecked = false ;
                        this.registerBtn = true;
                        let params = this.form.getFieldsValue();
                        params.email = this.email;
                        params.password = md5(params.password);
                        params.password2 = md5(params.password2);
                        _resetPasswordByMail(params).then(res => {
                            this.registerBtn = false;
                            if (!checkResponse(res)) {
                                return false;
                            }
                            notice({title: '提示', msg: '重置密码成功，请登录'}, 'notification', 'success');
                            this.$router.push({name: 'login'})
                        });
                    }
                })
            },
            handlePasswordInputClick() {
                this.state.passwordLevelChecked = true;
            },
            hidePasswordLevelChecked() {
                this.state.passwordLevelChecked = false;
            },
            handlePasswordLevel(rule, value, callback) {

                let level = 0;

                // 判断这个字符串中有没有数字
                if (/[0-9]/.test(value)) {
                    level++
                }
                // 判断字符串中有没有字母
                if (/[a-zA-Z]/.test(value)) {
                    level++
                }
                // 判断字符串中有没有特殊符号
                if (/[^0-9a-zA-Z_]/.test(value)) {
                    level++
                }
                this.state.passwordLevel = level;
                this.state.percent = level * 30;
                if (level >= 2) {
                    if (level >= 3) {
                        this.state.percent = 100
                    }
                    callback()
                } else {
                    if (level === 0) {
                        this.state.percent = 10
                    }
                    callback(new Error('密码强度不够'))
                }
            },

            handlePasswordCheck(rule, value, callback) {
                const password = this.form.getFieldValue('password');
                if (value === undefined) {
                    callback(new Error('请输入密码'))
                }
                if (value && password && value.trim() !== password.trim()) {
                    callback(new Error('两次密码不一致'))
                }
                callback()
            },
        },
        watch: {}
    }
</script>
<style lang="less">
    .user-register {

        &.error {
            color: #ff0000;
        }

        &.warning {
            color: #ff7e05;
        }

        &.success {
            color: #52c41a;
        }


    }

    .user-layout-register {
        .ant-input-group-addon:first-child {
            background-color: #fff;
        }
    }
</style>
<style lang="less">
    .user-layout-forgot {

        & > h3 {
            font-size: 16px;
            margin-bottom: 20px;
        }


        .getCaptcha {
            display: block;
            width: 100%;
            height: 40px;
        }

        .forgot-button {
            width: 50%;
        }

        .login {
            float: right;
            line-height: 40px;
        }
    }
</style>
