<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/system/auth_menu/list">
                    <h1>菜单列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 新增菜单</h1></div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <FormItem label="标题" prop="title">
                            <Input v-model="formValidate.title" type="text" style="width: 500px" placeholder="菜单显示的名称"/>
                        </FormItem>
                        <FormItem label="名称" prop="name">
                            <Input v-model="formValidate.name" type="text" style="width: 500px"
                                   placeholder="菜单的唯一标记，不可重复"/>
                        </FormItem>
                        <FormItem label="模块" prop="model">
                            <Select v-model="formValidate.model" placeholder="请选择" style="width: 500px">
                                <Option :value="model.name" v-for="(model,index) in menu_model" :key="index">{{
                                    model.title }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="路径" prop="path">
                            <Input v-model="formValidate.path" type="text" style="width: 500px" placeholder="菜单的访问路径"/>
                        </FormItem>
                        <FormItem label="图标" prop="icon">
                            <Input v-model="formValidate.icon" type="text" style="width: 500px"/>
                        </FormItem>
                        <FormItem label="排序" prop="sort">
                            <Input v-model="formValidate.sort" type="text" style="width: 500px"
                                   placeholder="菜单排序，数值越大越靠前"/>
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
                                <router-link to="/system/auth_menu/list">
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
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {addMenu,getAllMenuModelList} from "@/api/system";


    export default {
        components: {
            WrapperContent
        },
        data() {
            return {
                menu_model: [],
                formValidate: {
                    title: '',
                    name: '',
                    path: '',
                    sort: 0,
                    icon: '',
                    pid: this.$route.query.pid,
                    desc: '',
                    model: '',
                    status: 1,
                },
                model_list: ['user', 'system'],
                sending: false,
                ruleValidate: {
                    title: [
                        {required: true, message: '菜单标题不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '菜单名称不能为空', trigger: 'blur'}
                    ],
                    model: [
                        {required: true, message: '菜单模块不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            let app = this;
            app.$Loading.start();
            getAllMenuModelList().then(res=>{
                app.$Loading.finish();
                app.menu_model = res.data.list
            });
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        addMenu(app.formValidate).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg)
                            } else {
                                app.$store.dispatch('SET_LIST_RELOAD',true);
                                app.$Message.success('新增成功');
                                app.$router.push({path: '/system/auth_menu/list', query: app.$route.query})
                            }
                            app.sending = false;
                        }).catch(res=>{
                            app.sending = false;
                        });
                    }
                })
            },
        }
    }
</script>
