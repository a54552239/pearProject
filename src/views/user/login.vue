<template>
    <div class="login-page">
        <div class="login-card">
            <Card class="main">
                <h2 class="title">登录系统帐号</h2>
                <Form ref="loginValidate" :model="loginValidate" :rules="ruleValidate" label-position="top"
                      class="submit-form">
                    <Form-item label="账号：" prop="account">
                        <Input size="large" v-model="loginValidate.account" clearable/>
                    </Form-item>
                    <Form-item label="密码：" prop="password">
                        <Input type="password" size="large" v-model="loginValidate.password" clearable/>
                    </Form-item>
                    <div class="sub text-center">
                        <Button size="large" class="login-btn" type="primary" long :loading="sending"
                                @click="handleSubmit('loginValidate')">登&nbsp;&nbsp;录
                        </Button>
                    </div>
                    <div class="pro">
                        <div class="direct">
                            <Checkbox-group>
                                <Checkbox label="15天自动登录" v-model="loginValidate.remember"></Checkbox>
                            </Checkbox-group>
                        </div>
                    </div>
                    <!-- <div class="others text-center">
                         <div class="text">使用第三方登录</div>
                         <div class="party-link">
                             <span class="icon icon-weibo"><img src="https://img.wdstatic.cn/www-nd/images/account/weibo-normal.23a661c9.svg" alt="" width="29"></span>
                             <span class="icon icon-kezhan"><img src="https://css.wdstatic.cn/www-nd/images/account/kezhan-normal.96ebce09.svg" alt=""></span>
                         </div>
                     </div>-->
                </Form>
            </Card>
        </div>
    </div>
</template>
<style lang="less">
    .login-page {
        background: #FFF;
        height: 100%;
        position: absolute;
        width: 100%;
    }
    .login-card {
        width: 840px;
        height: 482px;
        margin: 100px auto;
        border-radius: 3px;
        box-shadow: 0 0 4px rgba(0, 0, 0, .2);
        line-height: 1;
        background: url("http://static.vilson.xyz/signup_bg-5ff4429982.jpg");
        /*background: url("http://static.vilson.xyz/login_bg-340082e72e.jpg");*/
        .main {
            float: left;
            border: 1px solid #e5e5e5;
            border-radius: 3px;
            background-color: #fff;
            box-shadow: 2px 2px 56px rgba(0, 0, 0, .13);
            -webkit-box-shadow: 2px 2px 56px rgba(0, 0, 0, .13);
            width: 450px;
            height: 564px;
            top: -40px;
            padding-left: 55px;
            margin-left: 340px;
            position: relative;
            .title {
                margin: 50px 0 0;
                color: #212121;
                font-size: 30px;
                font-weight: 300;
            }
            .submit-form {
                margin-top: 78px;
                width: 315px;
            }
            .others {
                padding-top: 18px;
                border-top: 1px solid #e5e5e5;
                color: #ccc;
                font-size: 13px;
                letter-spacing: 1px;
                cursor: pointer;
                .party-link {
                    width: 198px;
                    margin: 15px auto 0;
                }
            }
        }
    }

    .sub {
        margin-top: 36px;
        padding-bottom: 20px;
    }
    .submit-form{
        .pro {
            text-align: center;
            font-size: 12px;
            color: #666;
            letter-spacing: 1px;
            margin-bottom: 65px;
        }
    }
    .login-btn {
        padding-bottom: 6px;
        font-size: 16px;
    }
</style>
<script>
    import {getStore, setStore} from '../../assets/js/storage'
    import {mapState} from 'vuex'
    import {Login, getUserMenu, getUserAuth} from '@/api/user'
    import {getSetting} from '@/api/system'
    import {getNotifyList} from '@/api/common'
    import {bindClientId} from "../../api/common";

    export default {
        computed: {
            ...mapState({
                last_path: state => state.last_path
            })
        },
        data() {
            const validateName = (rule, value, callback = function () {
            }) => {
                if (!value) {
                    return callback(new Error('请填写有效账户'));
                }
                callback();
            };
            const validatePassword = (rule, value, callback = function () {
            }) => {
                if (!value || value.length < 6) {
                    return callback(new Error('密码区分大小写，不少于6位'));
                }
                callback();
            };
            return {
                img_path: '',
                sending: false,
                loginValidate: {
                    account: '',
                    password: '',
                    remember: false
                },
                ruleValidate: {
                    account: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.sending = true;
                        let app = this;
                        app.sending = true;
                        let token = '';
                        let duration = 0;
                        Login(app.loginValidate).then(res => {
                            const content = res.data;
                            const code = res.ret;
                            const msg = res.msg;
                            if (code == 200){
                                if (app.loginValidate.remember) {
                                    duration = 15 * 24;
                                }
                                token = content.token;
                                const user_info = content.user_info;
                                setStore('token', token, true, duration);
                                setStore('account', content.account, true, duration);
                                if (user_info !== '' || user_info !== null) {
                                    app.$store.dispatch('SET_LOGGED', {
                                        token: token,
                                        duration: duration,
                                        user_info: user_info
                                    });
                                }
                                bindClientId(getStore('client_id'),user_info.id);
                                getSetting('base_setting').then(setting => {
                                    if (setting.data) {
                                        app.$store.dispatch('SET_SYSTEM_INFO', setting.data);
                                    }
                                }).catch(res=>{
                                    app.sending = false;
                                });
                                getUserMenu().then(user_menu => {
                                    const menu = {
                                        menu_list: user_menu.data.menu_list,
                                        menu_list_old: user_menu.data.menu_list_old,
                                        menu_model_list: user_menu.data.menu_model_list,
                                        menu_model_list_all: user_menu.data.menu_model_list_all,
                                        menu_model: user_menu.data.menu_model_list[0]['id'],
                                    };
                                    app.$store.dispatch('UPDATE_MENU_DATA', menu);
                                    const menu_model_list = user_menu.data.menu_model_list;
                                    getUserAuth().then(auth => {
                                        app.sending = false;
                                        setStore('auth_list', auth.data);
                                        app.$Message.success('登录成功~!');
                                        app.getNotifyNoReadList();
                                        // app.$router.push(menu_model_list[0]['path'])
                                        app.$router.push(app.last_path)
                                    });
                                }).catch(res=>{
                                    app.sending = false;
                                });
                            }else{
                                app.sending = false;
                            }
                        }).catch(res=>{
                            app.sending = false;
                        });
                    }
                })
            },
            getNotifyNoReadList() {
                let app = this;
                getNotifyList().then(res => {
                    app.$store.dispatch('UPDATE_NOTIFY_NO_READ_LIST', res.data.list);
                    app.$store.dispatch('UPDATE_NOTIFY_NO_READ_COUNT', res.data.count);
                });
            }
        }
    }
</script>
