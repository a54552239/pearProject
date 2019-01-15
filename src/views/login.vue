<template>
    <div class="login">
        <div class="container">
            <div class="content">
                <div class="top">
                    <div class="header">
                        <a-badge :count="'Beta 1.0'">
                            <a>
                                <img alt="logo" class="logo"
                                     src="../assets/image/common/logo.png">
                                <span class="title">PearProject</span>
                            </a>
                        </a-badge>
                    </div>
                    <div class="desc">欢迎登录 PearProject
                        版本：<span>1.0</span></div>
                </div>
                <div class="main">
                    <div class="login-content">
                        <a-form
                                :autoFormCreate="(form)=>{this.form = form}"
                                @submit.prevent="handleSubmit" class='login-form'>
                            <a-form-item
                                    fieldDecoratorId="account"
                                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入账号' }],initialValue: '123456'}">
                                <a-input size="large" placeholder='账号'>
                                <Icon slot="prefix" type="user"/>
                                </a-input>
                            </a-form-item>
                            <a-form-item
                                    style="margin-bottom: 16px;"
                                    fieldDecoratorId="password"
                                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }],initialValue: '123456'}">
                                <a-input size="large" placeholder='密码' type="password">
                                <Icon slot="prefix" type="lock"/>
                                </a-input>
                            </a-form-item>
                            <a-form-item
                                    fieldDecoratorId="remember"
                                    :fieldDecoratorOptions="{valuePropName: 'checked',initialValue: true}">
                                <Checkbox>自动登录</Checkbox>
                                <a style="float: right">忘记密码</a>
                                <Button type="primary" htmlType='submit' size="large" :loading="loading" :disabled="loading">登录</Button>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {Form, Input, Button, Modal, Checkbox, Icon, Badge} from 'ant-design-vue';
    import {Login} from '../api/user'
    import {info} from '@/api/system';
    import config from "../config/config";

    import {checkResponse, createRoute} from '../assets/js/utils'
    import {getStore} from '../assets/js/storage'

    const FormItem = Form.Item;
    export default {
        components: {
            Form,
            FormItem,
            Input,
            Button,
            Modal,
            Checkbox,
            Icon,
            Badge
        },
        data() {
            return {
                form: {},
                formData: {
                    account: '',
                    password: '',
                },
                loading: false,
            }
        },
        computed: {
            ...mapState({
                system: state => state.system,
            })
        },
        created() {
            // if (!this.system) {
                info().then(res => {
                    this.$store.dispatch('setSystem', res.data);
                });
            // }
        },
        methods: {
            handleSubmit() {
                let app = this;
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.form.setFieldsValue({
                                account: values.account,
                                password: values.password,
                            });
                            app.formData = values;
                            app.loading = true;
                            app.formData.clientid = getStore('client_id');
                            Login(app.formData).then(res => {
                                if (checkResponse(res)) {
                                    app.formData.token = res.token;
                                    const obj = {
                                        userInfo: res.data.member,
                                        token: res.token
                                    };
                                    app.$store.dispatch('SET_LOGGED', obj);
                                    app.$store.dispatch('setOrganizationList', res.data.organizationList);
                                    app.$store.dispatch('setCurrentOrganization', res.data.organizationList[0]);
                                    app.$store.dispatch('GET_MENU').then(() => {
                                            setTimeout(function () {
                                                const menu = getStore('menu', true);
                                                if (menu) {
                                                    let routes = app.$router.options.routes;
                                                    menu.forEach(function (v) {
                                                        routes[0].children.push(createRoute(v));
                                                        if (v.children) {
                                                            v.children.forEach(function (v2) {
                                                                routes[0].children.push(createRoute(v2));
                                                                if (v2.children) {
                                                                    v2.children.forEach(function (v3) {
                                                                        routes[0].children.push(createRoute(v3));
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                    app.$router.addRoutes(routes);
                                                    let redirect = app.$route.query.redirect || config.HOME_PAGE;
                                                    app.$router.push({
                                                        path: redirect
                                                    });
                                                }
                                            }, 500);

                                        }
                                    );
                                }
                                app.loading = false;
                            });
                        }
                    },
                );
            }
        }
    }
</script>
<style lang="less">
    .login {
        .container {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-direction: column;
            flex-direction: column;
            height: 100vh;
            overflow: auto;
            background: #f0f2f5;
        }
        @media (min-width: 768px) {
            .container {
                background-image: url(../assets/image/common/login.svg);
                background-repeat: no-repeat;
                background-position: center 110px;
                background-size: 100%;
            }
        }
        .content {
            padding: 140px 0 24px;
            -ms-flex: 1 1;
            flex: 1 1;
            .top {
                text-align: center;
                .header {
                    height: 44px;
                    line-height: 44px;
                    a {
                        line-height: 1.2;
                        text-decoration: none;
                    }
                }
                .logo {
                    height: 44px;
                    vertical-align: top;
                    margin-right: 10px;
                }
                .title {
                    font-size: 33px;
                    color: rgba(0, 0, 0, .85);
                    font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
                    font-weight: 600;
                    position: relative;
                    top: 2px;
                }
                .desc {
                    font-size: 14px;
                    color: rgba(0, 0, 0, .45);
                    margin-top: 12px;
                    margin-bottom: 40px;
                }
            }
            .main {
                width: 368px;
                margin: 0 auto;
                .login-content {
                    .ant-form-item {
                        margin-bottom: 24px;
                        .ant-btn {
                            width: 100%;
                            margin-top: 16px;
                        }
                    }
                    .ant-input-affix-wrapper .ant-input:not(:first-child) {
                        padding-left: 34px;
                    }
                }
            }
        }
    }
</style>
