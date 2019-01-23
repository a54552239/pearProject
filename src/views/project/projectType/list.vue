<template>
    <div>
        <wrapper-content pageTitle="类型列表">
            <div slot="page-action" class="page-action">
                <div class="filter-content">
                </div>
            </div>
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button permission="Project_ProjectType.addProject"
                                @click="form_modal = !form_modal,form_action = 'add'" type="primary"
                                shape="circle" icon="md-add">添加
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button permission="Project_ProjectType.delProject" @click="del_model = true" type="default"
                                shape="circle"
                                :disabled="select_projects.length <= 0">删除
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>类型名称：</span>
                                        <p>类型的名称。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="project_type_list" class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="project_type_count > 0" :total="project_type_count" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ project_type_count }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
        <Modal
                v-model="form_modal"
                width="360"
                class="form-modal">
            <p slot="header" style="text-align:center;">
                <span>{{ form_title }}</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"
                  label-position="left">
                <Form-item label="" prop="name">
                    <Input v-model="formValidate.name" placeholder="类型名称" type="text"/>
                </Form-item>
                <Form-item prop="memo">
                    <Input v-model="formValidate.memo" placeholder="详细描述" type="textarea"/>
                </Form-item>
                <Form-item label="" prop="sort">
                    <Input v-model="formValidate.sort" placeholder="排序" type="text"/>
                </Form-item>
                <div class="footer-item">
                    <Form-item>
                        <Button type="primary" size="large" @click="handleSubmit('formValidate')"
                                :loading="send_loading" long>{{ form_submit }}
                        </Button>
                    </Form-item>
                </div>
            </Form>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
                v-model="del_model"
                title="操作提示">
            <p>真的要删除当前选中项吗？一旦删除将无法恢复，请想好了再决定 </p>
            <div slot="footer">
                <Button type="text" @click="del_model = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="delConfirm">删了</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>

    </div>
</template>
<style>

</style>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getTypeList,getTypeInfo,delProjectType,doProjectType} from "@/api/project";
    import $ from 'jquery'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                level_list: [],
                ticket_list: [],
                type_list: [],
                current_project_type_id: 0,
                project_user_list: [],
                user_keyword: '',
                user_modal: false,
                data_loading: false,
                del_model: false,
                form_modal: false,
                select_projects: [],
                send_loading: false,
                page_size: 10,
                page_num: 1,
                keyword: '',
                loading: false,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '类型名称',
                        key: 'name'
                    },
                    {
                        title: '排序',
                        key: 'sort',
                        sortable: true,
                    },
                    {
                        title: '描述',
                        key: 'memo',
                    },
                    {
                        title: ' ',
                        key: 'action',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '类型编辑',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-create-outline',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.editItem(params.row.id)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '任务类型模板',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-pricetag',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.$router.push('/project/task_type_template/' + params.row.id)
                                            }
                                        }
                                    })
                                ])
                            ])
                        }
                    }
                ],
                project_state: -1,
                project_type_list: [],
                project_type_count: 0,
                form_action: 'add',
                form_title: '添加新类型',
                form_url: 'add',
                form_submit: '添加',
                formValidate: {
                    project_type_id: 0,
                    name: '',
                    memo: '',
                    sort: '0',
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '写上类型名称吧', trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {
            user_keyword: function () {
                this.list_search()
            },
            keyword: function () {
                this.search()
            },
            form_action: function (value) {
                if (value === 'add') {
                    this.form_title = '添加新类型';
                    this.form_submit = '添加';
                    this.form_url = 'add'
                } else {
                    this.form_title = '编辑类型';
                    this.form_submit = '保存';
                    this.form_url = 'edit'
                }
            },
            form_modal: function (value) {
                if (value === false) {
                    this.formValidate = {
                        project_type_id: 0,
                        name: '',
                        memo: '',
                        sort: '0',
                    }
                }
            },
            project_state: function (value) {
                this.getList()
            },
        },
        created: function () {
            let app = this;
            this.getList()
        },
        methods: {
            getList() {
                let app = this;
                getTypeList(this.page_size,this.page_num,this.keyword).then(res=>{
                    app.project_type_list = res.data.list;
                    app.project_type_count = Number(res.data.count);
                });
            },
            getInfo() {
                let app = this;
                getTypeInfo(app.formValidate.project_type_id).then(res => {
                    if (res.data) {
                        app.formValidate.name = res.data.name;
                        app.formValidate.sort = res.data.sort;
                        app.formValidate.memo = res.data.memo
                    }
                });
            },
            editItem(id) {
                this.formValidate.project_type_id = id;
                this.getInfo();
                this.form_modal = true;
                this.form_action = 'edit'
            },
            delConfirm() {
                this.delItem()
            },
            delItem() {
                let app = this;
                app.send_loading = true;
                delProjectType(JSON.stringify(app.select_projects)).then(res => {
                    app.send_loading = false;
                    app.del_model = false;
                    if (res.ret === 200) {
                        app.$Message.success('删除成功');
                        app.getList()
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                // 这是我们为等级停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_projects = [];
                $.each(selection, function (k, v) {
                    app.select_projects.push(v.id)
                });
            },
            changePage(page) {
                this.page_num = page;
                this.getList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getList();
            },
            reloadList() {
                this.getList(1, this.page_size)
            },
            rowClassName(row, index) {
                return 'rowClassName';
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let app = this;
                        this.send_loading = true;
                        doProjectType(app.form_url, app.formValidate).then(res=>{
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning({
                                    content: msg,
                                    duration: 5
                                });
                            } else {
                                app.form_modal = false;
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
        }
    };
</script>
