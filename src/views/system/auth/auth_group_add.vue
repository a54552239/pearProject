<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/system/auth_group/list">
                    <h1>用户组列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 编辑用户组</h1></div>
            <div class="content-main">
                <div class="auth-group-edit">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <Form-item label="名称">
                            <Input placeholder="请输入用户组名称" v-model="formValidate.group_title" prop="group_title"/>
                        </Form-item>
                        <Form-item label="描述" prop="group_desc">
                            <Input placeholder="请输入用户组描述" type="textarea" v-model="formValidate.group_desc"
                                   prop="group_desc"/>
                        </Form-item>
                        <Form-item label="状态" prop="gender">
                            <RadioGroup v-model="formValidate.status">
                                <Radio label="1">启用</Radio>
                                <Radio label="0">禁用</Radio>
                            </RadioGroup>
                        </Form-item>
                        <Form-item label="菜单权限" class="auth-title">
                            <Checkbox-group v-model="select_all_menu" @click.native.prevent="menuSelectAll()">
                                <Checkbox :label="1">全部菜单权限</Checkbox>
                            </Checkbox-group>
                        </Form-item>
                        <div class="edit-group-appAny" v-for="(menu,index) in menu_list_format" :key="index">
                            <h4>
                                <Checkbox-group v-model="top_menu_list">
                                    <Checkbox :label="menu.id" @click.native.prevent="menuSelect(menu.id,1)">{{
                                        menu.title }}
                                    </Checkbox>
                                </Checkbox-group>
                            </h4>
                            <div class="edit-author-appwrap">
                                <div class="edit-author-dataOverview" v-for="(sec_menu,index) in menu.nextItem"
                                     :key="index">
                                    <h5>
                                        <Checkbox-group v-model="formValidate.menus">
                                            <Checkbox :label="sec_menu.id"
                                                      @click.native.prevent="secMenuSelect(sec_menu.id,menu.id,1)">{{
                                                sec_menu.title }}
                                            </Checkbox>
                                        </Checkbox-group>
                                    </h5>
                                    <Checkbox-group v-model="formValidate.menus">
                                        <Checkbox :label="third_menu.id"
                                                  v-for="(third_menu,index) in sec_menu.nextItem" :key="index">{{
                                            third_menu.title }}
                                        </Checkbox>
                                    </Checkbox-group>
                                </div>
                            </div>
                        </div>

                        <Form-item label="数据权限" class="auth-title">
                            <Checkbox-group v-model="select_all_auth" @click.native.prevent="authSelectAll()">
                                <Checkbox :label="1">全部数据权限</Checkbox>
                            </Checkbox-group>
                        </Form-item>
                        <div class="edit-group-appAny">
                            <h4>
                                <span style="margin: 0 12px;font-size: 12px;">权限列表</span>
                            </h4>
                            <div class="edit-author-appwrap">
                                <div class="edit-author-dataOverview" v-for="(menu,index) in auth_list" :key="index">
                                    <h5>
                                        <Checkbox-group v-model="formValidate.rules">
                                            <Checkbox :label="menu.id" @click.native.prevent="authSelect(menu.id,1)">{{
                                                menu.title }}
                                            </Checkbox>
                                        </Checkbox-group>
                                    </h5>
                                    <Checkbox-group v-model="formValidate.rules">
                                        <Checkbox :label="sec_menu.id"
                                                  v-for="(sec_menu,index) in menu.nextItem" :key="index">{{
                                            sec_menu.title }}
                                        </Checkbox>
                                    </Checkbox-group>
                                </div>
                            </div>
                        </div>
                        <div class="footer-item">
                            <Form-item>
                                <Button type="primary" @click="handleSubmit('formValidate')" :loading="sending">提交
                                </Button>
                                <router-link to="/system/auth_group/list">
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
<style>
    .auth-group-edit .ivu-form-item-content {
        width: 300px;
    }

    .auth-group-edit .footer-item {
        margin-top: 15px;
    }

    .auth-title {
        margin-bottom: 0
    }

    .auth-group-edit .edit-group-appAny {
        width: 100%;
        margin-bottom: 16px;
        padding-left: 80px;
        border-radius: 4px;
    }

    .auth-group-edit .edit-group-appAny h4 {
        height: 30px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background: #f7f8f8;
        border: 1px solid #e3e8ee;
        border-bottom: 0;
    }

    .auth-group-edit .edit-author-appwrap {
        border: 1px solid #e3e8ee;
        padding-left: 10px;
        /*display: -webkit-box;*/
        /*display: -ms-flexbox;*/
        /*display: flex;*/
    }

    .auth-group-edit .edit-author-dataOverview {
        /*-webkit-box-flex: 1;*/
        /*-ms-flex: 1;*/
        /*flex: 1;*/
    }

    .auth-group-edit h5 label {
        margin: 12px 0 4px 12px;
    }

    .edit-author-dataOverview h5 .ivu-checkbox-wrapper {
        font-weight: bold;
        font-size: 14px;
    }

    .auth-group-edit .edit-author-appwrap .ivu-checkbox-group .ivu-checkbox-wrapper .ivu-checkbox {
        padding: 0 8px 0 28px;
    }

    .auth-group-edit .edit-author-dataOverview h5 .ivu-checkbox {
        padding: 0 5px !important;
    }

    .auth-group-edit .edit-group-appAny h4 .ivu-checkbox {
        margin: 0 12px;
    }

    .auth-group-edit .edit-author-appwrap .ivu-checkbox-group .ivu-checkbox-wrapper {
        width: 200px;
        /*width: 100%;*/
        display: inline-block;
        line-height: 32px;
    }
