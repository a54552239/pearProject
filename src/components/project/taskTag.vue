<template>
    <div>
        <a-tabs class="task-tag-index" tabPosition="left" defaultActiveKey="1" :animated="false" v-model="tabKey">
            <a-tab-pane :key="taskTag.code" v-for="taskTag in taskTagList">
                <div slot="tab">
                    <div class="tag-item">
                        <a-badge status="success"
                                 :class="`badge-${taskTag.color}`"/>
                        {{taskTag.name}}
                    </div>
                </div>
                <div class="config-content">
                    <vue-scroll>
                        <div class="content-item">
                            <div class="infos">
                                <a-list :loading="{spinning: loading,delay: 300}">
                                    <div v-if="showLoadingMore" slot="loadMore"
                                         :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                        <a-spin v-if="loadingMore"/>
                                        <a-button v-else @click="onLoadMore">加载更多</a-button>
                                    </div>
                                    <a-list-item :key="index" v-for="(item, index) in list">
                                        <a-list-item-meta>
                                            <div class="task-list" slot="title" :class="{'done': item.done}">
                                                <div>
                                                    <!--                                                <a-avatar size="small" icon="user" class="m-r-sm"></a-avatar>-->

                                                    <router-link class="text-default task-content"
                                                                 :to="`/project/space/task/${code}/detail/${item.code}`">
                                                        <a-tooltip placement="top"
                                                                   v-if="item.executor && item.executor.avatar">
                                                            <template slot="title">
                                                                <span>{{item.executor.name}}</span>
                                                            </template>
                                                            <img
                                                                    :src="item.executor.avatar"
                                                                    :title="item.executor.name"
                                                                    class="avatar task-executor img-circle img-24 hinted m-r-sm">
                                                        </a-tooltip>
                                                        <a-avatar size="small" icon="user" class="m-r-sm" v-else></a-avatar>
                                                        <span class="task-name m-r">{{ item.name }}</span>
                                                        <span class="muted flex m-r tag-name" v-for="tag in item.tags"
                                                              :key="tag.code"
                                                        >
                                                    <a-badge status="success"
                                                             :class="`badge-${tag.tag.color} m-r-xs`"/>
                                                   {{tag.tag.name}}
                                                </span>
                                                    </router-link>
                                                </div>
                                                <div class="label task-time" :class="showTimeLabel(item.end_time)"
                                                     v-if="item.end_time">
                                                    {{showTaskTime(item.begin_time, item.end_time)}}
                                                </div>
                                            </div>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </a-list>
                            </div>
                        </div>
                    </vue-scroll>
                </div>
            </a-tab-pane>
            <div class="m-t text-center" v-if="!loading && !list.length">
                <strong>
                    <h2>项目中还没有标签</h2>
                </strong>
            </div>
        </a-tabs>
    </div>

</template>

<script>
    import {checkResponse} from "../../assets/js/utils";
    import {list, del} from "../../api/taskTag";
    import pagination from "../../mixins/pagination";
    import {formatTaskTime, relativelyTaskTime} from "../../assets/js/dateTime";
    import {getListByTaskTag} from "../../api/task";
    import moment from "moment";

    export default {
        name: "taskTag",
        props: {
            code: {
                type: [String],
                default() {
                    return ''
                }
            },
        },
        mixins: [pagination],
        data() {
            return {
                loading: false,
                tabKey: '0',
                project: {},
                taskTagList: [],
                list: [],
                showLoadingMore: false,
                loadingMore: false,
            }
        },
        watch: {
            code() {
                this.init();
            },
            tabKey(val) {
                this.getTaskList();
            }

        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let app = this;
                this.requestData.projectCode = this.code;
                app.getTaskTags();
            },
            getTaskTags() {
                let app = this;
                list(app.requestData).then(res => {
                    app.taskTagList = res.data;
                    if (res.data.length) {
                        app.tabKey = res.data[0].code;
                    }
                });
            },
            getTaskList(reset = true) {
                if (!this.tabKey) {
                    return false;
                }
                let app = this;
                app.loading = true;
                if (reset) {
                    this.list = [];
                    this.pagination.page = 1;
                    this.pagination.pageSize = 10;
                    this.showLoadingMore = false;
                }
                getListByTaskTag({taskTagCode: this.tabKey}).then(res => {
                    app.list = app.list.concat(res.data.list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.list.length;
                    app.loading = false;
                    app.loadingMore = false
                });
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.getTaskList(false);
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
            },
            showTimeLabel(time) {
                let str = 'label-primary';
                if (time == null) {
                    return str;
                }
                let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
                if (cha < 0) {
                    str = 'label-danger';
                } else if (cha == 0) {
                    str = 'label-warning';
                } else if (cha > 7) {
                    str = 'label-normal'
                }
                return str;
            },
            deleteItem(item, index) {
                let app = this;
                switch (this.tabKey) {
                    case '1':
                        this.$confirm({
                            title: '确定彻底删除任务？',
                            content: `彻底删除任务后，该任务及其子任务将会被永久被删除。`,
                            okText: '彻底删除',
                            okType: 'danger',
                            cancelText: '再想想',
                            onOk() {
                                del(item.code).then((res) => {
                                    if (!checkResponse(res)) {
                                        return;
                                    }
                                    app.list.splice(index, 1);
                                    app.$emit('update', item);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case '2':
                        this.$confirm({
                            title: '确认彻底删除该文件？',
                            content: `彻底删除文件后，相关的关联资源将会失效。`,
                            okText: '彻底删除',
                            okType: 'danger',
                            cancelText: '再想想',
                            onOk() {
                                delFile(item.code).then((res) => {
                                    if (!checkResponse(res)) {
                                        return;
                                    }
                                    app.list.splice(index, 1);
                                    app.$emit('update', item);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                }
            }
        }
    }
</script>

<style lang="less">
    .task-tag-modal {
        .ant-modal-body {
            padding: 0;
        }

        .ant-modal-body {
            padding-bottom: 18px;

        }

        .ant-modal-body, .ant-tabs, .ant-tabs-bar {
            height: 84vh;
            min-width: 180px;

            .ant-tabs-tab {
                padding: 12px 24px;
                font-size: 16px;
            }
        }

        .ant-tabs-nav-wrap {
            padding-top: 10px;
        }

        .ant-tabs-left-content {
            padding-top: 6px;
            padding-right: 12px;
        }

        .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
            text-align: left;
        }

        .config-content {
            height: 80vh;

            .content-item {
                display: flex;
                justify-content: space-between;
                flex: 1 1;
                margin-bottom: 24px;
                padding-right: 12px;

                .infos {
                    width: 100%;
                    padding-right: 12px;

                    p {
                        margin-bottom: 6px;
                    }

                    .item-title {
                        font-size: 16px;
                    }

                    .item-tips {
                        margin-bottom: 12px;
                    }
                }
            }
        }
    }

    .task-tag-index {
        .tag-item {
            display: flex;

            .ant-badge-status-dot {
                width: 8px;
                height: 8px;
            }
        }

        .config-content {
            text-decoration: none;

            .task-list {
                display: flex;
                align-items: center;
                justify-content: space-between;

                &.done {
                    .task-name {
                        color: #A6A6A6;
                        text-decoration: line-through;
                    }
                }
            }

            .task-content {
                /*display: flex;*/
                /*align-items: inherit;*/
                text-decoration: none;
            }

            .tag-name {
                display: inline-block;
            }


            .task-executor {
                width: 24px !important;
                height: 24px !important;
            }

            .task-name {
                /*line-height: 1px;*/
            }
        }
    }
</style>
