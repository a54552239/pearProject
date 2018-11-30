<template>
    <div class="file-page">
        <div class="project-navigation">
            <div class="project-nav-header">
                <Breadcrumb class="text-default" separator=">">
                    <Breadcrumb-item>{{ project_info.name }}</Breadcrumb-item>
                </Breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li><a class="app" data-app="tasks" @click="goTasks()">任务</a></li>
                    <li class="actives"><a class="app" data-app="works"> 文件 </a></li>
                    <li class=""><a class="app" data-app="build" @click="$router.push('/project/build/' + project_id)">
                        版本 </a></li>
                </ul>
            </section>
        </div>
        <wrapper-content pageTitle="文件库">
            <div slot="page-action" class="page-action">
                <div class="filter-content vertical-middle">
                    <Upload ref="upload"
                            :action="upload_config.url"
                            :name="upload_config.name"
                            :headers="upload_config.headers"
                            :data="upload_config.data"
                            :show-upload-list="false"
                            :on-progress="uploadProgress"
                            :on-success="uploadSuccess">
                        <Button type="text" icon="md-cloud-upload" @click="upload_file_modal = !upload_file_modal">上传
                        </Button>
                    </Upload>
                    <div class="search-input">
                        <Input class="search-input" v-model="list_keyword" icon="ios-search-strong" placeholder="搜索"/>
                    </div>
                </div>
            </div>
            <div class="data-content">
                <Row>
                    <i-col>
                        <div class="file-content" style="background-color: #FFF;padding-bottom: 50px;">
                            <div class="library-header vertical-middle">
                                <span class="muted" v-if="select_files.length > 0">
                                    <span class="library-count">已选择 {{ select_files.length }} 项</span>
                                    <a class="muted" @click="batchDownloadFile">
                                        <Icon type="ios-download-outline" size="16"></Icon> 下载
                                    </a>
                                    <a class="muted">
                                        <Icon type="ios-trash-outline" size="16"></Icon> 删除
                                    </a>
                               </span>
                            </div>
                            <Table
                                    :columns="file_columns"
                                    :data="file_list"
                                    :row-class-name="rowClass"
                                    @on-selection-change="selectItem"
                                    class="no-border-table">
                            </Table>
                        </div>
                    </i-col>
                </Row>
            </div>
        </wrapper-content>
        <Modal
                v-model="delete_file_modal"
                title="操作提示">
            <p>确定要永远删除这个文件吗？删除后无法恢复</p>
            <div slot="footer">
                <Button type="text" @click="delete_file_modal = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="confirmDelTaskFile">删了</Button>
            </div>
        </Modal>
    </div>
</template>
<style>
    .file-page .wrapper-content {
        /*position: fixed;*/
        padding: 130px 240px 0 240px;
        height: 100%;
    }

    .file-page .wrapper-content .data-content {
        margin-top: 0;
    }

    .file-content {
        background: #f5f5f5;
    }

    .file-content .link-icon {
        font-size: 32px;
    }

    .file-page .ivu-tooltip-popper {
        position: absolute !important;
    }

    .file-page .library-header {
        padding: 15px 0 0 0;
        font-size: 15px;
        height: 62px;
    }

    .file-page .library-header a {
        padding-right: 15px;
    }

    .file-page .library-title {
        font-size: 18px;
    }

    .file-page .library-count {
        padding: 6px 15px;
    }

