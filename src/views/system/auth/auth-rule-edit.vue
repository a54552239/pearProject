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
                            {{ parent_title }}
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
    import {getRule, editRule} from "@/api/system";


    export default {
        components: {
            WrapperContent
        },
        data() {
            return {
                formValidate: {
                    id: 0,
                    title: '',
                    name: '',
                    pid: 0,
                    desc: '',
                    status: 1,
                },
                parent_title: '',
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
        created() {
            let app = this;
            getRule(app.$route.params.id).then(res => {
                app.parent_title = res.data.parent_title;
                app.formValidate.id = res.data.id;
                app.formValidate.title = res.data.title;
                app.formValidate.name = res.data.name;
                app.formValidate.pid = res.data.pid;
                app.formValidate.desc = res.data.rule_desc;
                app.formValidate.status = res.data.status
            });
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        editRule(app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg)
                            } else {
                                app.$store.state.list_reload = true;
                                app.$Message.success('编辑成功');
                                app.$router.push({path: '/system/auth_rule/list'})
                            }
                            app.sending = false;

                        }).catch(res => {

                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg)
                            } else {
                                app.$store.state.list_reload = true;
                                app.$Message.success('编辑成功');
                                app.$router.push({path: '/system/auth_rule/list'})
                            }
                            app.sending = false;
                        });
                    }
                })
            },
        }
    }
</script>
