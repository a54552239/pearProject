<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/system/auth_rule/list">
                    <h1>权限列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 新增权限</h1></div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <FormItem label="标题" prop="title">
                            <Input v-model="formValidate.title" type="text" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="名称" prop="name">
                            <Input v-model="formValidate.name" type="text" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="上级">
                            用户列表
                        </FormItem>
                        <FormItem label="描述" prop="desc">
                            <Input v-model="formValidate.desc" type="textarea" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="状态" prop="status">
                            <RadioGroup v-model="formValidate.status">
                                <Radio label="1">启用</Radio>
                                <Radio label="0">禁用</Radio>
                            </RadioGroup>
                        </FormItem>
                        <div class="footer-item">
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formValidate')" :loading="sending">提交
                                </Button>
                                <router-link to="/system/auth_rule/list">
                                    <Button type="text">取消</Button>
                                </router-link>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>
<script>
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {addRule} from "@/api/system";


    export default {
        components: {
            WrapperContent
        },
        data() {
            return {
                formValidate: {
                    title: '',
                    name: '',
                    pid: this.$route.query.pid,
                    desc: '',
                    status: 1,
                },
                sending: false,
                ruleValidate: {
                    title: [
                        {required: true, message: '权限标题不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '权限名称不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        addRule(app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg)
                            } else {
                                app.$store.state.list_reload = true;
                                app.$Message.success('新增成功');
                                app.$router.push({path: '/system/auth_rule/list', query: app.$route.query})
                            }
                            app.sending = false;
                        });
                    }
                })
            },
        }
    }
</script>
