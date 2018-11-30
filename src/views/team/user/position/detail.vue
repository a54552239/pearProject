<template>
    <div>
        <wrapper-content pageTitle="成员列表">
            <div slot="page-action" class="page-action">
                <div class="filter-content">
                    <div class="search-input">
                        <Input class="search-input" v-model="list_keyword" icon="ios-search-strong" placeholder="搜索"/>
                    </div>
                </div>
            </div>
            <div class="data-content">
                <Table :loading="loading" border :columns="columns" :data="user_list" :row-class-name="rowClass"
                       @on-row-click="rowClick"
                       class="no-border-table"></Table>
                <Page v-if="userCount > 0" :total="userCount" :current="page_num" @on-change="changePage"
                      @on-page-size-change="changePageSize" size="small"
                      show-total show-sizer class="table-page">
                    <slot class="total">共 {{ userCount }} 条</slot>
                </Page>
            </div>
        </wrapper-content>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>
    </div>
</template>
<style>

</style>
<script>
    import WrapperContent from '../../../../components/wrapper-content.vue'
    import {getPositionUserList} from "@/api/user";
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data: function () {
            return {
                del_model: false,
                select_groups: [],
                send_loading: false,
                data_loading: false,
                button_loading: false,
                loading: false,
                page_size: 10,
                page_num: 1,
                pid: 0,
                list_keyword: '',
                user_keyword: '',
                columns: [
                    {
                        title: '名称',
                        width: 200,
                        key: 'avatar',
                        render: (h, params) => {
                            return [
                                h('img', {
                                    attrs: {
                                        src: params.row.avatar,
                                        width: '35',
                                        class: 'img-circle user-item'
                                    }
                                }),
                                h('div', {
                                    attrs: {
                                        class: 'user-item user-detail'
                                    }
                                }, [
                                    h('strong', {}, params.row.realname),
                                    h('p', {
                                        attrs: {
                                            class: 'muted'
                                        }
                                    }, params.row.email)
                                ])
                            ];
                        }
                    },
                    {
                        title: '职位',
                        key: 'user_name',
                        render: (h, params) => {
                            return [
                                h('span', params.row.position_info.position_name)
                            ]
                        }
                    },
                    {
                        title: '等级',
                        key: 'level_name',
                        render: (h, params) => {
                            return [
                                h('span', params.row.level_info.level_name)
                            ]
                        }
                    },
                ],
                user_list: [],
                userCount: 0,
            }
        },
        watch: {
            list_keyword: function () {
                this.search()
            },
        },
        created: function () {
            this.getList()
        },
        methods: {
            getList() {
                let app = this;
                app.select_groups = [];
                getPositionUserList(app.$route.params.id,this.page_size,this.page_num,this.list_keyword,).then(res => {
                    app.user_list = res.data.list;
                    app.userCount = Number(res.data.count)
                });
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                500
            ),
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
                this.getList()
            },
            rowClass(row, index) {
                return 'team-user';
            },
            rowClick(row, index) {
            }
        }
    };
</script>
