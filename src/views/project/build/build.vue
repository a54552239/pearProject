<template>
    <div class="build-page">
        <div class="project-navigation">
            <div class="project-nav-header">
                <Breadcrumb class="text-default" separator=">">
                    <Breadcrumb-item>{{ project_info.name }}</Breadcrumb-item>
                </Breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li><a class="app" data-app="tasks" @click="goTasks()">任务</a></li>
                    <li class=""><a class="app" data-app="works" @click="$router.push('/project/file/' + project_id)"> 文件 </a>
                    <li class="actives"><a class="app" data-app="build"> 版本 </a></li>
                </ul>
            </section>
        </div>
        <wrapper-content pageTitle="更新日志">
            <div slot="page-action" class="page-action">
                <div class="filter-content vertical-middle">
                    <Button permission="Project_Project.addProjectBuild" type="primary" shape="circle" icon="md-add"
                            @click="addBuild">发布版本
                    </Button>
                    <div class="search-input">
                        <Input class="search-input" v-model="list_keyword" icon="ios-search-strong" placeholder="搜索"/>
                    </div>
                </div>
            </div>
            <div class="data-content">
                <Row>
                    <i-col>
                        <div class="build-content m-t-lg" style="background-color: #FFF;padding-bottom: 50px;">
                            <Timeline class="build-list" v-if="build_list.length > 0">
                                <TimelineItem v-for="(build,index) in build_list" :key="index">
                                    <Poptip placement="top-start">
                                        <a><h3>{{ build.name }}</h3></a>
                                        <div slot="title"><span>日志操作</span></div>
                                        <div slot="content">
                                            <Button size="small" type="error" @click="deleteBuild(build.id,index)">删除
                                            </Button>
                                            <Button size="small" type="primary" @click="editBuild(build.id)">编辑</Button>
                                        </div>
                                    </Poptip>
                                    <p class="code">{{ build.date }}</p>
                                    <p class="content" v-html="build.desc"></p>
                                </TimelineItem>
                            </Timeline>
                            <div v-else>
                                暂无版本信息
                            </div>
                        </div>
                    </i-col>
                </Row>
            </div>
        </wrapper-content>
        <Modal
                v-model="delete_build_modal"
                title="操作提示">
            <p>确定要永远删除当前版本吗？删除后无法恢复</p>
            <div slot="footer">
                <Button type="text" @click="delete_build_modal = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="confirmDelBuild">删了</Button>
            </div>
        </Modal>
        <Modal
                v-model="build_modal"
                class="form-modal">
            <p slot="header" style="text-align:center;">
                <span>发布新版本</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"
                  label-position="left">
                <Form-item label="" prop="name">
                    <Input v-model="formValidate.name" placeholder="版本名称" type="text"/>
                </Form-item>
                <Form-item label="" prop="name">
                    <editor ref="vueWangeditor_add" @load="editorLoad" @change="editorChange"
                            :width="editor_style.width" :height="editor_style.height"
                            :uploadImgUrl="uploadImgUrl" :uploadParams="uploadParams"
                            :uploadHeaders="uploadHeaders" :menus="menus"
                            id="editor"></editor>
                </Form-item>
                <div class="footer-item">
                    <Form-item>
                        <Button class="m-t-lg" type="primary" size="large" @click="handleSubmit('formValidate','add')"
                                :loading="send_loading" long>发布
                        </Button>
                    </Form-item>
                </div>
            </Form>
            <div slot="footer">
                <!--<Button type="text" @click="build_modal = false">再想想</Button>-->
                <!--<Button type="error" :loading="send_loading" @click="confirmDelBuild">发布</Button>-->
            </div>
        </Modal>
        <Modal
                v-model="edit_build_modal"
                class="form-modal">
            <p slot="header" style="text-align:center;">
                <span>日志编辑</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"
                  label-position="left">
                <Form-item label="" prop="name">
                    <Input v-model="formValidate.name" placeholder="版本名称" type="text"/>
                </Form-item>
                <Form-item label="" prop="name">
                    <editor ref="vueWangeditor_edit" @load="editorLoad" @change="editorChange"
                            :width="editor_style.width" :height="editor_style.height"
                            :uploadImgUrl="uploadImgUrl" :uploadParams="uploadParams"
                            :uploadHeaders="uploadHeaders" :menus="menus"
                            id="editor"/>
                </Form-item>
                <div class="footer-item">

                    <Form-item>
                        <Button class="m-t-lg" type="primary" size="large" @click="handleSubmit('formValidate','edit')"
                                :loading="send_loading" long>发布
                        </Button>
                    </Form-item>
                </div>
            </Form>
            <div slot="footer">
                <!--<Button type="text" @click="build_modal = false">再想想</Button>-->
                <!--<Button type="error" :loading="send_loading" @click="confirmDelBuild">发布</Button>-->
            </div>
        </Modal>
    </div>
