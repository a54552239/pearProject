<template>
    <div>
        <wrapper-content pageTitle="用户组下属用户">
            <p style="padding: 15px 0;">该列表显示属于用户组【{{ this.$route.query.title }}】下的用户列表。</p>
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Button type="default" shape="circle" icon="md-return-left"
                                @click="$router.push('/system/auth_group/list')">
                            返回
                        </Button>
                    </div>
                    <div class="right-actions">
                        <Button @click="remove_model = true" type="default" shape="circle"
                                :disabled="select_users.length <= 0">移除
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>用户编号：</span>
                                        <p>用户用于登录的账号，唯一识别标记。</p></li>
                                    <li><span>用户昵称：</span>
                                        <p>用户在系统内自定义的名称。</p></li>
                                    <li><span>登录时间：</span>
                                        <p>用户最后一次登录系统的时间。</p></li>
                                    <li><span>登录IP：</span>
                                        <p>用户最后一次登录系统的IP地址。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="user_list" class="no-border-table"
                       @on-selection-change="selectItem"></Table>
                <Page v-if="userCount > 0" :total="userCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small" show-total show-sizer class="table-page">
                    <slot class="total">共 {{ userCount }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
        <Modal
                v-model="remove_model"
                title="操作提示">
            <p>确认移除当前选中的用户吗？移除后该用户将不再获得此用户组所有权限 </p>
            <div slot="footer">
                <Button type="text" @click="remove_model = false">取消</Button>
                <Button type="warning" :loading="send_loading" @click="removeConfirm">移除</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>

    </div>
</template>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getGroupUserList, removeGroupUser} from "@/api/system";
    import * as utils from '../../../assets/js/utils'
    import * as dateTime from '../../../assets/js/date_time'
    import $ from 'jquery'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                remove_model: false,
                select_users: [],
                choose_user_id: 0,
                choose_user_index: 0,
                show_menu: false,
                send_loading: false,
                member_loading: false,
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
                        title: '用户编号',
                        key: 'account',
                        render: (h, params) => {
                            return h('strong', params.row.account)
                        }
                    },
                    {
                        title: '用户昵称',
                        key: 'realname'
                    },
                    {
                        title: '登录时间',
                        key: 'last',
                        render: (h, params) => {
                            return h('span', dateTime.format_date(params.row.last))
                        }
                    },
                    {
                        title: '登录IP',
                        key: 'ip',
                    },
                ],
                user_list: [],
                userCount: 0,
            }
        },
        watch: {
            keyword: function (newQuestion) {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getUserList()
                }
            }
        },
        created: function () {
            this.getUserList()
        },
        methods: {
            getUserList: function () {
                let app = this;
                app.loading = true;
                getGroupUserList(this.$route.params.id, this.page_size, this.page_num, this.keyword).then(res => {
                    app.loading = false;
                    app.user_list = res.data.list;
                    app.userCount = Number(res.data.count)

                });
            },
            removeConfirm() {
                this.removeItem()
            },
            removeItem() {
                let app = this;
                app.send_loading = true;
                removeGroupUser(this.$route.params.id, JSON.stringify(app.select_users)).then(res => {
                    app.send_loading = false;
                    app.remove_model = false;
                    if (res.ret == 200) {
                        app.$Message.success('移除成功');
                        app.getUserList()
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getUserList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_users = [];
                $.each(selection, function (k, v) {
                    app.select_users.push(v.id)
                });
            },
            changePage(page) {
                this.page_num = page;
                this.getUserList()
            },
            changePageSize(page_size) {
                this.page_num = 1;
                this.page_size = page_size;
                this.getUserList()
            },
            rowClassName(row, index) {
                return 'rowClassName';
            }
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