</style>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {mapState} from 'vuex'
    import {getAllAuthMenuList, getAllAuthGroupList, addGroup} from "@/api/system";

    import $ from 'jquery'

    export default {
        components: {
            WrapperContent
        },
        data() {
            const validateName = (rule, value, callback = function () {
            }) => {
                console.log(value);
                if (!value) {
                    return callback(new Error('请填写有效名称'));
                }
                callback();
            };
            return {
                menu_list_format: [],
                menu_list: [],
                // menu_model_list: JSON.parse(getStore('menu_model_list_all')),
                auth_list: [],
                select_all_menu: [],
                select_all_auth: [],
                top_menu_list: [],
                top_auth_list: false,
                formValidate: {
                    group_title: '',
                    group_desc: '',
                    status: 1,
                    menus: [],
                    rules: []
                },
                sending: false,
                ruleValidate: {
                    group_title: [
//            {validator: validateName, trigger: 'blur'}
                        {required: true, message: '组名不能为空', trigger: 'blur'}
                    ],
                    group_desc: [
                        {required: true, message: '描述不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        computed:{
            ...mapState({
                menu_model_list: state => state.menu.menu_data.menu_model_list_all
            })
        },
        created: function () {
            let app = this;
            getAllAuthMenuList().then(res => {
                let list_format = [];
                let menu_model_list = app.menu_model_list;
                app.menu_list = res.data.list;
                let menu_list = app.menu_list;
                if (menu_model_list) {
                    $.each(menu_model_list, function (k, v) {
                        list_format.push(v)
                    });
                    $.each(list_format, function (k, v) {
                        v.nextItem = []
                    })
                }
                if (menu_list) {
                    $.each(menu_list, function (k1, v1) {
                        $.each(list_format, function (k2, v2) {
                            if (v1.model == v2.name) {
                                v2.nextItem.push(v1)
                            }
                        })
                    })
                }
                app.menu_list_format = list_format
            });
            getAllAuthGroupList().then(res => {
                app.auth_list = res.data.list
            });
        },
        methods: {
            firstChange(name) {
                console.log(name);
                let app = this;
                let temp_list = [];
                $.each(app.menu_list, function (k, v) {
                    if (v.model == name) {
                        temp_list.push(v.id)
                    } else {
                        if (v.nextItem) {
                            $.each(v.nextItem, function (k2, v2) {
                                if (v2.model == name) {
                                    temp_list.push(v2.id)
                                } else {
                                    if (v2.nextItem) {
                                        $.each(v2.nextItem, function (k3, v3) {
                                            if (v3.model == name) {
                                                temp_list.push(v3.id)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                });
                const index = $.inArray(name, app.check_all_menu);
                if (index != -1) { //全选
                    $.each(temp_list, function (k, v) {
                        const index = $.inArray(v.id, app.formValidate.menus);
                        if (index == -1) {
                            app.formValidate.menus.push(v)
                        }
                    })
                } else {
                    $.each(temp_list, function (k, v) {
                        const index = $.inArray(v.id, app.formValidate.menus);
                        if (index != -1) {
                            app.formValidate.menus.splice(index, 1)
                        }
                    })
                }
            },
            menuSelectAll() {
                let app = this;
                let items = app.menu_list_format;
                if (app.select_all_menu.length > 0) {
                    app.select_all_menu = [];
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            app.menuSelect(v.id, false)
                        })
                    }
                } else {
                    app.select_all_menu.push(1);
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            app.menuSelect(v.id, true)
                        })
                    }
                }
            },
            menuSelect(menu_id, select_all) {
                let app = this;
                let items = null;
                const is_in = $.inArray(menu_id, app.top_menu_list);
                $.each(app.menu_list_format, function (k, v) {
                    if (v.id == menu_id) {
                        items = v.nextItem;
                        return false
                    }
                });
                if (select_all === false) {
                    if (is_in !== -1) {
                        app.top_menu_list.splice(is_in, 1)
                    }
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            app.secMenuSelect(v.id, menu_id, false)
                        })
                    }
                } else if (select_all === true) {
                    if (is_in === -1) {
                        app.top_menu_list.push(menu_id)
                    }
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            app.secMenuSelect(v.id, menu_id, true)
                        })
                    }
                } else {
                    if (is_in !== -1) {
                        app.top_menu_list.splice(is_in, 1);
                        if (items.length > 0) {
                            $.each(items, function (k, v) {
                                app.secMenuSelect(v.id, menu_id, false)
                            })
                        }
                    } else {
                        app.top_menu_list.push(menu_id);
                        if (items.length > 0) {
                            $.each(items, function (k, v) {
                                app.secMenuSelect(v.id, menu_id, true)
                            })
                        }
                    }
                }
            },
            secMenuSelect(menu_id, pid, select_all) {
                let app = this;
                let items = null;
                const is_in = $.inArray(menu_id, app.formValidate.menus);
                $.each(app.menu_list_format, function (k, v) {
                    if (v.id == pid) {
                        items = v.nextItem;
                        return false
                    }
                });
                if (items.length > 0) {
                    $.each(items, function (k, v) {
                        if (v.id == menu_id) {
                            items = v.nextItem;
                            return false
                        }
                    })
                }
                if (select_all === false) {
                    if (is_in !== -1) {
                        app.formValidate.menus.splice(is_in, 1)
                    }
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            const index = $.inArray(v.id, app.formValidate.menus);
                            if (index !== -1) {
                                app.formValidate.menus.splice(index, 1)
                            }
                        })
                    }
                } else if (select_all === true) {
                    if (is_in === -1) {
                        app.formValidate.menus.push(menu_id)
                    }
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            const index = $.inArray(v.id, app.formValidate.menus);
                            if (index === -1) {
                                app.formValidate.menus.push(v.id)
                            }
                        })
                    }
                } else {
                    if (is_in !== -1) {
                        app.formValidate.menus.splice(is_in, 1);
                        if (items.length > 0) {
                            $.each(items, function (k, v) {
                                const index = $.inArray(v.id, app.formValidate.menus);
                                if (index !== -1) {
                                    app.formValidate.menus.splice(index, 1)
                                }
                            })
                        }
                    } else {
                        app.formValidate.menus.push(menu_id);
                        if (items.length > 0) {
                            $.each(items, function (k, v) {
                                const index = $.inArray(v.id, app.formValidate.menus);
                                if (index === -1) {
                                    app.formValidate.menus.push(v.id)
                                }
                            })
                        }
                    }
                }
            },
            authSelectAll() {
                let app = this;
                let items = app.auth_list;
                if (app.select_all_auth.length > 0) {
                    app.select_all_auth = [];
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            app.authSelect(v.id, false)
                        })
                    }
                } else {
                    app.select_all_auth.push(1);
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            app.authSelect(v.id, true)
                        })
                    }
                }
            },
            authSelect(auth_id, select_all) {
                let app = this;
                let items = null;
                const is_in = $.inArray(auth_id, app.formValidate.rules);
                $.each(app.auth_list, function (k, v) {
                    if (v.id == auth_id) {
                        items = v.nextItem;
                        return false
                    }
                });
                if (select_all === false) {
                    if (is_in !== -1) {
                        app.formValidate.rules.splice(is_in, 1)
                    }

                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            const index = $.inArray(v.id, app.formValidate.rules);
                            if (index !== -1) {
                                app.formValidate.rules.splice(index, 1)
                            }
                        })
                    }
                } else if (select_all === true) {
                    if (is_in === -1) {
                        app.formValidate.rules.push(auth_id)
                    }
                    if (items.length > 0) {
                        $.each(items, function (k, v) {
                            const index = $.inArray(v.id, app.formValidate.rules);
                            if (index === -1) {
                                app.formValidate.rules.push(v.id)
                            }
                        })
                    }
                } else {
                    if (is_in !== -1) {
                        app.formValidate.rules.splice(is_in, 1);
                        if (items.length > 0) {
                            $.each(items, function (k, v) {
                                const index = $.inArray(v.id, app.formValidate.rules);
                                if (index !== -1) {
                                    app.formValidate.rules.splice(index, 1)
                                }
                            })
                        }
                    } else {
                        app.formValidate.rules.push(auth_id);
                        if (items.length > 0) {
                            $.each(items, function (k, v) {
                                const index = $.inArray(v.id, app.formValidate.rules);
                                if (index === -1) {
                                    app.formValidate.rules.push(v.id)
                                }
                            })
                        }
                    }
                }
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        let send_data = {
                            title: this.formValidate.group_title,
                            status: this.formValidate.status,
                            desc: this.formValidate.group_desc,
                            menus: JSON.stringify(this.formValidate.menus),
                            rules: JSON.stringify(this.formValidate.rules)
                        };
                        if (!send_data.title || send_data.title === '') {
                            app.$Message.warning('请输入名称');
                            return false;
                        }
                        this.sending = true;
                        addGroup(send_data).then(res => {
                            const content = res.data;
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg);
                            } else {
                                app.$Message.success('新增成功');
                                app.$store.state.list_reload = true;
                                app.$router.push('/system/auth_group/list')
                            }
                            app.sending = false;
                        });
                    }
                })
            }
        }
    }
</script>