</style>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getProjectFileList,getInfo,delTaskFile} from "@/api/project";

    import * as utils from '../../../assets/js/utils'
    import {format} from "../../../assets/js/file_format";
    import * as Time from '../../../assets/js/time_format'
    import $ from 'jquery'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                upload_file_modal: false,
                delete_file_modal: false,
                send_loading: false,
                file_id: 0,
                file_index: 0,
                select_files: [],
                list_keyword: '',
                project_info: {},
                project_id: this.$route.params.project_id,
                file_list: [],
                file_columns: [
                    //todo 增加多选，批量删除，批量下载（打包zip后下载）
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        width: 450,
                        key: 'old_file_name',
                        render: (h, params) => {
                            return h('div', {
                                class: 'vertical-middle'
                            }, [
                                h('svg', {
                                    class: 'icon link-icon m-r'
                                }, [
                                    h('use', {
                                        attrs: {
                                            href: this.formatFile(params.row.extension)
                                        }
                                    })
                                ]),
                                h('span', params.row.title)
                            ])
                        }
                    },
                    {
                        title: '大小',
                        key: 'file_size',
                        sortable: true,
                        render: (h, params) => {
                            return h('span',
                                params.row.size / 1000 + 'KB')
                        }
                    },
                    {
                        title: '创建者',
                        key: 'user_info',
                        render: (h, params) => {
                            return h('span',
                                params.row.user_info.realname)
                        }
                    },
                    {
                        title: '更新时间',
                        key: 'add_time',
                        sortable: true,
                        render: (h, params) => {
                            return h('Tooltip', {
                                props: {
                                    content: this.showFileTime(params.row.addedDate, false),
                                    placement: 'top'
                                }
                            }, [
                                h('span', this.showFileTime(params.row.addedDate, true))
                            ])
                        }
                    },
                    {
                        title: ' ',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '下载',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-download-outline',
                                            size: '24'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.downloadFile(params.row.id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '更新',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-cloud-upload-outline',
                                            size: '24'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.editItem(params.row.project_id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '重命名',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-create-outline',
                                            size: '24'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.editItem(params.row.project_id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '删除',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-trash-outline',
                                            size: '24'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.delete_file_modal = true;
                                                this.file_id = params.row.id;
                                                this.file_index = params.index
                                            }
                                        }
                                    })
                                ])
                            ])
                        }
                    }
                ],
                rowClass(row, index) {
                    return 'file-row-class';
                },
                upload_config: {
                    url: utils.getUploadUrl('Project_Task.uploadTaskFile'),
                    headers: {
                        token: utils.getStore('token')
                    },
                    name: 'file',
                    data: {
                        //todo 上传文件
//            id: 163
                    }
                },
            }
        },
        watch: {
            list_keyword: function () {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getList()
                }
            }
        },
        created: function () {
            this.getList();
            this.getProjectInfo()
        },
        methods: {
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                // 这是我们为等级停止输入等待的毫秒数
                500
            ),
            getList() {
                let app = this;
                getProjectFileList(app.project_id,app.list_keyword).then(res => {
                    app.file_list = res.data.list
                });
            },
            getProjectInfo() {
                let app = this;
                getInfo(app.project_id).then(res => {
                    app.project_info = res.data
                });
            },
            confirmDelTaskFile() {
                let app = this;
                this.send_loading = true;
                delTaskFile(this.file_id).then(res => {
                    app.send_loading = false;
                    app.delete_file_modal = false;
                    app.file_list.splice(app.file_index, 1)
                });
            },
            selectItem(selection) {
                let app = this;
                app.select_files = [];
                $.each(selection, function (k, v) {
                    app.select_files.push(v.id)
                });
            },
            formatFile(file_ext) {
                return format(file_ext)
            },
            downloadFile(file_id) {
                window.open(utils.getDirectUrl('Project_Task.downloadTaskFile&file_id=' + file_id))
            },
            batchDownloadFile() {
                window.open(utils.getFullUrl('Project_Project.batchDownloadTaskFile&ids=' + JSON.stringify(this.select_files)))
            },
            showFileTime(time, prettyTime) {
                if (prettyTime) {
                    return Time.showBeforeTime(time)
                } else {
                    return Time.showBeforeTime(time, false)
                }
            },
            uploadProgress(event, file, fileList) {
                let app = this;
                this.send_loading = true;
                setTimeout(function () {
                    if (app.send_loading) {
                        app.$Message.loading({
                            content: '正在上传，请稍后...',
                            duration: 10
                        })
                    }
                }, 500)
            },
            uploadSuccess(response, file, fileList) {
                let result = utils.showBack(response);
                this.send_loading = false
                if (result) {;
                    this.$Message.destroy();
                    this.$Message.success({
                        content: '上传文件成功',
                        duration: 3
                    });
                    this.getList()
                } else {
                    this.$Message.destroy();
                    this.$Message.error({
                        content: response.msg,
                        duration: 3
                    });
                    this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
                }
            },
            goTasks() {
                const url = '/project/task/' + this.project_id + '?project_name=' + this.project_info.name
                this.$router.push(url)
            },
        }
    };
</script>
