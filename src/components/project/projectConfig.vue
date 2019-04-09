<template>
    <a-tabs tabPosition="left" defaultActiveKey="1" :animated="false" v-model="tabKey">
        <a-tab-pane key="1">
                    <span slot="tab">
                        <a-icon type="heat-map"/>
                        概览
                    </span>
            <div class="config-content">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目封面</p>
                        <div class="cover-item">
                            <template v-if="project.cover">
                                <img class="avatar" :src="project.cover"/>
                            </template>
                            <span class="no-avatar" v-show="!project.cover"></span>
                            <a-upload
                                    name="cover"
                                    class="cover-uploader"
                                    :showUploadList="false"
                                    :headers="headers"
                                    :action="uploadAction"
                                    :beforeUpload="beforeUpload"
                                    @change="handleChange"
                            >
                                <a-button size="large" class="upload">上传新封面</a-button>
                                <p class="upload-tips muted">最佳图片比例为300*150</p>
                            </a-upload>
                        </div>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目名称</p>
                        <a-input size="large" v-model="project.name"></a-input>
                    </div>
                    <div class="infos">
                        <p class="item-title">项目进度 (%)</p>
                        <a-input-number
                                size="large"
                                :min="0"
                                :max="100"
                                v-model="project.schedule"></a-input-number>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目简介</p>
                        <a-input type="textarea" :rows="3" size="large" placeholder="介绍一下这个项目"
                                 v-model="project.description"></a-input>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目公开性</p>
                        <a-select
                                size="large"
                                v-model="project.private"
                        >
                            <a-select-option :key="0">
                                公开项目（所有人都可通过链接访问，仅项目成员可编辑）
                            </a-select-option>
                            <a-select-option :key="1">
                                私有项目（仅项目成员可查看和编辑）
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目拥有者</p>
                        <div class="m-t">
                            <a-avatar :src="project.owner_avatar"></a-avatar>
                            <span class="m-l">{{project.owner_name}}</span>
                            <a-button class="middle-btn pull-right" size="large">
                                移交
                            </a-button>
                        </div>
                    </div>
                </div>
                <a-divider />
                <div class="content-item">
                    <div class="infos">
                        <a-button type="primary" class="middle-btn pull-right" size="large"
                                  @click="saveProject">
                            保存
                        </a-button>
                    </div>
                </div>
            </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" forceRender>
             <span slot="tab">
                 <a-icon type="eye"/>
                 项目偏好 *
             </span>
             项目偏好
         </a-tab-pane>-->
        <a-tab-pane key="3">
                    <span slot="tab">
                        <a-icon type="check-square"/>
                        任务设置
                    </span>
            <div class="config-content task-config">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目ID</p>
                        <div class="item-tips muted">设置项目编号，编号将作为 ID 前缀，用以区别项目。支持 2-6 位字母。</div>
                        <a-input class="prefix-input" size="large" placeholder="如 Pear Project 可以设置为 EP"
                                 v-model="project.prefix"
                                 :disabled="!project.open_prefix"></a-input>
                        <a-button size="large" class="middle-btn" type="primary"
                                  :disabled="!project.open_prefix" @click="saveProject">保存
                        </a-button>
                    </div>
                    <a-switch v-model="project.open_prefix" @change="saveProject"/>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="4">
                    <span slot="tab">
                        <a-icon type="ellipsis"/>
                        更多
                    </span>
            <div class="config-content more-config">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目操作</p>
                        <div class="item-tips muted">您可以执行以下操作</div>
                        <a-button size="large" class="middle-btn" @click="archiveProject">
                            <span v-if="project.archive">取消归档</span>
                            <span v-if="!project.archive">归档项目</span>
                        </a-button>
                        <a-button size="large" class="middle-btn" @click="quitProject">退出</a-button>
                        <a-button size="large" class="middle-btn" type="danger" @click="delProject">
                            <span v-if="project.deleted">恢复项目</span>
                            <span v-if="!project.deleted">移至回收站</span>
                        </a-button>
                    </div>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script>
    import {read as getProject, doData, archive, recycle, recoveryArchive, recovery, quit} from "../../api/project";
    import {notice} from "../../assets/js/notice";
    import {checkResponse, getApiUrl, getAuthorization, getBase64} from "../../assets/js/utils";

    export default {
        name: "projectConfig",
        props: {
            code: {
                type: [String],
                default() {
                    return ''
                }
            },
        },
        data() {
            return {
                /*项目设置*/
                loading: false,
                tabKey: '1',
                project: {},
                uploadLoading: false,
                uploadAction: getApiUrl('project/project/uploadCover'),
            }
        },
        computed: {
            headers() {
                return getAuthorization();
            }
        },
        watch: {
            code() {
                this.getProject();
            }
        },
        created() {
            this.getProject();
        },
        methods: {
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                    this.project.open_prefix = !!res.data.open_prefix;
                });
            },
            saveProject() {
                const project = this.project;
                doData({
                    projectCode: project.code,
                    name: project.name,
                    description: project.description,
                    cover: project.cover,
                    private: project.private,
                    prefix: project.prefix,
                    open_prefix: Number(project.open_prefix),
                    schedule: Number(project.schedule),
                }).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.$emit('update', this.project);
                    notice({
                        title: '保存成功',
                    }, 'notice', 'success');
                })
            },
            archiveProject() {
                let app = this;
                if (!app.project.archive) {
                    this.$confirm({
                        title: '归档项目',
                        content: `一旦将项目「${this.project.name}」归档，本项目和所含信息将会被移到「归档项目」内，其中的内容依然会被统计和搜索收录，归档项目可以随时恢复并继续使用。`,
                        okText: '归档',
                        okType: 'danger',
                        cancelText: `再想想`,
                        onOk() {
                            archive(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/archive');
                            });
                            return Promise.resolve();
                        }
                    });
                } else {
                    this.$confirm({
                        title: '取消归档项目？',
                        content: `取消归档「${this.project.name}」后就可以正常使用了`,
                        okText: '取消归档',
                        okType: 'primary',
                        cancelText: '再想想',
                        onOk() {
                            recoveryArchive(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/list/my');
                            });
                            return Promise.resolve();
                        }
                    });
                }
            },
            delProject() {
                let app = this;
                if (!app.project.deleted) {
                    this.$confirm({
                        title: '确定放入回收站？',
                        content: `一旦将项目「${this.project.name}」放入回收站，所有与项目有关的信息将会被放入回收站`,
                        okText: '放入回收站',
                        okType: 'danger',
                        cancelText: '再想想',
                        onOk() {
                            recycle(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/recycle');
                            });
                            return Promise.resolve();
                        }
                    });
                } else {
                    this.$confirm({
                        title: '确定恢复项目？',
                        content: `恢复「${this.project.name}」后就可以正常使用了`,
                        okText: '恢复项目',
                        okType: 'primary',
                        cancelText: '再想想',
                        onOk() {
                            recovery(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/list/my');
                            });
                            return Promise.resolve();
                        }
                    });
                }
            },
            quitProject() {
                let app = this;
                this.$confirm({
                    title: '退出项目',
                    content: `一旦你退出了该项目，你将不能查看任何关于该项目的信息。退出项目后，如果想重新加入，请联系项目管理员。`,
                    okText: '确定退出',
                    okType: 'primary',
                    cancelText: '再想想',
                    onOk() {
                        quit(app.code).then((res) => {
                            if (!checkResponse(res)) {
                                return;
                            }
                            app.$router.replace('/project/list/my');

                        });
                        return Promise.resolve();
                    }
                });
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, () => {
                        this.project.cover = info.file.response.data.url;
                        this.uploadLoading = false;
                        notice({
                            title: '封面上传成功',
                        }, 'notice', 'success');
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
    .project-config-modal {
        .ant-modal-body {
            padding: 0;
        }

        .ant-modal-body, .ant-tabs, .ant-tabs-bar {
            min-height: 730px;
            min-width: 180px;
            .ant-tabs-tab{
                padding: 12px 24px;
            }
        }

        .ant-tabs-nav-wrap {
            padding-top: 10px;
        }

        .ant-tabs-left-content {
            padding-top: 18px;
            padding-right: 12px;
        }

        .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
            text-align: left;
        }

        .config-content {
            .content-item {
                display: flex;
                justify-content: space-between;
                flex: 1 1;
                margin-bottom: 24px;

                .infos {
                    width: 100%;
                    padding-right: 12px;

                    p {
                        margin-bottom: 6px;
                    }

                    .item-title {
                        font-size: 16px;
                    }

                    .item-tips {
                        margin-bottom: 12px;
                    }

                    .ant-select {
                        width: 100%;
                    }

                    .ant-input-number-lg {
                        width: 100%;
                    }

                    .cover-item {
                        display: flex;

                        img {
                            width: 300px;
                            height: 150px;
                        }

                        .cover-uploader {
                            display: block;
                            margin-left: 24px;

                            .upload-tips {
                                margin-top: 12px;
                            }
                        }
                    }
                }
            }

            &.task-config {
                .content-item {
                    padding-bottom: 24px;
                    border-bottom: 1px solid #e5e5e5;
                }

                .prefix-input {
                    width: 50%;
                    margin-right: 24px;
                }
            }

            &.more-config {
                .ant-btn {
                    margin-right: 12px;
                }
            }
        }
    }
</style>
