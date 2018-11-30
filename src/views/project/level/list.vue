<template>
    <div>
        <wrapper-content pageTitle="等级列表">
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button permission="Project_Level.addLevel"
                                @click="form_modal = !form_modal,form_action = 'add'" type="primary"
                                shape="circle" icon="md-add">添加等级
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button @click="del_model = true" type="default" shape="circle"
                                :disabled="select_items.length <= 0">删除等级
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>等级名称：</span>
                                        <p>项目的评级名称。</p></li>
                                    <li><span>金额：</span>
                                        <p>项目的提成金额。</p></li>
                                    <li><span>排序：</span>
                                        <p>等级排序，值越大越靠前，最小为0。</p></li>
                                    <li><span>创建时间：</span>
                                        <p>等级信息的创建时间。</p></li>
                                    <li><span>编辑：</span>
                                        <p>编辑等级信息。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="level_list" class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="userCount > 0" :total="userCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ userCount }} 条</slot>
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
                <Form-item prop="level_name">
                    <Input v-model="formValidate.level_name" type="text" placeholder="等级名称，项目的难度评级"/>
                </Form-item>
                <Form-item prop="money">
                    <Input v-model="formValidate.money" type="text" placeholder="等级金额，用以计算业绩"/>
                </Form-item>
                <Form-item prop="sort">
                    <Input v-model="formValidate.sort" placeholder="等级排序，值越大越靠前，不写的话为0" type="text"/>
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
                <Button type="text" @click="del_model = false">取消</Button>
                <Button type="error" :loading="send_loading" @click="delConfirm">删了</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>

    </div>
</template>
<script>
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getLevelList,getLevelInfo,doProjectLevel,delLevel} from "@/api/project";
    import $ from 'jquery'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                form_modal: false,
                form_action: 'add',
                form_title: '添加新等级',
                form_url: 'add',
                form_submit: '添加',
                formValidate: {
                    level_id: 0,
                    level_name: '',
                    money: '',
                    sort: ''
                },
                ruleValidate: {
                    level_name: [
                        {required: true, message: '等级名称不能为空', trigger: 'blur'}
                    ],
                    money: [
                        {required: true, message: '等级金额不能为0', trigger: 'blur'}
                    ]
                },
                del_model: false,
                select_items: [],
                send_loading: false,
                page_size: 10,
                page_num: 1,
                keyword: '',
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '等级名称',
                        key: 'level_name'
                    },
                    {
                        title: '金额',
                        key: 'money',
                        sortable: true,
                    },
                    {
                        title: '排序',
                        key: 'sort',
                        sortable: true,
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '编辑',
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
                                ])
                            ])
                        }
                    }
                ],
                level_list: [],
                userCount: 0,
            }
        },
        watch: {
            form_action: function (value) {
                if (value === 'add') {
                    this.form_title = '添加新等级';
                    this.form_submit = '添加';
                    this.form_url = 'add'
                } else {
                    this.form_title = '编辑等级';
                    this.form_submit = '保存';
                    this.form_url = 'edit';
                }
            },
            form_modal: function (value) {
                if (value === false) {
                    this.formValidate = {
                        level_id: 0,
                        level_name: '',
                        money: '',
                        sort: ''
                    }
                }
            },
            keyword: function (newQuestion) {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getLevelList()
                }
            }
        },
        created: function () {
            this.getLevelList()
        },
        methods: {
            getLevelList() {
                let app = this;
                app.loading = true;
                getLevelList('sort asc',this.page_size,this.page_num,this.keyword).then(res=>{
                    app.loading = false;
                    app.level_list = res.data.list;
                    app.userCount = Number(res.data.count)
                });
            },
            getInfo() {
                let app = this;
                getLevelInfo(app.formValidate.level_id).then(res=>{
                    if (res.data) {
                        app.formValidate.level_id = res.data.id;
                        app.formValidate.level_name = res.data.level_name;
                        app.formValidate.money = res.data.money;
                        app.formValidate.sort = res.data.sort;
                    }
                });
            },
            editItem(id) {
                this.formValidate.level_id = id;
                this.getInfo();
                this.form_modal = true;
                this.form_action = 'edit'
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formValidate.sort < 0) {
                            this.$Message.warning('等级排序不能小于0');
                            return false
                        }
                        let app = this;
                        this.send_loading = true;
                        doProjectLevel(app.form_url,app.formValidate).then(res=>{
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning(msg);
                            } else {
                                app.form_modal = false;
                                app.$Message.success('操作成功');
                                app.getLevelList()
                            }
                            app.send_loading = false;
                        });
                    }
                })
            },
            delConfirm() {
                this.delItem()
            },
            delItem() {
                let app = this;
                app.send_loading = true;
                delLevel(JSON.stringify(app.select_items)).then(res=>{
                    app.send_loading = false;
                    app.del_model = false;
                    if (res.ret === 200) {
                        app.$Message.success('删除成功');
                        app.getLevelList();
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getLevelList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_items = [];
                $.each(selection, function (k, v) {
                    app.select_items.push(v.id)
                });
            },
            changePage(page) {
                this.page_num = page;
                this.getLevelList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getLevelList();
            },
            reloadList() {
                this.getLevelList(1, this.page_size)
            },
            rowClassName(row, index) {
                return 'rowClassName';
            },
        }
    }
</script>
