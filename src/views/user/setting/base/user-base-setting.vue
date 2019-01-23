<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <h1>用户配置</h1>
                <h1>&nbsp;&gt; 基本配置</h1>
            </div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="135"
                          label-position="left">
                        <Form-item label="用户名最小长度" prop="user_name_length_min">
                            <Input v-model="formValidate.user_name_length_min" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户名最大长度" prop="user_name_length_max">
                            <Input v-model="formValidate.user_name_length_max" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户昵称最小长度" prop="realname_length_min">
                            <Input v-model="formValidate.realname_length_min" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户昵称最大长度" prop="realname_length_max">
                            <Input v-model="formValidate.realname_length_max" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户密码最小长度" prop="password_length_min">
                            <Input v-model="formValidate.password_length_min" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户密码最大长度" prop="password_length_max">
                            <Input v-model="formValidate.password_length_max" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="默认用户组" class="auth-title">
                            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;width: 500px">
                                <Checkbox :indeterminate="indeterminate" :value="checkAll"
                                          @click.prevent.native="handleCheckAll">全选
                                </Checkbox>
                            </div>
                            <Checkbox-group style="width: 500px;margin-bottom: 15px;"
                                            v-model="formValidate.default_user_group_list"
                                            prop="default_user_group_list" @on-change="checkAllGroupChange">
                                <Checkbox :label="group.id" v-for="(group,index) in group_list" :key="index">
                                    {{ group.title }}
                                </Checkbox>
                            </Checkbox-group>
                        </Form-item>
                        <div class="footer-item">
                            <Form-item>
                                <Button type="primary" @click="handleSubmit('formValidate')" :loading="sending">提交
                                </Button>
                            </Form-item>
                        </div>
                    </Form>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>
<script>
    import WrapperContent from '@/components/wrapper-content.vue'
    import {getUserSetting, doUserSetting} from "@/api/user";
    import {getAuthGroupList} from "@/api/system";
    import $ from 'jquery'

    export default {
        components: {
            WrapperContent
        },
        data() {
            return {
                indeterminate: true,
                checkAll: false,
                group_list: [],
                formValidate: {
                    user_name_length_min: 3,
                    user_name_length_max: 6,
                    realname_length_min: 3,
                    realname_length_max: 6,
                    password_length_min: 6,
                    password_length_max: 18,
                    default_user_group_list: [],
                },
                sending: false,
                ruleValidate: {
                    user_name_length_min: [
                        {required: true, message: '请输入用户名最小长度', trigger: 'blur'},
                    ],
                    user_name_length_max: [
                        {required: true, message: '请输入用户名最大长度', trigger: 'blur'}
                    ],
                    realname_length_min: [
                        {required: true, message: '请输入用户昵称最小长度', trigger: 'blur'}
                    ],
                    realname_length_max: [
                        {required: true, message: '请输入用户昵称最大长度', trigger: 'blur'}
                    ],
                    password_length_min: [
                        {required: true, message: '请输入用户密码最小长度', trigger: 'blur'}
                    ],
                    password_length_max: [
                        {required: true, message: '请输入用户昵称最大长度', trigger: 'blur'}
                    ],
                    default_user_group_list: [
                        {required: true, type: 'array', min: 1, message: '请至少选择一个默认用户组', trigger: 'change'}
                    ],
                }
            }
        },
        created() {
            let app = this;
            getUserSetting('base_setting').then(res => {
                if (res.data) {
                    app.formValidate = res.data
                }
            });
            getAuthGroupList(100,1).then(res => {
                app.group_list = res.data.list
            });
        },
        methods: {
            handleCheckAll() {
                let app = this;
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                this.formValidate.default_user_group_list = [];
                if (this.checkAll) {
                    $.each(this.group_list, function (k, v) {
                        app.formValidate.default_user_group_list.push(v.id)
                    });
                }
            },
            checkAllGroupChange() {
                if (this.formValidate.default_user_group_list.length === this.group_list.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (this.formValidate.default_user_group_list.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        doUserSetting('base_setting', JSON.stringify(app.formValidate)).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg);
                            } else {
                                app.$store.state.list_reload = true;
                                app.$Message.success('保存成功')
                            }
                            app.sending = false;
                        });
                    }
                })
            }
        }
    }
</script>
