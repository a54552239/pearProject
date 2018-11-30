<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/user/list">
                    <h1>用户列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 用户授权</h1></div>
            <div class="content-main">
                <div>
                    <Form :label-width="80"
                          label-position="left">
                        <Form-item label="所属用户组" class="auth-title">
                            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                <Checkbox :indeterminate="indeterminate" :value="checkAll"
                                          @click.prevent.native="handleCheckAll">全选
                                </Checkbox>
                            </div>
                            <Checkbox-group v-model="user_group_list" @on-change="checkAllGroupChange">
                                <Checkbox :label="group.id" v-for="(group,index) in group_list" :key="index">
                                    {{ group.title }}
                                </Checkbox>
                            </Checkbox-group>
                        </Form-item>
                        <div class="footer-item">
                            <Form-item>
                                <Button type="primary" @click="handleSubmit" :loading="sending">提交
                                </Button>
                                <router-link to="/user/list">
                                    <Button type="text">取消</Button>
                                </router-link>
                            </Form-item>
                        </div>
                    </Form>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>
<script type="es6">
    import WrapperContent from '@/components/wrapper-content.vue'
    import {getAuthGroupList, getGroupAccess, assGroupAccess} from "@/api/system";
    import $ from 'jquery'

    export default {
        components: {
            WrapperContent
        },
        data() {
            return {
                group_list: [],
                user_group_list: [],
                indeterminate: true,
                checkAll: false,
                sending: false,
            }
        },
        created: function () {
            let app = this;
            getAuthGroupList(100, 1).then(res => {
                app.group_list = res.data.list
            });
            getGroupAccess(app.$route.params.user_id).then(res => {
                if (res.data) {
                    $.each(res.data, function (k, v) {
                        app.user_group_list.push(v.id)
                    });
                }
            });
        },
        methods: {
            handleCheckAll() {
                let app = this;
                console.log(this.checkAll);
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                this.user_group_list = [];
                if (this.checkAll) {
                    $.each(this.group_list, function (k, v) {
                        app.user_group_list.push(v.id)
                    });
                }
            },
            checkAllGroupChange() {
                if (this.user_group_list.length === this.group_list.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (this.user_group_list.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            handleSubmit() {
                let app = this;
                let send_data = {
                    uid: app.$route.params.user_id,
                    group_id: JSON.stringify(app.user_group_list)
                };
                this.sending = true;
                assGroupAccess(send_data).then(res => {
                    const code = res.ret;
                    const msg = res.msg;
                    if (code !== 200) {
                        app.$Message.warning(msg);
                    } else {
                        app.$store.state.list_reload = true;
                        app.$Message.success('修改成功');
                        app.$router.push('/user/list')
                    }
                    app.sending = false;
                });
            }
        }
    }
</script>
