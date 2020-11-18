<template>
    <div class="project-space-files" :class="project.task_board_theme">
        <div class="project-navigation">
            <div class="project-nav-header">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <router-link to="/home">
                            <a-icon type="home"/>
                            首页
                        </router-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>
                        <project-select class="nav-title" style="display: inline-block" :code="code"></project-select>
                        <span class="actions">
                             <a-tooltip :mouseEnterDelay="0.3" :title="project.collected ? '取消收藏' : '加入收藏'"
                                        @click="collectProject">
                            <a-icon type="star" theme="filled" style="color: grey;" v-show="!project.collected"/>
                            <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="project.collected"/>
                        </a-tooltip>
                        </span>
                        <span class="label label-normal" v-if="project.private === 0"><a-icon type="global"/> 公开</span>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li><a class="app" data-app="tasks"
                           @click="$router.push('/project/space/task/' + code)">任务</a></li>
                    <li class="actives"><a class="app" data-app="works"
                                           @click="$router.push('/project/space/files/' + code)">
                        文件</a>
                    <li><a class="app" data-app="build"
                           @click="$router.push('/project/space/overview/' + code)">
                        概览</a>
                    </li>
                    <li class=""><a class="app" data-app="build"
                                    @click="$router.push('/project/space/features/' + code)">
                        版本</a>
                    </li>
                    <li><a class="app" data-app="build"
                           @click="$router.push('/project/space/events/' + code)">
                        日程</a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper-content :showHeader="false">
            <div class="content-wrapper">
                <div class="content-item log-list">
                    <div class="header">
                        <span class="title">我的文件</span>
                        <div class="header-actions">
                            <!--<a><a-icon type="upload"></a-icon> 上传文件</a>-->
                            <a-button id="upload-file" icon="up-circle" type="dashed">上传</a-button>
                        </div>
                    </div>
                    <div class="list-content">
                        <a-list
                                :loading="loading"
                        >
                            <a-list-item class="list-item-title">
                                <a-list-item-meta>
                                    <div class="muted" slot="title">
                                        名称
                                    </div>
                                </a-list-item-meta>
                                <div class="other-info muted">
                                    <div class="info-item">
                                        <span>大小</span>
                                    </div>
                                    <div class="info-item">
                                        <span>创建日期</span>
                                    </div>
                                    <div class="info-item">
                                        <span>创建人</span>
                                    </div>
                                </div>
                                <span slot="actions" :key="item" v-for="item in 3">
                                    <span>位</span>
                                </span>
                            </a-list-item>
                            <a-list-item class="list-item" :key="index" v-for="(item, index) in files">
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" shape="square" icon="link" :src="item.file_url"/>
                                    <div slot="title">
                                        <a-tooltip :mouseEnterDelay="0.3">
                                            <template slot="title">
                                                <span>{{item.fullName}}</span>
                                            </template>
                                            <a-input
                                                    :ref="`inputTitle${index}`"
                                                    :auto-focus="true"
                                                    v-model="item.title"
                                                    v-show="item.editing"
                                                    @pressEnter="onCellChange(item)"
                                                    @blur="onCellChange(item)"></a-input>
                                            <a class="text-default" target="_blank" :href="item | showPreviewUrl"
                                               v-show="!item.editing">{{item.fullName}}</a>
                                        </a-tooltip>
                                    </div>
                                </a-list-item-meta>
                                <div class="other-info muted">
                                    <div class="info-item">
                                        <span>{{(formatSize(item.size))}}</span>
                                    </div>
                                    <div class="info-item">
                                        <a-tooltip :title="item.create_time">
                                            <span>{{ formatTime(item.create_time) }}</span>
                                        </a-tooltip>
                                    </div>
                                    <div class="info-item">
                                        <span>{{item.creatorName}}</span>
                                    </div>
                                </div>
                                <span slot="actions">
                                    <a-tooltip title="下载">
                                        <a class="muted" target="_blank" :href="item.file_url"><a-icon type="download"/></a>
                                    </a-tooltip>
                                </span>
                                <!-- <span slot="actions">
                                     <a-tooltip title="更新">
                                         <a-icon type="upload"/>
                                     </a-tooltip>
                                 </span>-->
                                <span slot="actions" @click="editFile(item,index)">
                                    <a-tooltip title="编辑">
                                        <a-icon type="edit"/>
                                    </a-tooltip>
                                </span>
                                <a class="muted" slot="actions">
                                    <a-dropdown :trigger="['click']" placement="bottomCenter">
                                        <a-tooltip :mouseEnterDelay="0.5">
                                            <template slot="title">
                                                <span>更多操作</span>
                                            </template>
                                            <a class="action-item muted">
                                                <a-icon type="down"/>
                                            </a>
                                        </a-tooltip>
                                        <a-menu class="field-right-menu"
                                                v-clipboard="item.file_url"
                                                @click="doFile($event,item.code)"
                                                slot="overlay">
                                            <a-menu-item key="copy">
                                                <a-icon type="link"/>
                                                <span>复制链接</span>
                                            </a-menu-item>
                                            <a-menu-item key="delete">
                                                <a-icon type="delete"/>
                                                <span>移到回收站</span>
                                            </a-menu-item>
                                        </a-menu>
                                    </a-dropdown>
                                </a>
                            </a-list-item>
                            <div v-if="showLoadingMore" slot="loadMore"
                                 :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                <a-spin v-if="loadingMore"/>
                                <a-button v-else @click="onLoadMore">查看更多文件</a-button>
                            </div>
                        </a-list>
                    </div>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {read as getProject} from "../../../api/project";
    import {collect} from "../../../api/projectCollect";
    import {checkResponse} from "../../../assets/js/utils";
    import {relativelyTime} from "../../../assets/js/dateTime";
    import {edit, list, recycle} from "../../../api/file";
    import pagination from "@/mixins/pagination";
    import {notice} from "../../../assets/js/notice";
    import projectSelect from '@/components/project/projectSelect'



    export default {
        name: "project-space-files",
        mixins: [pagination],
        data() {
            return {
                code: this.$route.params.code,
                loading: true,
                showLoadingMore: false,
                loadingMore: false,
                project: {task_board_theme: 'simple'},
                currentFileIndex: {},
                files: [],
            }
        },
        components: {
            projectSelect,
        },
        computed: {
            ...mapState({
                uploader: state => state.common.uploader,

            }),
        },
        watch: {
            uploader: {
                handler(newVal, oldVal) {
                    //监听是否有上传文件行为
                    const files = newVal.fileList;
                    const index = files.findIndex(item => item.projectName == this.project.name);
                    if (index !== -1) {
                        this.getFiles();
                    }
                },
                deep: true
            }
        },
        created() {
            this.getProject();
            this.getFiles();
        },
        mounted() {
            setTimeout(() => {
                this.uploader.assignBrowse(document.getElementById('upload-file'));
            }, 500)
        },
        methods: {
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                    this.$store.dispatch('setTempData', {
                        projectCode: this.project.code,
                    })
                });
            },
            getFiles(reset = true) {
                let app = this;
                if (reset) {
                    this.pagination.page = 1;
                    this.pagination.pageSize = 50;
                    this.showLoadingMore = false;
                }
                app.requestData.projectCode = this.code;
                app.requestData.deleted = 0;
                list(app.requestData).then(res => {
                    if (reset) {
                        this.files = [];
                    }
                    res.data.list.forEach((v) => {
                        v.editing = false;
                    });
                    app.files = app.files.concat(res.data.list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.files.length;
                    app.loading = false;
                    app.loadingMore = false
                })
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.getFiles(false);
            },
            collectProject() {
                const type = this.project.collected ? 'cancel' : 'collect';
                collect(this.project.code, type).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.project.collected = !this.project.collected;
                })
            },
            editFile(file, index) {
                let app = this;
                this.files.forEach((v) => {
                    v.editing = false;
                });
                this.files[index].editing = true;
                this.$nextTick(() => {
                    app.$refs[`inputTitle${index}`][0].focus();
                });
                this.currentFileIndex = index;
            },
            onCellChange(file) {
                let currentFile = this.files[this.currentFileIndex];
                this.files.forEach((v) => {
                    v.editing = false;
                });
                const fullName = `${file.title}.${file.extension}`;
                if (fullName != currentFile.fullName) {
                    edit({title: currentFile.title, fileCode: currentFile.code}).then(res => {
                        const result = checkResponse(res);
                        if (!result) {
                            return false;
                        }
                        currentFile.title = file.title;
                        currentFile.fullName = fullName;
                        notice({
                            title: '重命名成功',
                        }, 'notice', 'success');
                    });
                }
            },
            doFile(action, fileCode) {
                let app = this;
                const actionKey = action.key;
                switch (actionKey) {
                    case 'delete':
                        this.$confirm({
                            title: '移到回收站',
                            content: `您确定要把该文件移到回收站吗？`,
                            okText: '移到回收站',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                recycle(fileCode).then((res) => {
                                    const result = checkResponse(res);
                                    if (!result) {
                                        return false;
                                    }
                                    app.getFiles();
                                });
                                notice({
                                    title: '成功移到回收站',
                                    msg: '可在 菜单－查看回收站－文件 中查看'
                                }, 'notice', 'success', 5);
                                return Promise.resolve();
                            }
                        });
                        break;
                    case 'copy':
                        notice({
                            title: '复制链接成功',
                            msg: '在地址栏粘贴并打开可下载该资源'
                        }, 'notice', 'success', 5);
                        return true;
                }
            },
            formatTime(time) {
                return relativelyTime(time);
            },
            formatSize(size) {
                let type = 'KB';
                size = size / 1024;
                if (size >= 1024) {
                    size /= 1024;
                    type = 'MB';
                }
                return `${size.toFixed(2)} ${type}`;
            },
        }
    }
