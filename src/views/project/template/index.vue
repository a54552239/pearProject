<template>
    <div class="project-template-index">
        <wrapper-content :showHeader="false">
            <a-tabs :animated="false" v-model="viewType">
                <a-tab-pane tab="自定义模板" key="0"></a-tab-pane>
                <a-tab-pane tab="公共模板" key="1"></a-tab-pane>
                <a-button type="primary" slot="tabBarExtraContent" icon="plus" @click="doAction(null,'new')">制作项目模板
                </a-button>
            </a-tabs>
            <a-list
                    class="default-list"
                    :loading="loading"
                    itemLayout="horizontal"
                    :dataSource="dataSource"
            >
                <div v-if="showLoadingMore" slot="loadMore"
                     :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore"/>
                    <a-button v-else @click="onLoadMore">查看更多模板</a-button>
                </div>
                <a-list-item slot="renderItem" slot-scope="item,index">
                    <span slot="actions" v-if="!item.is_system" @click="doAction(item,'stages')">
                         <a-tooltip title="任务列表">
                              <a-icon type="bars"/>
                         </a-tooltip>
                    </span>
                    <span slot="actions" v-if="!item.is_system" @click="doAction(item,'edit')">
                         <a-tooltip title="编辑">
                              <a-icon type="edit"/>
                         </a-tooltip>
                    </span>
                    <span slot="actions" v-if="!item.is_system" @click="doAction(item,'del',index)">
                         <a-tooltip title="删除">
                              <a-icon type="delete"/>
                         </a-tooltip>
                    </span>
                    <a-list-item-meta
                            :description="item.description"
                    >
                        <span slot="title">{{item.name}}</span>
                        <a-avatar slot="avatar" icon="user" :src="item.cover"/>
                    </a-list-item-meta>
                    <div class="other-info muted">
                        <div class="info-item task" v-if="item.task_stages.length">
                            <!--<span>任务流</span>-->
                            <a-breadcrumb separator=">">
                                <a-breadcrumb-item v-for="task in item.task_stages" :key="task.name">{{task.name}}
                                </a-breadcrumb-item>
                            </a-breadcrumb>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
        </wrapper-content>
        <a-modal
                class="project-template-modal"
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
                <div class="cover-item">
                    <template v-if="cover">
                        <img class="avatar" :src="cover"/>
                    </template>
                    <span class="no-avatar" v-show="!cover"></span>
                    <a-upload
                            name="cover"
                            class="cover-uploader"
                            :showUploadList="false"
                            :headers="headers"
                            :action="uploadAction"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                    >
                        <a-button icon="upload" class="upload">上传封面</a-button>
                        <span class="upload-tips muted">最佳图片比例为300*150</span>
                    </a-upload>
                </div>
                <a-form-item
                >
                    <a-input placeholder='模板名称（必填）'
                             v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入模板名称' }]}
                                            ]"/>
                </a-form-item>
                <a-form-item
                >
                    <a-textarea placeholder='模板说明'
                                :rows="2"
                                v-decorator="['description']"
                    />
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn">
                        <a-button type="primary" htmlType='submit'
                                  block
                                  size="large"
                                  :loading="actionInfo.confirmLoading"
                                  class="middle-btn">保存模板
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    import {list, doData, del} from '@/api/projectTemplate';
    import {checkResponse, getApiUrl, getBase64} from '@/assets/js/utils';
    import pagination from "@/mixins/pagination";
    import config from "@/config/config"
    import {getAuthorization} from "../../../assets/js/utils";

    export default {
        components: {},
        mixins: [pagination],
        data() {
            return {
                viewType: '0',
                dataSource: [],
                loading: true,
                showLoadingMore: false,
                loadingMore: false,
                currentTemplate: {},
                cover:'https://beta.vilson.xyz/static/image/default/project-cover.png',
                // cover: config.PROD_URL + '/static/image/default/cover.png',
                newData: {
                    id: 0,
                },
                form: this.$form.createForm(this),
                searchForm: {},
                actionInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑模板',
                },
                uploadLoading: false,
                uploadAction: getApiUrl('project/project_template/uploadCover'),
            }
        },
        computed: {
            headers() {
                return getAuthorization();
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
                app.requestData.viewType = app.viewType;
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
                    app.actionInfo.modalTitle = '自定义模板';
                    if (action == 'edit') {
                        //modal没显示之前不会实例化modal子元素，延迟处理
                        setTimeout(function () {
                            app.actionInfo.modalTitle = '编辑模板';
                            app.form.setFieldsValue({
                                name: record.name,
                                description: record.description,
                            });
                            app.cover = record.cover;
                            app.newData = record;
                        }, 0);
                    }
                } else if (action == 'del') {
                    this.$confirm({
                        title: '确定删除模板？',
                        content: `删除模板「${this.currentTemplate.name}」后已从该模板创建的项目不受影响`,
                        okText: '删除模板',
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
                } else if (action == 'stages') {
                    const {href} = this.$router.resolve({
                        path: '/project/template/taskstages/' + record.code + '?name=' + record.name,
                    });
                    window.open(href, '_blank');
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
                obj.cover = this.cover;
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
    .project-template-index {
        .ant-breadcrumb > span:last-child {
            color: rgba(0, 0, 0, 0.45) !important;
        }

        .ant-list-item-content {
        }
    }

    .project-template-modal {
        .cover-item {
            display: flex;
            flex-direction: column;

            .avatar, .no-avatar {
                width: 300px;
                height: 150px;
                line-height: 150px;
                font-size: 18px;
                border-radius: 4px;
            }

            .no-avatar {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                list-style: none;
                text-align: center;
                background: #ccc;
                color: #fff;
                white-space: nowrap;
                position: relative;
                overflow: hidden;
                vertical-align: middle;
                display: block;
            }

            .upload {
                margin: 18px 0;
            }

            .upload-tips {
                margin-left: 12px;
            }
        }

        .cover-uploader {
            display: block;
        }
    }
</style>
