<template>
    <div>
        <wrapper-content pageTitle="用户组列表">
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <router-link permission="System_AuthGroup.addGroup" to="/system/auth_group/add">
                            <Button type="primary" shape="circle" icon="md-add">
                                新增用户组
                            </Button>
                        </router-link>
                    </div>
                    <div class="right-actions">
                        <Button permission="System_AuthGroup.delGroup" @click="del_model = true" type="default"
                                shape="circle" icon="trash-b" :disabled="select_groups.length <= 0">
                            删除
                        </Button>
                        <div class="search-input">
                            <Input class="search-input" v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>分组名称：</span>
                                        <p>用户组名称，用于表示具有相同操作权限的用户群体。</p></li>
                                    <li><span>描述：</span>
                                        <p>用户组的详细描述。</p></li>
                                    <li><span>状态：</span>
                                        <p>用户组的启用/禁用状态，若禁用，用户将无法获得该用户组的操作权限。</p></li>
                                    <li><span>创建时间：</span>
                                        <p>用户组初次创建的时间。</p></li>
                                    <li><span>操作：</span>
                                        <p>编辑用户组信息以及操作权限。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="group_list" @on-selection-change="selectItem"
                       class="no-border-table"></Table>
                <Page v-if="groupCount > 0" :total="groupCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small"
                      show-total show-sizer class="table-page">
                    <slot class="total">共 {{ groupCount }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
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
    import * as Time from '../../../assets/js/date_time'
    import {delGroup,getAuthGroupList} from "@/api/system";

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
                select_groups: [],
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
                        title: '分组名称',
                        key: 'title',
                        render: (h, params) => {
                            return h('router-link', {
                                attrs: {
                                    to: 'user_list/' + params.row.id + '?title=' + params.row.title
                                }
                            }, params.row.title);
                        }
                    },
                    {
                        title: '描述',
                        key: 'desc',
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h, params) => {
                            if (params.row.status == 1) {
                                return h('span', '正常');
                            } else {
                                return h('span', '禁用');
                            }
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'add_time',
                        render: (h, params) => {
                            return h('span', Time.format_date(params.row.add_time));
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 150,
                        render(h, params) {
                            return h('router-link', {
                                attrs: {
                                    to: 'edit/' + params.row.id
                                },
                                style: {
                                    color: '#9ea7b4',
                                    fontSize: '14px'
                                },
                            }, [
                                h('Icon', {
                                    props: {
                                        type: 'ios-create-outline'
                                    }
                                }),
                            ]);
                        }
                    }
                ],
                group_list: [],
                groupCount: 0,
            }
        },
        watch: {
            keyword: function (newQuestion) {
                this.search()
            },
        },
        created: function () {
            this.getList()
        },
        methods: {
            delConfirm() {
                this.delItem()
            },
            delItem() {
                let app = this;
                app.send_loading = true;
                delGroup(JSON.stringify(app.select_groups)).then(res=>{
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
            getList() {
                let app = this;
                app.select_groups = [];
                app.loading = true;
                getAuthGroupList(this.page_size,this.page_num,this.keyword).then(res=>{
                    app.loading = false;
                    app.group_list = res.data.list;
                    app.groupCount = Number(res.data.count)
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_groups = [];
                $.each(selection, function (k, v) {
                    app.select_groups.push(v.id)
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
            rowClassName(row, index) {
                return 'rowClassName';
            },
        }
    }
</script>
<style>

    .name-link {
        padding: 0 !important;
    }

    .name-link:hover {
        text-decoration: underline !important;
    }

    .data-content {
        margin-top: 15px;
    }

    .member-list > li {
        line-height: 35px;
    }

    .name-label {
        vertical-align: middle;
    }
</style>
