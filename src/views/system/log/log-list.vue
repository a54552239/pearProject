<template>
    <div>
        <wrapper-content pageTitle="操作日志">
            <div slot="page-action" class="page-action">
                <div class="filter-content">
                    <DatePicker style="padding: 10px 0"
                                :open="open"
                                :value="search_date"
                                confirm
                                placement="bottom-end"
                                type="daterange"
                                @on-clear="dateClear"
                                @on-change="dateChange"
                                @on-ok="dateOk">
                        <a href="javascript:void(0)" @click="dateClick">
                           <span>
                               <Icon type="calendar"></Icon>
                               <template><strong>{{ search_date_format }}</strong></template>
                           </span>
                        </a>
                    </DatePicker>
                </div>
            </div>
            <div class="data-content">
                <div class="table-edit">
                    <div class="left-actions">
                        <p style="padding: 15px 0;">操作日志记录了系统中进行的所有操作。防止异常操作的出现，便于核查。</p>
                    </div>
                    <div class="right-actions">
                        <div class="search-input">
                            <Input class="search-input" v-model="keyword" icon="ios-search-strong" placeholder="搜索"/>
                        </div>
                        <Poptip class="action-tips" style="text-align: left" trigger="hover" placement="left-start">
                            <div slot="title">数据列表说明</div>
                            <div slot="content">
                                <ul>
                                    <li><span>ID：</span>
                                        <p>日志的ID。</p></li>
                                    <li><span>内容：</span>
                                        <p>日志的详细信息（描述）。</p></li>
                                    <li><span>操作人：</span>
                                        <p>生成该日志的用户，若为空，则为系统产生的日志。</p></li>
                                    <li><span>时间：</span>
                                        <p>日志生成时间。</p></li>
                                </ul>
                            </div>
                            <Icon type="ios-help-circle-outline"></Icon>
                        </Poptip>
                    </div>
                </div>
                <Table :loading="loading" border :columns="columns" :data="group_list"
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
                <Button type="error" :loading="send_loading" @click="delItem()">删除</Button>
            </div>
        </Modal>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>
    </div>
</template>
<style>
    .filter-content {
        float: right;
        padding: 0 20px;
    }

    .filter-content a {
        transition: color 0.2s ease;
        color: #464c5b !important;
    }

    .filter-content a:hover {
        color: #5cadff !important;
    }
</style>
<script>
    import WrapperContent from '../../../components/wrapper-content.vue'
    import {getLogList} from "@/api/system";
    import * as Time from '../../../assets/js/date_time'
    import _ from 'lodash'

    export default {
        components: {
            WrapperContent,
        },
        data() {
            return {
                self: this,
                open: false,
                search_date: [],
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
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: '内容',
                        key: 'content'
                    },
                    {
                        title: '操作人',
                        key: 'account'
                    },
                    {
                        title: '时间',
                        sortable: true,
                        key: 'add_time'
                    },
                ],
                group_list: [],
                groupCount: 0,
            }
        },
        watch: {
            keyword: function () {
                this.search()
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
                    this.getList()
                }
                this.$store.state.list_reload = false
            }
        },
        computed: {
            search_date_format: function () {
                if (this.search_date.length > 0) {
                    return this.search_date[0] + '~' + this.search_date[1];
                } else {
                    return '选择筛选日期'
                }
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
                getLogList(this.page_size,this.page_num,this.keyword,JSON.stringify(this.search_date)).then(res => {
                    app.loading = false;
                    app.group_list = res.data.list;
                    app.groupCount = Number(res.data.count)
                });
            },
            getDateBetween() {
                this.search_date = [];
                const date_begin = Time.format_date_now();
                const date_end = Time.format_date_now(1);
                this.search_date.push(date_begin);
                this.search_date.push(date_end);
                console.log(this.search_date)
            },
            dateClick() {
                this.open = !this.open;
            },
            dateChange(date) {
                this.search_date = date;
            },
            dateOk() {
                this.page_num = 1;
                this.getList();
                this.open = false;
            },
            dateClear() {
                this.search_date = [];
            },
            search: _.debounce(
                function () {
                    this.page_num = 1;
                    this.getList()
                },
                // 这是我们为用户停止输入等待的毫秒数
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
            rowClassName(row, index) {
                return 'rowClassName';
            },
        },
    };
</script>
