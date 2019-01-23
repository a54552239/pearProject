<template>
    <div>
        <wrapper-content pageTitle="消息列表">
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <Select v-model="select_notice_type" @on-change="selectChange" placeholder="选择通知类型" multiple
                                style="width:300px;text-align: left">
                            <Option v-for="item in notice_type_list" :value="item.key" :key="item.id">{{ item.title }}
                            </Option>
                        </Select>
                    </div>
                    <div class="right-actions">
                        <Button @click="batchTicketRead" type="default" shape="circle"
                                :disabled="select_notices.length <= 0">标记已读
                        </Button>
                        <div class="search-input">
                            <Input v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>内容：</span>
                                        <p>消息详细内容。</p></li>
                                    <li><span>类型：</span>
                                        <p>消息类型。</p></li>
                                    <li><span>时间：</span>
                                        <p>消息通知时间。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Tabs :animated="false" @on-click="tabClick">
                    <TabPane label="未读消息" name="no_read">
                        <Table :loading="loading" border :columns="columns" :data="notice_list" class="no-border-table"
                               @on-selection-change="selectItem"></Table>
                        <Page v-if="notice_count > 0" :total="notice_count" :current="page_num" @on-change="changePage"
                              @on-page-size-change="changePageSize" size="small" show-total show-sizer
                              class="table-page">
                            <slot class="total">共 {{ notice_count }} 条</slot>
                        </Page>
                    </TabPane>
                    <TabPane label="所有消息" name="all">
                        <Table :loading="loading" border :columns="columns" :data="notice_list" class="no-border-table"
                               @on-selection-change="selectItem"></Table>
                        <Page v-if="notice_count > 0" :total="notice_count" :current="page_num" @on-change="changePage"
                              @on-page-size-change="changePageSize" size="small" show-total show-sizer
                              class="table-page">
                            <slot class="total">共 {{ notice_count }} 条</slot>
                        </Page>
                    </TabPane>
                </Tabs>

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
    import WrapperContent from '../../../components/wrapper-content.vue'
    import $ from 'jquery'
    import _ from 'lodash'
    import {getNotifyTypeList, getNotifyList, getTicketRead, batchTicketRead} from "@/api/common";


    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                del_model: false,
                form_modal: false,
                select_notices: [],
                send_loading: false,
                notice_type_list: [],
                select_notice_type: [],
                page_size: 10,
                page_num: 1,
                is_read: 0,
                keyword: '',
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '內容',
                        key: 'content',
                        sortable: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    title: params.row.content
                                },
                                on: {
                                    click: () => {
                                        this.showNoticeDetail(params.row)
                                    }
                                }
                            }, params.row.content);
                        }
                    },
                    {
                        title: '类型',
                        width: 100,
                        key: 'notify_type_title',
                    },
                    {
                        title: '时间',
                        width: 150,
                        key: 'create_time',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.is_read == 1) {
                                return ''
                            }
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '标记为已读',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'md-checkmark',
                                            size: '16'
                                        },
                                        class: 'table-row-icon',
                                        nativeOn: {
                                            click: () => {
                                                this.ticketRead(params.row.id, params.index)
                                            }
                                        }
                                    })
                                ])
                            ])
                        }
                    }
                ],
                notice_list: [],
                notice_count: 0,
            }
        },
        watch: {
            keyword: function (newQuestion) {
                this.search()
            },
        },
        created: function () {
            this.getNotifyTypeList();
            this.getList()
        },
        methods: {
            getNotifyTypeList() {
                let app = this;
                getNotifyTypeList().then(res => {
                    app.notice_type_list = res.data
                });
            },
            getList() {
                let app = this;
                app.loading = true;
                getNotifyList(this.page_size, {
                    is_read: app.is_read,
                    notice_type: JSON.stringify(app.select_notice_type),
                    page_num: app.page_num,
                    keyword: app.keyword
                }).then(res => {
                    app.loading = false;
                    app.notice_list = res.data.list;
                    app.notice_count = Number(res.data.count)
                });
            },
            ticketRead(id, index) {
                let app = this;
                getTicketRead(id).then(res => {
                    app.notice_list.splice(index, 1);
                    app.getNotifyNoReadList()
                });
            },
            batchTicketRead() {
                let app = this;
                app.send_loading = true;
                batchTicketRead(JSON.stringify(app.select_notices)).then(res => {
                    app.send_loading = false;
                    app.getList();
                    app.getNotifyNoReadList()
                });
            },
            getNotifyNoReadList() {
                let app = this;
                getNotifyList(5).then(res => {
                    app.$store.dispatch('UPDATE_NOTIFY_NO_READ_LIST', res.data.list);
                    app.$store.dispatch('UPDATE_NOTIFY_NO_READ_COUNT', res.data.count);
                });
            },
            showNoticeDetail(notice) {
                const type = notice.type;
                const notice_data = JSON.parse(notice.send_data);
                if (type == 1) {
                    const project_id = notice_data.project;
                    this.$router.push('/project/task/' + project_id + '?id=' + notice_data.id)
                }
            },
            selectChange(value) {
                this.getList()
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                // 这是我们为消息停止输入等待的毫秒数
                500
            ),
            selectItem(selection) {
                let app = this;
                app.select_notices = [];
                $.each(selection, function (k, v) {
                    app.select_notices.push(v.id)
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
            tabClick(name) {
                this.select_notices = []
                if (name == 'no_read') {
                    if (this.is_read !== 0) {
                        this.is_read = 0;
                        this.reloadList()
                    }
                } else {
                    if (this.is_read !== -1) {
                        this.is_read = -1;
                        this.reloadList()
                    }
                }
            },
            reloadList() {
                this.page_num = 1;
                this.getList()
            },
            rowClassName(row, index) {
                return 'rowClassName';
            }
        }

    };
</script>
