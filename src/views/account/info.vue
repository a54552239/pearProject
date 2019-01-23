<template>
    <div class="account-info">
        <wrapper-content>
            <Row>
                <i-col class="manage-contents" span="12">
                    <h4>账户信息</h4>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span>账户名称</span>
                            </i-col>
                            <i-col span="20">
                                <span>{{ user_info.account }}</span>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span>修改密码</span>
                            </i-col>
                            <i-col span="20">
                                <Form ref="passwordValidate" :model="passwordValidate" :rules="ruleValidate">
                                    <FormItem prop="old_password">
                                        <Input class="input-message" v-model="passwordValidate.old_password"
                                               type="password" placeholder="输入原密码"/>
                                    </FormItem>
                                    <FormItem prop="password">
                                        <Input class="input-message" v-model="passwordValidate.password" type="password"
                                               placeholder="新的密码"/>
                                    </FormItem>
                                    <FormItem class="input-message" prop="password_confirm">
                                        <Input type="password" v-model="passwordValidate.password_confirm"
                                               placeholder="确认密码"/>
                                    </FormItem>
                                    <FormItem>
                                        <Button type="default" :loading="sending"
                                                @click="changePassword('passwordValidate')">提交修改
                                        </Button>
                                    </FormItem>
                                </Form>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span>注册日期</span>
                            </i-col>
                            <i-col span="20">
                                <span>{{ user_info.join }}</span>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span>近期登入</span>
                            </i-col>
                            <i-col span="20">
                                <ul>
                                    <li v-for="(log,index) in login_log">{{ log.login_time }}<strong>IP：{{ log.login_ip
                                        }}</strong></li>
                                </ul>
                            </i-col>
                        </Row>
                    </div>
                </i-col>
                <i-col class="manage-contents" span="12">
                    <h4>其他信息</h4>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span>头像</span>
                            </i-col>
                            <i-col span="20">
                                <div class="content-item">
                                    <img class="content-img" id="defaultImage" :src="user_info.avatar">
                                </div>
                                <div class="content-item">
                                    <Upload :show-upload-list="false"
                                            :action="upload_config.url" :name="upload_config.name"
                                            :headers="upload_config.headers" :data="upload_config.data"
                                            :on-progress="uploadProgress"
                                            :on-success="uploadSuccess">
                                        <Button type="primary" :loading="uploading">更换头像</Button>
                                    </Upload>
                                </div>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span class="content-title">所属公司</span>
                            </i-col>
                            <i-col span="20">
                                <Input class="input-message" @on-blur="userEdit" v-model="user_info.company"
                                       icon="paper-airplane" placeholder="请输入所在公司"/>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span class="content-title">姓名/昵称</span>
                            </i-col>
                            <i-col span="20">
                                <Input class="input-message" @on-blur="userEdit" v-model="user_info.realname"
                                       icon="person" placeholder="请输入姓名/昵称"/>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span class="content-title">联系电话</span>
                            </i-col>
                            <i-col span="20">
                                <Input class="input-message" @on-blur="userEdit" v-model="user_info.phone" icon="iphone"
                                       placeholder="请输入联系电话"/>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span class="content-title">邮箱地址</span>
                            </i-col>
                            <i-col span="20">
                                <Input class="input-message" @on-blur="userEdit" icon="email" v-model="user_info.email"
                                       placeholder="请输入邮箱地址"/>
                            </i-col>
                        </Row>
                    </div>
                    <div class="user-contents">
                        <Row>
                            <i-col span="4">
                                <span class="content-title">QQ</span>
                            </i-col>
                            <i-col span="20">
                                <Input class="input-message" @on-blur="userEdit" icon="chatbubbles"
                                       v-model="user_info.qq" placeholder="请输入QQ"/>
                            </i-col>
                        </Row>
                    </div>
                </i-col>
            </Row>
        </wrapper-content>
    </div>
</template>
<style>
    .account-info .wrapper-content {
        background: #f1f1f1;
        padding: 80px 200px 60px 200px;
    }

    .account-info .layout-content {
        padding: 40px 20px;
    }

    .account-info .manage-contents {
        padding-left: 32px;
        padding-right: 32px;
    }

    .account-info .manage-contents h4 {
        display: block;
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 12px;
    }

    .user-contents {
        clear: both;
        display: block;
        border-bottom: 1px solid #e5e5e5;
        padding: 22px 0;
        font-size: 12px;
    }

    .user-contents:last-child {
        border: none;
    }

    .user-contents ul li {
        list-style: none;
        clear: both;
        display: block;
        zoom: 1;
        padding: 6px 0;
        position: relative;
    }

    .user-contents ul li strong {
        font-weight: 400;
        padding-left: 30px;
    }

    .user-contents .content-item {
        display: inline-block;
        padding-right: 15px;
    }

    .user-contents .content-title {
        line-height: 2.5;
    }

    .user-contents .content-img {
        width: 105px;
        border-radius: 100px;
    }

    .user-contents .input-message {
        width: 250px;
    }
</style>
<script type="es6">
    import WrapperContent from '../../components/wrapper-content.vue'
    import * as utils from '../../assets/js/utils'
    import {getInfoByToken, editUser,changePassword} from "@/api/user";


    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                uploading: false,
                sending: false,
                user_info: {},
                login_log: [],
                upload_config: {
                    url: utils.getApiUrl('User_User.uploadAvatarImg'),
                    headers: {
                        token: utils.getStore('token')
                    },
                    name: 'file',
                },
                passwordValidate: {
                    old_password: '',
                    password: '',
                    password_confirm: ''
                },
                ruleValidate: {
                    old_password: [
                        {required: true, message: '原密码不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '新的密码不能为空', trigger: 'blur'}
                    ],
                    password_confirm: [
                        {required: true, message: '确认密码不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getUserInfo()
        },
        methods: {
            getUserInfo() {
                let app = this;
                getInfoByToken().then(res => {
                    app.user_info = res.data.user_info;
                    app.login_log = res.data.login_log
                });
            },
            userEdit() {
                let app = this;
                const data = {
                    user_id: app.user_info.id,
                    company: app.user_info.company,
                    mobile: app.user_info.mobile,
                    realname: app.user_info.realname,
                    email: app.user_info.email,
                    qq: app.user_info.qq
                };
                editUser(data).then(res => {
                    app.$Message.success('修改成功');
                });
            },
            uploadProgress(event, file, fileList) {
                this.uploading = true
            },
            uploadSuccess(response, file, fileList) {
                this.uploading = false;
                this.user_info.avatar = response.data;
                this.$store.state.user_info.avatar = this.user_info.avatar
            },
            changePassword(name) {
                let app = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        app.sending = true;
                        changePassword(app.passwordValidate).then(res => {
                            app.sending = false
                            if (res.ret === 200) {
                                app.$Message.success('修改成功');
                                app.getUserInfo()
                            }
                        });
                    }
                })
            }
        }
    }
</script>
