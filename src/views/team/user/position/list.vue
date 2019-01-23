<template>
    <div>
        <wrapper-content pageTitle="职位列表">
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button permission="Team_Team.addTeam" @click="form_modal = !form_modal,form_action = 'add'"
                                type="primary"
                                shape="circle" icon="md-add">添加职位
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button @click="del_model = true" type="default" shape="circle"
                                :disabled="select_positions.length <= 0">删除职位
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>职位名称：</span>
                                        <p>职位在系统内的名称。</p></li>
                                    <li><span>排序：</span>
                                        <p>职位排序，数值越大越靠前。</p></li>
                                    <li><span>编辑：</span>
                                        <p>编辑职位信息。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="team_list" class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="teamCount > 0" :total="teamCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ teamCount }} 条</slot>
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
                <Form-item label="" prop="position_name">
                    <Input v-model="formValidate.position_name" placeholder="中文名称，举个栗子：首席执行官" type="text"/>
                </Form-item>
                <Form-item label="" prop="eng_name">
                    <Input v-model="formValidate.eng_name" placeholder="英文名称，举个栗子：CEO" type="text"/>
                </Form-item>
                <Form-item label="" prop="sort">
                    <Input v-model="formValidate.sort" placeholder="职位排序，不想写的话为0" type="text"/>
                </Form-item>
                <Form-item label="" prop="position_desc">
                    <Input v-model="formValidate.position_desc" placeholder="详细描述，担心忘记含义的写上" type="textarea"/>
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
<script>
    import WrapperContent from '@/components/wrapper-content.vue'
    import {getPositionList,doPosition,getPositionInfo,delPosition} from "@/api/user";
    import $ from 'jquery'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                del_model: false,
                form_modal: false,
                select_positions: [],
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
                        title: '职位名称',
                        key: 'position_name',
                        sortable: true,
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    to: '/team/user/position/detail/' + params.row.id
                                }
                            }, params.row.position_name);
                        }
                    },
                    {
                        title: '英文名称',
                        key: 'eng_name',
                    },
                    {
                        title: '排序',
                        key: 'sort',
                        sortable: true
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
                team_list: [],
                teamCount: 0,
                form_action: 'add',
                form_title: '添加新职位',
                form_url: 'add',
                form_submit: '添加',
                formValidate: {
                    position_id: 0,
                    position_name: '',
                    eng_name: '',
                    sort: '',
                    position_desc: '',
                },
                ruleValidate: {
                    position_name: [
                        {required: true, message: '中文名称不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {
            keyword: function (newQuestion) {
                this.search()
            },
            form_action: function (value) {
                if (value === 'add') {
                    this.form_title = '添加新职位';
                    this.form_submit = '添加';
                    this.form_url = 'add'
                } else {
                    this.form_title = '编辑职位';
                    this.form_submit = '保存';
                    this.form_url = 'edit'
                }
            },
            form_modal: function (value) {
                if (value === false) {
                    this.formValidate = {
                        position_id: 0,
                        position_name: '',
                        eng_name: '',
                        sort: '',
                        position_desc: '',
                    }
                }
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getList()
                }
            }
        },
        created: function () {
            this.getList()
        },
        methods: {
            getList() {
                let app = this;
                app.loading = true;
                getPositionList(this.page_size,this.page_num,this.keyword).then(res => {
                    app.loading = false;
                    app.team_list = res.data.list;
                    app.teamCount = Number(res.data.count)
                });
            },
            getInfo() {
                let app = this;
                getPositionInfo(app.formValidate.position_id).then(res=>{
                    if (res.data) {
                        app.formValidate.position_name = res.data.position_name;
                        app.formValidate.eng_name = res.data.eng_name;
                        app.formValidate.position_desc = res.data.position_desc;
                        app.formValidate.sort = res.data.sort
                    }
                });
            },
            editItem(id) {
                this.formValidate.position_id = id;
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
                delPosition(JSON.stringify(app.select_positions)).then(res => {
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
                // 这是我们为职位停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_positions = [];
                $.each(selection, function (k, v) {
                    app.select_positions.push(v.id)
                });
            },
            changePage(page) {
                this.page_num = page;
                this.getList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getList()
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
                        doPosition(app.form_url,app.formValidate).then(res => {
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
                        });
                    }
                })
            },
        }
    };
</script>
