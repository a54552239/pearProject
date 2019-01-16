<template>
    <div class="house-index">
        <wrapper-content>
           <!-- <div class="action">
                <a-button type="primary" icon="plus" @click="rowClick(null,'new')">添加</a-button>
            </div>-->
            <a-table :columns="columns" :dataSource="dataSource" :loading="loading" rowKey="id" :pagination="pagination"
                     @change="pageChange">
                <template slot="action" slot-scope="text,record,index">
                    <a @click="rowClick(record,'edit')">编辑</a>
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
                        :form="form"
                        label='组织名称'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="name"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '组织名称' }]}"
                        help='必填，请填写组织名称'
                >
                    <a-input placeholder='组织名称'/>
                </a-form-item>
               <!-- <a-form-item
                        label='所在区域'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{ span: 21 }"
                        fieldDecoratorId="areas"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输所在区域' }]}"
                        help='必填，请填写所在区域。'
                >
                    <a-cascader :fieldNames="{ label: 'Name', value: 'ID', children: 'children' }" :options="options"
                                placeholder="选择所在省市"/>
                </a-form-item>-->

                <a-form-item
                        label='详细地址'
                        :labelCol="{ span: 3 }"
                        :wrapperCol="{span: 21 }"
                        fieldDecoratorId="address"
                        help="详细地址"
                >
                    <a-input/>
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
    </div>
</template>
<script>
    import {list, doData, del} from '@/api/organization';
    import {checkResponse} from '@/assets/js/utils';
    import {areasData} from "../../api/common/common";
    import pagination from "@/mixins/pagination";
    import moment from 'moment';

    const columns = [{
        title: '组织名称',
        dataIndex: 'name',
        width: '30%',
    }, {
        title: '操作',
        scopedSlots: {
            customRender: 'action'
        }
    }];

    export default {
        mixins: [pagination],
        data() {
            return {
                columns,
                dataSource: [],
                loading: true,
                newData: {
                    code: 0
                },
                form: {},
                searchForm: {},
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑组织',
                    okText: '保存',
                    cancelText: '放弃',
                },
                showMap: false,
                options: [],
            }
        },
        created() {
            this.init();
        },
        methods: {
            moment,
            init() {
                let app = this;
                app.loading = true;
                list(app.requestData).then(res => {
                    app.dataSource = res.data.list;
                    app.pagination.total = res.data.total;
                    app.loading = false;
                    app.$store.dispatch('setOrganizationList', res.data.list);
                });
                // areasData().then(res => {
                //     app.options = res.data;
                // });
            },
            rowClick(record, action) {
                let app = this;
                app.newData = {code: ''};
                if (action == 'add' || action == 'edit' || action == 'new') {
                    setTimeout(function () {
                        app.form && app.form.resetFields();
                    }, 0);
                    app.actionInfo.modalStatus = true;
                    app.actionInfo.modalTitle = '添加组织';
                    if (action == 'edit') {
                        //modal没显示之前不会实例化modal子元素，延迟处理
                        setTimeout(function () {
                            app.actionInfo.modalTitle = '编辑组织';
                            app.form.setFieldsValue({
                                name: record.name,
                                areas: [record.province.toString(), record.city.toString(), record.area.toString()],
                                address: record.address,
                            });
                            app.newData = record;
                        }, 0);
                    }
                }else if (action == 'del') {
                    this.$confirm({
                        title: '保存要删除此组织?',
                        content: '删除后不可恢复',
                        okText: '删除',
                        okType: 'danger',
                        cancelText: '放弃',
                        onOk() {
                            del(record.code).then(res => {
                            });
                            app.init();
                            return Promise.resolve();
                        }
                    });
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
                obj.areas = JSON.stringify(obj.areas);
                console.log(app.newData);
                if (app.newData.code) {
                    app.newData.organizationCode = app.newData.code
                    //编辑
                    obj.organizationCode = app.newData.code;
                } else {
                    //新增
                    Object.assign(obj, app.newData);
                }
                doData(obj).then(res => {
                    app.actionInfo.confirmLoading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    if (app.newData.code) {
                        app.newData.name = obj.name;
                        app.newData.address = obj.address;
                    } else {
                        app.dataSource.push(res.data);
                    }
                    app.form.resetFields();
                    app.newData = {code: 0};
                    app.actionInfo.modalStatus = false;
                    app.init();

                });
            }
        }
    }
</script>