</script>

<style lang="less">
    /*@import "../../../assets/css/components/task";*/

    .project-space-files {
        .project-navigation {
            top: 65px;
            z-index: 4;
        }

        .wrapper-main {
            background: initial;

        }

        .layout-content {
            padding: 12px;
            width: 1100px;
            margin: 12px auto auto;
            background: initial;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .content-item {
                background: #fff;
                padding: 6px 0 18px 0;
                border-radius: 4px;

                .header {
                    padding: 12px 20px 6px 20px;
                    display: flex;
                    justify-content: space-between;

                    .title {
                        font-size: 18px;
                    }
                }
            }

            .content-wrapper {
                width: 100%;

                .log-list {
                    background: #fff;

                    .list-content {

                        .list-item-title {
                            padding: 10px 20px;

                            .ant-list-item-action {
                                li {
                                    color: #fff;
                                }

                                em {
                                    width: 0;
                                }
                            }
                        }

                        .list-item {
                            border-bottom: none;
                            margin-bottom: 2px;
                            /*border-bottom: 1px solid #f5f5f5;*/
                            padding: 10px 20px;
                            transition: background-color 218ms;

                            &:hover {
                                background-color: #f5f5f5;
                            }

                            .ant-list-item-meta-title {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                position: relative;
                                margin-bottom: 0;
                                line-height: 32px;
                            }

                            .ant-list-item-action {
                                em {
                                    width: 0;
                                }
                            }
                        }

                        .other-info {
                            display: flex;

                            .info-item {
                                display: flex;
                                flex-direction: column;
                                padding-left: 0;
                                width: 90px;
                                text-align: right;
                            }

                            .schedule {
                                width: 250px;
                            }
                        }
                    }
                }
            }

            .content-right {
                width: 325px;
            }
        }
    }
</style>