</template>
<style>
    .build-page .wrapper-content {
        /*position: fixed;*/
        padding: 130px 240px 0 240px;
        height: 100%;
    }

    .build-page .wrapper-content .data-content {
        margin-top: 0;
    }

    .build-content {
        background: #f5f5f5;
    }

    .build-content .link-icon {
        font-size: 32px;
    }

    .build-page .ivu-tooltip-popper {
        position: absolute !important;
    }

    .build-page .library-header {
        padding: 15px 0 0 0;
        font-size: 15px;
        height: 62px;
    }

    .build-page .library-header a {
        padding-right: 15px;
    }

    .build-page .library-title {
        font-size: 18px;
    }

    .build-page .library-count {
        padding: 6px 15px;
    }

    .build-page .ivu-timeline-item-content {
        top: -6px;
    }

    .build-page .build-list p {
        margin-top: 10px;
    }

    .build-page .build-list .ivu-poptip {
        display: block;
    }

    .build-page .code {
        display: inline-block;
        background: #f7f7f7;
        font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
        margin: 0 3px;
        padding: 1px 5px;
        border-radius: 3px;
        color: #666;
        border: 1px solid #eee;
    }

</style>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getProjectBuildList,getBuildInfo,deleteProjectBuild,getInfo,doProjectBuild} from "@/api/project";
    import * as utils from '../../../assets/js/utils'
    import $ from 'jquery'
    import _ from 'lodash'
    import editor from '../../../components/editor_2.0.vue'

    export default {
        components: {
            WrapperContent,
            editor
        },
        data() {
            return {
                edit_build_modal: false,
                delete_build_modal: false,
                build_modal: false,
                send_loading: false,
                build_id: 0,
                build_index: 0,
                select_builds: [],
                list_keyword: '',
                project_info: {},
                project_id: this.$route.params.project_id,
                build_list: [],
                editor_style: {
                    width: 'auto',
                    height: '250'
                },
                uploadImgUrl: utils.getUploadUrl('Project_Task.uploadContentImg'),
                uploadHeaders: {
                    token: utils.getStore('token')
                },
                uploadParams: {
                    task_id: 0
                },
                menus: [
                    'head',	// 标题
                    'bold',	// 粗体
                    'italic',	// 斜体
                    'aligncenter',	// 居中
                    'img',	// 图片
                    'link',	// 链接
                    'unorderlist',	// 无序列表
                    'orderlist',	// 有序列表
                    'quote',	// 引用
                    'table',	// 表格
                    '|',
                    'fullscreen'	// 全屏
                ],
                formValidate: {
                    project_id: this.$route.params.project_id,
                    id: 0,
                    name: '',
                    desc: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '不要忘记填写版本名称', trigger: 'blur'}
                    ],
                }
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
            this.getProjectInfo();
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
                getProjectBuildList(app.project_id,app.list_keyword).then(res => {
                    app.build_list = res.data.list;

                });
            },
            editBuild(build_id) {
                let app = this;
                getBuildInfo(build_id).then(res => {

                    app.edit_build_modal = true
                    app.initContent(res.data.desc)
                    app.formValidate = {
                        id: res.data.id,
                        name: res.data.name,
                        desc: res.data.desc
                    }
                });
            },
            addBuild() {
                let app = this;
                app.build_modal = true;
                app.initContent(false);
                app.formValidate = {
                    id: 0,
                    name: '',
                    desc: ''
                }
            },
            deleteBuild(build_id, index) {
                this.build_id = build_id;
                this.build_index = index;
                this.delete_build_modal = true
            },
            confirmDelBuild() {
                let app = this;
                app.send_loading = true;
                deleteProjectBuild(app.build_id).then(res => {
                    const result = utils.showBack(res);
                    if (!result) {
                        app.$Message.warning({
                            content: res.msg,
                            duration: 5
                        });
                    } else {
                        app.delete_build_modal = false;
                        app.build_list.splice(app.build_index, 1)
                    }
                    app.send_loading = false
                });
            },
            getProjectInfo() {
                let app = this;
                getInfo(app.project_id).then(res => {
                    app.project_info = res.data
                });
            },
            selectItem(selection) {
                let app = this;
                app.select_builds = [];
                $.each(selection, function (k, v) {
                    app.select_builds.push(v.id)
                });
            },
            editorLoad(originalName, resultText) {
                // resultText 服务器端返回的text
                // originalName 上传文件名
                this.$refs.vueWangeditor.insertImg(resultText)
            },
            editorChange(a) {
//                console.log(a)
            },
            initContent(value) {
                if (value) {
                    this.$refs.vueWangeditor_edit.setHtml(value);
                    this.$refs.vueWangeditor_add.setHtml(value)
                } else {
                    this.$refs.vueWangeditor_add.setHtml('');
                    this.$refs.vueWangeditor_edit.setHtml('')
                }
            },
            handleSubmit(name, type) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        if (type === 'edit') {
                            this.formValidate.desc = app.$refs.vueWangeditor_edit.getHtml()
                        } else {
                            this.formValidate.desc = app.$refs.vueWangeditor_add.getHtml()
                        }
                        this.formValidate.project_id = this.project_id;
                        this.send_loading = true;
                        doProjectBuild(app.formValidate).then(res => {
                            const result = utils.showBack(res);
                            if (!result) {
                                app.$Message.warning({
                                    content: res.msg,
                                    duration: 5
                                });
                            } else {
                                app.build_modal = false;
                                app.edit_build_modal = false;
                                app.initContent(false);
                                app.formValidate = {
                                    id: 0,
                                    name: '',
                                    desc: ''
                                };
                                app.$Message.success('操作成功');
                                app.getList()
                            }
                            app.send_loading = false;
                        }).catch(res=>{
                            app.send_loading = false;
                        });
                    }
                })
            },
            goTasks() {
                const url = '/project/task/' + this.project_id + '?project_name=' + this.project_info.name
                this.$router.push(url)
            },
        }
    };
</script>
