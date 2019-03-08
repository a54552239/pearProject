<template>
    <div class="account-index">
        <wrapper-content>
            <div class="action">
            </div>
            <a-table :columns="columns" :dataSource="dataSource" :loading="loading" rowKey="id" :pagination="pagination" @change="pageChange">
                <template slot="avatar" slot-scope="text,record,index">
                    <a-avatar :src="record.avatar" />
                </template>
                <template slot="status" slot-scope="text,record,index">
                    <span class="success-color" v-if="record.status">使用中</span>
                    <span v-else>已禁用</span>
                </template>
                <template slot="action" slot-scope="text,record,index">
                    <template v-if="!record.is_owner">
                        <a @click="rowClick(record,'edit')">编辑</a>
                        <a-divider type="vertical"/>
                        <a @click="auth(record)">授权</a>
                        <a-divider type="vertical"/>
                        <a @click="rowClick(record,'status')"><span v-if="record.status">禁用</span><span v-else>启用</span></a>
                        <a-divider type="vertical"/>
                        <a @click="rowClick(record,'del')">删除</a>
                    </template>
                </template>
            </a-table>
        </wrapper-content>
        <a-modal
                v-model="actionInfo.modalStatus"
                :width="800"
                :title="actionInfo.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <a-form
                    :autoFormCreate="(form)=>{this.form = form}"
                    @submit.prevent="handleSubmit"
            >
                <a-form-item
                        label='姓名'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="name"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入姓名' }]}"
                >
                    <a-input placeholder='姓名'/>
                </a-form-item>
                <a-form-item
                        label='手机'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="mobile"
                >
                    <a-input placeholder='手机号码'/>
                </a-form-item>
                <a-form-item
                        label='邮箱'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="email"
                >
                    <a-input placeholder='邮箱地址'/>
                </a-form-item>
                <a-form-item
                        label='描述'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="description"
                        help='可选，设置账号的备注信息'
                >
                    <a-text-area placeholder='账号描述'/>
                </a-form-item>
                <a-form-item
                        :wrapperCol="{ span: 21, offset: 3 }"
                >
                    <div class="action-btn">
                        <a-button type="primary" htmlType='submit'
                                  :loading="actionInfo.confirmLoading"
                                  class="middle-btn">保存
                        </a-button>
                        <a-button class="middle-btn" @click="actionInfo.modalStatus = false">取消
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                v-model="authInfo.modalStatus"
                :width="800"
                title="用户授权"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <div v-if="currentUser" style="margin: 0 0 24px 0;">
                <div style="margin-bottom: 24px;">
                    <a-radio-group v-model="currentUser.authorize"  buttonStyle="solid">
                        <a-radio-button :value="auth.value" v-for="auth in authList" :key="auth.value">{{auth.label}}</a-radio-button>
                    </a-radio-group>
                    <!--<a-checkbox-group :options="authList" v-model="currentUser.authorizeArr"/>-->
                </div>
                <div class="action-btn">
                    <a-button type="primary"
                              @click="authApply"
                              :loading="authInfo.confirmLoading"
                              class="middle-btn">保存
                    </a-button>
                    <a-button class="middle-btn" @click="authInfo.modalStatus = false">取消
                    </a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import AInput from 'ant-design-vue/es/input'
    import {doAccount, forbid, list, resume, auth, del} from "../../../api/user";
    import {checkResponse} from "../../../assets/js/utils";
    import pagination from "@/mixins/pagination";

    const ATextArea = AInput.TextArea;
    const columns = [{
        title: '头像',
        dataIndex: 'avatar',
        width: '30%',
        scopedSlots: {
            customRender: 'avatar'
        }
    }, {
        title: '姓名',
        dataIndex: 'name',
        width: '15%',
    }, {
        title: '手机',
        dataIndex: 'mobile',
        width: '15%',
    },{
        title: '状态',
        dataIndex: 'status',
        scopedSlots: {
            customRender: 'status'
        }
    }, {
        title: '操作',
        scopedSlots: {
            customRender: 'action'
        }
    }];
    export default {
        components: {
            ATextArea,
        },
        mixins: [pagination],
        data() {
            return {
                columns,
                dataSource: [],
                loading: true,
                authList: [],
                newData: {
                    id: 0
                },
                form: {},
                currentUser: null,
                authInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                },
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑账号',
                    okText: '保存',
                    cancelText: '放弃',
                }
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                let app = this;
                app.loading = true;
                list(app.requestData).then(res=>{
                    app.dataSource = res.data.list;
                    app.pagination.total = res.data.total;
                    app.authList = [];
                    res.data.authList.forEach(function (v) {
                        const obj = {
                            label: v.title,
                            value: v.id
                        };
                        app.authList.push(obj);
                    });
                    app.loading = false;
                })
            },
            rowClick(record, action) {
                let app = this;
                app.newData = {id: 0};
                if (action == 'add' || action == 'edit' || action == 'new') {
                    setTimeout(function () {
                        app.form && app.form.resetFields();
                    }, 0);
                    app.actionInfo.modalStatus = true;
                    app.actionInfo.modalTitle = '添加账号';
                    if (action == 'edit') {
                        //modal没显示之前不会实例化modal子元素，延迟处理
                        setTimeout(function () {
                            app.actionInfo.modalTitle = '编辑账号';
                            app.form.setFieldsValue({
                                name: record.name,
                                mobile: record.mobile,
                                email: record.email,
                                description: record.description,
                            });
                            app.newData = record;
                        }, 0);
                    }
                } else if (action == 'status') {
                    const status = record.status;
                    status ? forbid(record.code).then(res=>{
                        if (checkResponse(res)) {
                            record.status = Number(!status);
                        }
                    }) : resume(record.code).then(res=>{
                        if (checkResponse(res)) {
                            record.status = Number(!status);
                        }
                    });
                } else if (action == 'del') {
                    this.$confirm({
                        title: '确定要删除此账号?',
                        content: '删除后不可恢复',
                        okText: '删除',
                        okType: 'danger',
                        cancelText: '放弃',
                        onOk() {
                            del(record.code).then(() => {
                                app.init();
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
                if (app.newData.code) {
                    //编辑
                    obj.code = app.newData.code;
                } else {
                    //新增
                    Object.assign(obj, app.newData);
                }
                doAccount(obj).then(res => {
                    app.actionInfo.confirmLoading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    if (app.newData.code) {
                        app.newData.email = obj.email;
                        app.newData.name = obj.name;
                        app.newData.mobile = obj.mobile;
                        app.newData.description = obj.description;
                    } else {
                        app.dataSource.push(res.data);
                    }
                    app.form.resetFields();
                    app.newData = {id: 0};
                    app.actionInfo.modalStatus = false;

                });
            },
            auth(record, index) {
                let app = this;
                app.authInfo.modalStatus = true;
                app.currentUser = record;
                app.currentUser.index = index;
            },
            authApply() {
                let app = this;
                app.authInfo.confirmLoading = true;
                auth(app.currentUser.id, app.currentUser.authorize).then(res => {
                    if (checkResponse(res)) {
                        app.dataSource[app.currentUser.index] = app.currentUser;
                        app.authInfo.modalStatus = false;
                        app.authInfo.confirmLoading = false;
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    .type-content{
        .content-item{
            margin-bottom: 12px;
            .ant-input{
                width: 90%;
            }
        }
    }
</style>
