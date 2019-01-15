<template>
    <div class="project-template-index">
        <wrapper-content :showHeader="false">
            <div class="action">
                <a-button type="primary" icon="plus" @click="doAction(null,'new')">添加任务</a-button>
            </div>
            <h3>「{{$route.query.name}}」任务列表</h3>
            <a-list
                    class="default-list"
                    :loading="loading"
                    itemLayout="horizontal"
                    :dataSource="dataSource"
            >
                <div v-if="showLoadingMore" slot="loadMore"
                     :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore"/>
                    <a-button v-else @click="onLoadMore">查看更多任务</a-button>
                </div>
                <a-list-item slot="renderItem" slot-scope="item,index">
                    <span slot="actions" @click="doAction(item,'edit')">
                         <a-tooltip title="编辑">
                              <a-icon type="edit"/>
                         </a-tooltip>
                    </span>
                    <span slot="actions" @click="doAction(item,'del',index)">
                         <a-tooltip title="删除">
                              <a-icon type="delete"/>
                         </a-tooltip>
                    </span>
                    <a-list-item-meta
                            :description="'排序：'+item.sort"
                    >
                        <span slot="title">{{item.name}}</span>
                    </a-list-item-meta>
                </a-list-item>
            </a-list>
        </wrapper-content>
        <a-modal
                :width="360"
                v-model="actionInfo.modalStatus"
                :title="actionInfo.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <a-form
                    @submit.prevent="handleSubmit"
                    :form="form"
            >
                <a-form-item
                >
                    <a-input placeholder='任务名称（必填）'
                             v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入任务名称' }]}
                                            ]"/>
                </a-form-item>
                <a-form-item
                        help="排序，值越大越靠前，默认0"
                >
                    <a-input-number style="width: 100%" :min="0" placeholder='排序'
                             v-decorator="[
                                            'sort',
                                            ]"/>
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn">
                        <a-button type="primary" htmlType='submit'
                                  block
                                  size="large"
                                  :loading="actionInfo.confirmLoading"
                                  class="middle-btn">保存任务
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    import {list, doData, del} from '@/api/taskStagesTemplate';
    import {checkResponse, getBase64} from '@/assets/js/utils';
    import pagination from "@/mixins/pagination";

    export default {
        components: {},
        mixins: [pagination],
        data() {
            return {
                dataSource: [],
                loading: true,
                showLoadingMore: false,
                loadingMore: false,
                currentTemplate: {},
                newData: {
                    id: 0,
                },
                form: this.$form.createForm(this),
                searchForm: {},
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑任务',
                },
            }
        },
        watch: {
            $route() {
                this.init();
            },
            viewType() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(reset = true) {
                let app = this;
                if (reset) {
                    this.dataSource = [];
                    this.pagination.page = 1;
                    this.showLoadingMore = false;
                }
                app.loading = true;
                app.requestData.code = app.$route.params.code;
                list(app.requestData).then(res => {
                    app.dataSource = app.dataSource.concat(res.data.list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.dataSource.length;
                    app.loading = false;
                    app.loadingMore = false
                });
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.init(false);
            },
            doAction(record, action, index) {
                this.currentTemplate = record;
                let app = this;
                app.newData = {code: ''};
                if (action == 'edit' || action == 'new') {
                    setTimeout(function () {
                        app.form && app.form.resetFields();
                    }, 0);
                    app.actionInfo.modalStatus = true;
                    app.actionInfo.modalTitle = '添加任务';
                    if (action == 'edit') {
                        //modal没显示之前不会实例化modal子元素，延迟处理
                        setTimeout(function () {
                            app.actionInfo.modalTitle = '编辑任务';
                            app.form.setFieldsValue({
                                name: record.name,
                                sort: record.sort,
                            });
                            app.cover = record.cover;
                            app.newData = record;
                        }, 0);
                    }
                } else if (action == 'del') {
                    this.$confirm({
                        title: '确定删除任务？',
                        content: `删除任务「${this.currentTemplate.name}」后已以该任务创建的项目不受影响`,
                        okText: '删除任务',
                        okType: 'danger',
                        cancelText: '再想想',
                        onOk() {
                            del(record.code).then(() => {
                                app.dataSource.splice(index, 1);
                                // app.init();
                            });
                            return Promise.resolve();
                        }
                    });
                }
            },
            handleSubmit() {
                let app = this;
                app.form.validateFields(
                    (err) => {
                        if (!err) {
                            app.handleOk();
                        }
                    })
            },
            handleOk() {
                let app = this;
                app.actionInfo.confirmLoading = true;
                let obj = app.form.getFieldsValue();
                obj.template_code = this.$route.params.code;
                if (app.newData.code) {
                    //编辑
                    obj.code = app.newData.code;
                } else {
                    //新增
                    Object.assign(obj, app.newData);
                }

                doData(obj).then(res => {
                    app.actionInfo.confirmLoading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    app.form.resetFields();
                    app.newData = {code: ''};
                    app.actionInfo.modalStatus = false;
                    app.init();

                });
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.cover = info.file.response.data.url;
                        this.uploadLoading = false;
                    })
                }
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片不能超过2MB!')
                }
                return isLt2M
            },
        }
    }
</script>
<style lang="less">
</style>
