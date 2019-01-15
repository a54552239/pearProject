<template>
    <div class="admin-menu">
        <wrapper-content>
            <div class="action">
                <Button type="primary" icon="plus" @click="rowClick(null,'new')">添加</Button>
            </div>
            <Table :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="false">
                <template slot="url" slot-scope="text,record,index">
                    <span v-if="record.params">{{record.url + '/' + record.params}}</span>
                    <span v-else>{{record.url}}</span>
                    <span v-if="record.values !== null && record.values !== ''"> - {{record.values}}</span>
                </template>
                <template slot="status" slot-scope="text,record,index">
                    <span class="success-color" v-if="record.status">使用中</span>
                    <span v-else>已禁用</span>
                </template>
                <template slot="action" slot-scope="text,record,index">
                    <a :disabled="record.dept == 3" @click="rowClick(record,'add')">添加下级</a>
                    <Divider type="vertical"/>
                    <a @click="rowClick(record,'edit')">编辑</a>
                    <Divider type="vertical"/>
                    <a @click="rowClick(record,'status')"><span v-if="record.status">禁用</span><span v-else>启用</span></a>
                    <Divider type="vertical"/>
                    <a @click="rowClick(record,'del')">删除</a>
                </template>
            </Table>
        </wrapper-content>
        <Modal
                v-model="actionInfo.modalStatus"
                :width="800"
                :title="actionInfo.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <Form
                    :autoFormCreate="(form)=>{this.form = form}"
                    @submit.prevent="handleSubmit"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <FormItem
                        :form="form"
                        label='名称'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="title"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入名称' }]}"
                        help='必填，请填写菜单名称（如：系统管理），建议字符不要太长，一般4-6个汉字'
                >
                    <Input placeholder='菜单名称'/>
                </FormItem>
                    </a-col>
                    <a-col :span="12">
                <FormItem
                        label='地址'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="url"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入路由地址' }]}"
                        help='必填，请填写路由地址（如：admin/user/index，对应的文件位于：views/admin/user/index.vue）。如果是上级菜单时，请填写"#"符号，不要填写路由地址。'
                >
                    <Input placeholder='路由地址'/>
                </FormItem>
                    </a-col>
                    <a-col :span="12">
                <FormItem
                        label='路径'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="file_path"
                        help='选填，文件路径。默认与地址相同，特殊的文件路径可以在此定义'
                >
                    <Input placeholder='路由地址'/>
                </FormItem>
                    </a-col>
                    <a-col :span="12">
                <a-form-item
                        label='节点'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="node"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请绑定权限节点' }]}"
                        help='必填，将当前路由与权限节点进行绑定，没有该节点权限的菜单将会被隐藏。不进行绑定，请填写"#"符号。'
                >
                    <a-select
                            showSearch
                            placeholder="请选择权限节点"
                            :filterOption="false"
                            @search="fetchNode"
                            @change="handleChange"
                            :notFoundContent="fetching ? undefined : null"
                    >
                        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                        <a-select-option v-for="node in nodeList" :key="node.node">{{node.node}} - {{node.title}}
                        </a-select-option>
                    </a-select>
                    <!-- <a-tree-select
                             showSearch
                             treeNodeFilterProp="title"
                             :showCheckedStrategy="SHOW_ALL"
                             treeNodeLabelProp="node"
                             :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                             :treeData="nodeList"
                             placeholder='请选择权限节点'
                             treeDefaultExpandAll
                     >
                     </a-tree-select>-->
                </a-form-item>
                    </a-col>
                    <a-col :span="12">
                <FormItem
                        label='排序'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="sort"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入排序' }],initialValue:0}"
                        help='必填，整数。数字越小越靠前，最小值为0。'
                >
                    <Input placeholder='排序'/>
                </FormItem>
                    </a-col>
                    <a-col :span="12">
                <FormItem
                        label='参数'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="params"
                        help='选填，请填写路由的额外参数（如：:id，则路由为：admin/user/index/:id）'
                >
                    <Input placeholder='额外参数'/>
                </FormItem>
                    </a-col>
                    <a-col :span="12">
                <FormItem
                        label='数值'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="values"
                        help='选填，请填写路由的额外参数数值（如路由为 admin/user/index/:id，参数值为 1，则最终的链接会解析成：admin/user/index/1）'
                >
                    <Input placeholder='参数数值'/>
                </FormItem>
                    </a-col>
                    <a-col :span="12">
                <FormItem
                        label='图标'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="icon"
                        help='可选，设置菜单选项前置图标'
                >
                    <Input placeholder='前置图标'/>
                </FormItem>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <FormItem
                                label='侧栏'
                                :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 21 }"
                                fieldDecoratorId="show_slider"
                                :fieldDecoratorOptions="{valuePropName:'checked',initialValue: true}"
                                help='可选，取消勾选，则该页面将不显示侧边菜单栏'
                        >
                            <Checkbox>是否显示侧栏</Checkbox>
                        </FormItem>
                    </a-col>
                    <a-col :span="12">
                        <FormItem
                                label='内页'
                                :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 21 }"
                                fieldDecoratorId="is_inner"
                                :fieldDecoratorOptions="{valuePropName:'checked',initialValue: false}"
                                help='可选，选中为菜单内页，将不会显示在导航菜单上。用于菜单选中项渲染判断'
                        >
                            <Checkbox>是否内页</Checkbox>
                        </FormItem>
                    </a-col>
                </a-row>
                <FormItem
                >
                    <div class="action-btn" style="text-align: center">
                        <Button type="primary" htmlType='submit'
                                size="large"
                                :loading="actionInfo.confirmLoading"
                                class="middle-btn">保存
                        </Button>
                        <Button class="middle-btn" size="large" @click="actionInfo.modalStatus = false">取消
                        </Button>
                    </div>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {Table, Button, Divider, Modal, Form, Input, Checkbox} from 'ant-design-vue';
    import {getMenu, doMenu, forbid, resume, delMenu} from '@/api/menu';
    import {createRoute, checkResponse} from '@/assets/js/utils';
    import {getStore} from '@/assets/js/storage';
    import {allList} from "@/api/node";
    import debounce from 'lodash/debounce';

    const FormItem = Form.Item;

    const columns = [{
        title: '名称',
        dataIndex: 'title',
        width: '15%',
    }, {
        title: '地址',
        dataIndex: 'url',
        width: '20%',
        scopedSlots: {
            customRender: 'url'
        },
    }, {
        title: '路径',
        dataIndex: 'file_path',
    }, {
        title: '节点',
        width: '20%',
        dataIndex: 'node',
    }, {
        title: '排序',
        dataIndex: 'sort',
    }, {
        title: '类型',
        dataIndex: 'innerText',
    },
    //     {
    //     title: '状态',
    //     dataIndex: 'statusText',
    //     width: '15%',
    //     scopedSlots: {
    //         customRender: 'status'
    //     },
    // },
        {
        title: '操作',
        dataIndex: 'id',
        scopedSlots: {
            customRender: 'action'
        }
    }];
    export default {
        components: {
            Table,
            Button,
            Divider,
            Modal,
            Form,
            FormItem,
            Input,
            Checkbox
        },
        data() {
            this.lastFetchId = 0;
            this.fetchNode = debounce(this.fetchNode, 800);
            return {
                columns,
                data: [],
                dataSource: [],
                nodeList: [],
                loading: true,
                fetching: false,
                newMenu: null,
                form: {},
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑菜单',
                    okText: '确定',
                    cancelText: '放弃',
                }
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let app = this;
                app.loading = true;
                getMenu().then(res => {
                    app.loading = false;
                    let list = res.data;
                    list.forEach(function (v) {
                        v.key = v.id;
                        v.dept = 1;
                        if (v.children) {
                            v.children.forEach(function (v2) {
                                v2.key = v2.id;
                                v2.dept = 2;
                                if (v2.children) {
                                    v2.children.forEach(function (v3) {
                                        v3.key = v3.id;
                                        v3.dept = 3;
                                    })
                                }
                            })
                        }
                    });
                    app.dataSource = list;
                });
            },
            rowClick(record, action) {
                let app = this;
                app.newMenu = null;
                app.nodeList = [];
                if (action == 'add' || action == 'edit' || action == 'new') {
                    setTimeout(function () {
                        app.form && app.form.resetFields();
                    }, 0);
                    app.actionInfo.modalStatus = true;
                    app.actionInfo.modalTitle = '添加菜单';
                    if (action == 'edit') {
                        //modal没显示之前不会实例化modal子元素，延迟处理
                        setTimeout(function () {
                            app.actionInfo.modalTitle = '编辑菜单';
                            app.form.setFieldsValue({
                                title: record.title,
                                file_path: record.file_path,
                                url: record.url,
                                sort: record.sort,
                                node: record.node,
                                params: record.params,
                                values: record.values,
                                icon: record.icon,
                                is_inner: record.is_inner,
                                show_slider: record.show_slider,
                            });
                            app.newMenu = record;
                        }, 0);
                    } else if (action == 'add') {
                        app.newMenu = {
                            status: 1,
                            dept: parseInt(record.dept) + 1
                        };
                        app.newMenu.pid = record.id;
                    } else {
                        app.newMenu = {
                            status: 1,
                            dept: 1,
                            pid: 0
                        };
                    }
                } else if (action == 'status') {
                    const status = record.status;
                    record.status = Number(!status);
                    status ? forbid(record.id, record.status) : resume(record.id, record.status);
                } else if (action == 'del') {
                    const confirm = Modal.confirm({
                        title: '确定要删除此菜单?',
                        content: '删除后不可恢复，且子菜单会被同时删除',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '放弃',
                        onOk() {
                            delMenu(record.id).then(res => {
                                app.dataSource.forEach(function (v, k) {
                                    if (v.id == record.id) {
                                        app.dataSource.splice(k, 1);
                                        return;
                                    }
                                    if (v.children) {
                                        v.children.forEach(function (v2, k2) {
                                            if (v2.id == record.id) {
                                                v.children.splice(k2, 1);
                                                return;
                                            }
                                            if (v2.children) {
                                                v2.children.forEach(function (v3, k3) {
                                                    if (v3.id == record.id) {
                                                        v2.children.splice(k3, 1);
                                                        return;
                                                    }
                                                })
                                            }
                                        });
                                    }
                                });
                            });
                            return Promise.resolve();
                        }
                    })
                }
            },
            handleSubmit() {
                let app = this;
                app.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.handleOk();
                        }
                    })
            },
            handleOk() {
                let app = this;
                app.actionInfo.confirmLoading = true;
                let obj = app.form.getFieldsValue();
                if (app.newMenu.id) {
                    //编辑
                    obj.id = app.newMenu.id;
                } else {
                    //新增
                    Object.assign(obj, app.newMenu);
                }
                doMenu(obj).then(res => {
                    app.actionInfo.confirmLoading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    // app.freshMenu();
                    if (app.newMenu.id) {
                        app.newMenu.title = obj.title;
                        app.newMenu.url = obj.url;
                        app.newMenu.sort = obj.sort;
                        app.newMenu.file_path = obj.file_path;
                        app.newMenu.node = obj.node;
                        app.newMenu.params = obj.params;
                        app.newMenu.values = obj.values;
                        app.newMenu.icon = obj.icon;
                        app.newMenu.is_inner = !!obj.is_inner;
                        app.newMenu.show_slider = !!obj.show_slider;
                        app.dataSource.forEach(function (v) {
                            if (v.id == obj.id) {
                                Object.assign(v, obj);
                                return;
                            }
                            if (v.children) {
                                v.children.forEach(function (v2) {
                                    if (v2.id == obj.id) {
                                        Object.assign(v2, obj);
                                        return;
                                    }
                                    if (v2.children) {
                                        v2.children.forEach(function (v3) {
                                            if (v3.id == obj.id) {
                                                Object.assign(v3, obj);
                                                return;
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    } else {
                        obj = res.data;
                        obj.key = res.data.id;
                        obj.is_inner = !!res.data.is_inner;
                        obj.show_slider = !!res.data.show_slider;
                        obj.dept = app.newMenu.dept;
                        if (app.newMenu.pid == 0) {
                            app.dataSource.push(obj);
                        } else {
                            app.dataSource.forEach(function (v) {
                                if (v.id == obj.pid) {
                                    if (v.children) {
                                        v.children.push(obj);
                                    } else {
                                        v.children = [obj];
                                    }
                                    return;
                                }
                                if (v.children) {
                                    v.children.forEach(function (v2) {
                                        if (v2.id == obj.pid) {
                                            if (v2.children) {
                                                v2.children.push(obj);
                                            } else {
                                                v2.children = [obj];
                                            }
                                            return;
                                        }
                                        if (v2.children) {
                                            v2.children.forEach(function (v3) {
                                                if (v3.id == obj.id) {
                                                    if (v3.children) {
                                                        v3.children.push(obj);
                                                    } else {
                                                        v3.children = [obj];
                                                    }
                                                    return;
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    }
                    app.form.resetFields();
                    app.newMenu = null;
                    app.actionInfo.modalStatus = false;
                });
            },
            handleChange(value) {
                this.nodeList = [];
                this.fetching = false;
                // Object.assign(this, {
                //     data: [],
                //     fetching: false,
                // })
            },
            fetchNode(value) {
                let app = this;
                this.lastFetchId += 1;
                const fetchId = this.lastFetchId;
                this.nodeList = [];
                this.fetching = true;
                allList('project',value).then(res => {
                    if (fetchId !== app.lastFetchId) { // for fetch callback order
                        return;
                    }
                    app.fetching = false;
                    app.nodeList = res.data;
                });
            },
        }
    }
</script>
