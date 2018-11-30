<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/system/menu_model/list">
                    <h1>菜单模块列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 新增菜单模块</h1></div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <FormItem label="标题" prop="title">
                            <Input v-model="formValidate.title" type="text" style="width: 500px"
                                   placeholder="菜单模块显示的名称"/>
                        </FormItem>
                        <FormItem label="名称" prop="name">
                            <Input v-model="formValidate.name" type="text" style="width: 500px"
                                   placeholder="菜单模块的唯一标记，不可重复"/>
                        </FormItem>
                        <FormItem label="路径" prop="path">
                            <Input v-model="formValidate.path" type="text" style="width: 500px"
                                   placeholder="菜单模块的访问路径"/>
                        </FormItem>
                        <FormItem label="图标" prop="icon">
                            <Input v-model="formValidate.icon" type="text" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="排序" prop="sort">
                            <Input v-model="formValidate.sort" type="text" style="width: 500px"
                                   placeholder="菜单模块排序，数值越大越靠前"/>
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
    import {addMenuModel} from "@/api/system";

    export default {
        components: {
            WrapperContent
        },
        data() {
            return {
                formValidate: {
                    title: '',
                    name: '',
                    path: '',
                    sort: 0,
                    icon: '',
                    desc: '',
                    status: 1,
                },
                model_list: ['user', 'system'],
                sending: false,
                ruleValidate: {
                    title: [
                        {required: true, message: '菜单模块标题不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '菜单模块名称不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        addMenuModel(app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg)
                            } else {
                                app.$store.state.list_reload = true;
                                app.$Message.success('新增成功');
                                app.$router.push({path: '/system/menu_model/list', query: app.$route.query})
                            }
                            app.sending = false;
                        });
                    }
                })
            },
        }
    }
</script>
