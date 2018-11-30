<template>
    <div>
        <wrapper-content pageTitle="基础配置">
            <div class="data-content">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <Form-item label="站点名称" prop="site_name">
                            <Input v-model="formValidate.site_name" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="站点状态" prop="status">
                            <RadioGroup v-model="formValidate.status">
                                <Radio :label="1">开启</Radio>
                                <Radio :label="0">关闭</Radio>
                            </RadioGroup>
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
    import WrapperContent from '../../../../components/wrapper-content.vue'
    import {getSetting,doSetting} from "@/api/system";
    import {setStore, getStore, sendAjax} from '../../../../assets/js/utils'

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
                    site_name: '',
                    status: 1,
                },
                sending: false,
                ruleValidate: {}
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData() {
                let app = this;
                getSetting('base_setting').then(res => {
                    if (res.data) {
                        app.formValidate = res.data
                    }
                });
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.sending = true;
                        doSetting('base_setting',JSON.stringify(app.formValidate)).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg);
                            } else {
                                app.$store.dispatch("SET_LIST_RELOAD", true);
                                app.$store.dispatch("SET_SYSTEM_INFO", app.formValidate);
                                app.$Message.success('保存成功')
                            }
                            app.sending = false;
                        });
                    }
                })
            },
        }
    }
</script>
