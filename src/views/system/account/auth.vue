<template>
    <div class="project-auth">
        <wrapper-content>
            <div class="action">
                <Button type="primary" icon="plus" @click="rowClick(null,'new')">添加</Button>
            </div>
            <Table :columns="columns" :dataSource="data" rowKey="id" :pagination="pagination" @change="pageChange">
                <template slot="is_default" slot-scope="text,record,index">
                    <a-icon type="check" v-if="record.is_default"/>
                    <!--<span v-else>已禁用</span>-->
                </template>
                <template slot="action" slot-scope="text,record,index">

                    <a @click="rowClick(record,'edit')">编辑</a>
                    <Divider type="vertical"/>
                    <router-link :to="'/system/account/apply/' + record.id">授权</router-link>
                    <!--<a @click="rowClick(record,'status')"><span v-if="record.status">禁用</span><span v-else>启用</span></a>-->
                    <template v-if="!record.is_default">
                        <Divider type="vertical"/>
                        <a @click="rowClick(record,'is_default')"><span v-if="!record.is_default">设为默认</span></a>
                    </template>
                    <template v-if="record.canDelete">
                        <Divider type="vertical"/>
                        <a @click="rowClick(record,'del', index)">删除</a>
                    </template>
                </template>
            </Table>
        </wrapper-content>
        <Modal
                v-model="actionInfo.modalStatus"
                :title="actionInfo.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <Form
                    :autoFormCreate="(form)=>{this.form = form}"
                    @submit.prevent="handleSubmit"
            >
                <FormItem
                        :form="form"
                        label='名称'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="title"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入名称' }]}"
                        help='必填，请填写权限名称（如：财务），用于标记拥有相应权限的角色'
                >
                    <Input placeholder='权限名称'/>
                </FormItem>
                <FormItem
                        label='描述'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="desc"
                        help='选填，权限描述。'
                >
                    <Input placeholder='权限描述'/>
                </FormItem>
                <FormItem
                        :wrapperCol="{ span: 21, offset: 3 }"
                >
                    <div class="action-btn">
                        <Button type="primary" htmlType='submit'
                                :loading="actionInfo.confirmLoading"
                                class="middle-btn">保存
                        </Button>
                        <Button class="middle-btn" @click="actionInfo.modalStatus = false">取消
                        </Button>
                    </div>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {Table, Button, Divider, Modal, Form, Input} from 'ant-design-vue';
    import {getAuthList, doAuth, forbid, resume, del} from '@/api/auth';
    import {checkResponse} from '@/assets/js/utils';
    import pagination from "@/mixins/pagination";
    import {setDefault} from "../../../api/auth";

    const FormItem = Form.Item;

    const columns = [{
        title: '名称',
        dataIndex: 'title',
        width: '15%',
    }, {
        title: '描述',
        dataIndex: 'desc',
        width: '30%',
    }, {
        title: '默认',
        dataIndex: 'is_default',
        width: '10%',
        scopedSlots: {
            customRender: 'is_default'
        },
    }, {
        title: '添加时间',
        dataIndex: 'create_at',
    }, {
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
        },
        mixins: [pagination],
        data() {
            return {
                columns,
                data: [],
                newData: null,
                form: {},
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑权限',
                    okText: '确定',
                    cancelText: '放弃',
                },
                authApplyShow: false,
                nodeList: [],
                checkedList: [],
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                getAuthList(this.requestData).then(res => {
                    this.data = res.data.list;
                    this.pagination.total = res.data.total;
                });
            },
            rowClick(record, action, index) {
                let app = this;
                app.newData = null;
                if (action == 'edit' || action == 'new') {
                    setTimeout(function () {
                        app.form && app.form.resetFields();
                    }, 0);
                    app.actionInfo.modalStatus = true;
                    app.actionInfo.modalTitle = '添加权限';
                    if (action == 'edit') {
                        //modal没显示之前不会实例化modal子元素，延迟处理
                        setTimeout(function () {
                            app.actionInfo.modalTitle = '编辑权限';
                            app.form.setFieldsValue({
                                title: record.title,
                                desc: record.desc,
                            });
                            app.newData = record;
                        }, 0);
                    } else {
                        app.newData = {
                            status: 1,
                            sort: 0,
                        };
                    }
                } else if (action == 'status') {
                    const status = record.status;
                    record.status = Number(!status);
                    status ? forbid(record.id, record.status) : resume(record.id, record.status);
                } else if (action == 'is_default') {
                    setDefault(record.id,1).then(res=>{
                        if (checkResponse(res)) {
                            app.init();
                        }
                    });
                } else if (action == 'del') {
                    Modal.confirm({
                        title: '确定要删除此权限?',
                        content: '删除后不可恢复',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '放弃',
                        onOk() {
                            del(record.id).then(res => {
                                if (checkResponse(res)) {
                                    app.data.splice(index, 1);
                                }
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
                if (app.newData.id) {
                    //编辑
                    obj.id = app.newData.id;
                } else {
                    //新增
                    Object.assign(obj, app.newData);
                }
                console.log(obj);
                doAuth(obj).then(res => {
                    app.actionInfo.confirmLoading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    if (app.newData.id) {
                        app.newData.title = obj.title;
                        app.newData.desc = obj.desc;
                    } else {
                        app.data.push(res.data);
                    }
                    app.form.resetFields();
                    app.newData = null;
                    app.actionInfo.modalStatus = false;
                });
            },
        }
    }
</script>
