<template>
    <div>
        <wrapper-content pageTitle="权限列表">
            <div>
                <span v-for="(title,index) in prev_titles" :key="index">{{ title }} <span
                        v-if="index < prev_titles.length - 1"> > </span></span>
            </div>
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <router-link permission="System_AuthRule.addRule" :to="'/system/auth_rule/add?pid='+pid">
                            <Button type="primary" shape="circle" icon="md-add">
                                新增权限
                            </Button>
                        </router-link>
                        <Button v-if="prev_ids.length > 0" type="default" shape="circle" icon="md-return-left"
                                @click="returnBack()">
                            返回上一级
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button @click="del_model = true" type="default" shape="circle" icon="trash-b"
                                :disabled="select_groups.length <= 0">
                            删除
                        </Button>
                        <div class="search-input">
                            <Input class="search-input" v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>标题：</span>
                                        <p>权限显示的名称。</p></li>
                                    <li><span>名称：</span>
                                        <p>权限名称，唯一识别标志。</p></li>
                                    <li><span>描述：</span>
                                        <p>权限的详细描述。</p></li>
                                    <li><span>状态：</span>
                                        <p>权限的启用/禁用状态，若禁用，权限将无法用于授权。</p></li>
                                    <li><span>编辑：</span>
                                        <p>编辑权限信息。</p></li>
                                    <li><span>下级：</span>
                                        <p>查看该权限的下级子权限。</p></li>
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
    import {getAllAuthRuleList, delRule} from "@/api/system";

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
                pid: 0,
                prev_ids: [],
                prev_titles: [],
                keyword: '',
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '描述',
                        key: 'rule_desc',
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h, params) => {
                            if (params.row.status == 1) {
                                return h('span', '启用');
                            } else {
                                return h('span', '禁用');
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('i-button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push('/system/auth_rule/edit/' + params.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('i-button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.nextItem(params.row.id, params.row.pid, params.row.title)
                                        }
                                    }
                                }, '下级'),
                            ])
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
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getList()
                }
                this.$store.dispatch('SET_LIST_RELOAD', false);
            }
        },
        created: function () {
            this.getList()
        },
        methods: {
            getList() {
                let app = this;
                app.select_groups = [];
                app.loading = true;
                getAllAuthRuleList(this.pid, this.page_size, this.page_num, this.keyword).then(res => {
                    app.loading = false;
                    app.group_list = res.data.list;
                    app.groupCount = Number(res.data.count)
                });
            },
            delConfirm() {
                this.delItem()
            },
            delItem() {
                let app = this;
                app.send_loading = true;
                delRule(JSON.stringify(app.select_groups)).then(res => {
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
            returnBack() {
                this.pid = this.prev_ids[this.prev_ids.length - 1];
                this.prev_ids.splice(this.prev_ids.length - 1, 1);
                this.prev_titles.splice(this.prev_titles.length - 1, 1);
                this.getList()
            },
            nextItem(id, pid, title) {
                this.page_num = 1;
                this.prev_ids.push(pid);
                this.prev_titles.push(title);
                this.pid = id;
                this.getList()
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
