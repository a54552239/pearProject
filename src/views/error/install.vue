<template>
    <div class="install" style="height: 100%;">
        <user-layout desc="正在安装Pear Project项目管理系统">
            <div class="main">
                <a-form
                        layout="horizontal"
                        class="user-layout-login"
                        @submit.prevent="handleSubmit"
                        :form="form"
                >

                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="数据库地址"
                    >
                        <a-input
                                size="large"
                                type="text"
                                placeholder="MySQL 数据库地址"
                                v-decorator="[
                                'mysqlHost',
                                {rules: [{ required: true, message: '请输入MySQL 数据库地址' }], validateTrigger: 'change',initialValue: '127.0.0.1'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="数据库名"
                    >
                        <a-input
                                size="large"
                                type="text"
                                placeholder="MySQL 数据库名"
                                v-decorator="[
                                'mysqlDatabase',
                                {rules: [{ required: true, message: '请输入MySQL 数据库名' }], validateTrigger: 'change',initialValue: 'pearproject'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="用户名"
                    >
                        <a-input size="large" type="text" placeholder="MySQL 用户名"
                                 v-decorator="[
                                'mysqlUsername',
                                {rules: [{ required: true, message: '请输入MySQL 用户名' }], validateTrigger: 'change',initialValue: 'root'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="密码"
                    >
                        <a-input size="large" type="password" placeholder="MySQL 密码"
                                 v-decorator="[
                                'mysqlPassword',
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="数据表前缀"
                    >
                        <a-input size="large" type="text" placeholder="MySQL 数据表前缀"
                                 v-decorator="[
                                'mysqlPrefix',
                                {rules: [{ required: true, message: '请输入MySQL 数据表前缀' }], validateTrigger: 'change',initialValue: 'pear_'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="端口号"
                    >
                        <a-input size="large" type="text" placeholder="MySQL 端口号"
                                 v-decorator="[
                                'mysqlHostport',
                                {rules: [{ required: true, message: '请输入MySQL 端口号' }], validateTrigger: 'change',initialValue: '3306'}
                            ]">
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            label="清除数据"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                    >
                        <a-checkbox
                                v-decorator="[
                                'initData',
                                {initialValue: false}
                            ]"
                        >
                            勾选后将清除预置数据
                        </a-checkbox>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18, offset: 6}"
                            style="margin-top:24px">
                        <a-button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                class="middle-btn"
                                :loading="loading"
                                :disabled="loading"
                                block
                        >
                            <span v-if="!loading">立即安装</span>
                            <span v-else>正在安装，请稍后...</span>
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </user-layout>
    </div>
</template>
<script>
    import {checkInstall, install} from "../../api/common/common";
    import {checkResponse} from "../../assets/js/utils";
    import UserLayout from "../../components/layout/UserLayout";

    export default {
        components: {
            UserLayout
        },
        data() {
            return {
                loading: false,
                form: this.$form.createForm(this),
                installInfo: {
                    mysqlHost: '',
                    mysqlDatabase: '',
                    mysqlUsername: '',
                    mysqlPassword: '',
                    mysqlPrefix: '',
                    mysqlHostport: '',
                    initData: false,
                }
            }
        },
        created() {
            this.checkInstall();
        },
        mounted() {
            setTimeout(() => {
                this.form = this.$form.createForm(this);
            }, 500)
        },
        methods: {
            handleSubmit() {
                const app = this;
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.installInfo = values;
                            app.install();
                        }
                    }
                );
            },
            install() {
                this.loading = true;
                this.installInfo.initData = this.installInfo.initData ? 1 : 0;
                install(this.installInfo).then(res => {
                    this.loading = false;
                    if (!checkResponse(res)) {
                        return false;
                    }
                    this.$router.push({name: 'login'});
                }).catch(() => {
                    this.loading = false;
                });
            },
            checkInstall() {
                checkInstall().then(res => {
                    if (checkResponse(res)) {
                        this.$router.push({name: 'login'});
                    }
                });
            },
        }
    }
</script>
