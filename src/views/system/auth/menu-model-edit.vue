<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/system/menu_model/list">
                    <h1>菜单列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 新增菜单</h1></div>
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
                        <FormItem label="路径" prop="path">
                            <Input v-model="formValidate.path" type="text" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="图标" prop="icon">
                            <Input v-model="formValidate.icon" type="text" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="排序" prop="sort">
                            <Input v-model="formValidate.sort" type="text" style="width: 500px"/>
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
                                <router-link to="/system/menu_model/list">
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
    import {getMenuModel, editMenuModel} from "@/api/system";


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
                    path: '',
                    sort: 0,
                    icon: '',
                    desc: '',
                    status: 1,
                },
                parent_title: '',
                model_list: ['user', 'system'],
                sending: false,
                ruleValidate: {
                    title: [
                        {required: true, message: '菜单标题不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '菜单名称不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            let app = this;
            getMenuModel(app.$route.params.id).then(res => {
                app.parent_title = res.data.parent_title;
                app.formValidate.id = res.data.id;
                app.formValidate.title = res.data.title;
                app.formValidate.name = res.data.name;
                app.formValidate.path = res.data.path;
                app.formValidate.sort = res.data.sort;
                app.formValidate.icon = res.data.icon;
                app.formValidate.desc = res.data.model_desc;
                app.formValidate.status = res.data.status
            });
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        editMenuModel(app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg)
                            } else {
                                app.$store.state.list_reload = true;
                                app.$Message.success('编辑成功');
                                app.$router.push({path: '/system/menu_model/list'})
                            }
                            app.sending = false;
                        });
                    }
                })
            },
        }
    }
</script>
