<template>
    <a-popover v-model="showNotice" overlayClassName="header-notice" trigger="click" placement="bottomRight">
        <template slot="content">
            <a-spin :spinning="loading">
                <a-tabs class="header-notice-content" :tabBarGutter="25">
                    <a-tab-pane key="1">
                        <span slot="tab">消息<span
                                v-if="total && totalSum['message']">({{totalSum['message']}})</span></span>
                        <template v-if="total && totalSum['message']">
                            <a-list>
                                <template v-for="item in list['message']">
                                    <a-list-item :key="item.id" @click="messageAction(item)">
                                        <a-list-item-meta :description="item.create_time">
                                             <span slot="title">
                                                    <p>{{item.title}}</p>
                                                    <p class="ant-list-item-meta-description" v-html="item.content"></p>
                                             </span>
                                            <a-avatar slot="avatar"
                                                      :src="item.avatar"/>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </template>
                            </a-list>
                            <div class="footer-action">
                                <a class="item muted" @click="setRead('message')">清空消息</a>
                                <a class="item muted" @click="showMore('1')">查看更多</a>
                            </div>
                        </template>
                        <template v-else>
                            <div class="notFound">
                                <img src="../../../assets/image/notify/laba.svg" alt="not found">
                                <div>你已读完所有消息</div>
                            </div>
                        </template>
                    </a-tab-pane>
                    <a-tab-pane key="2">
                        <span slot="tab">通知<span
                                v-if="total && totalSum['notice']">({{totalSum['notice']}})</span></span>
                        <template v-if="total && totalSum['notice']">
                            <a-list>
                                <template v-for="item in list['notice']">
                                    <a-list-item :key="item.id">
                                        <a-list-item-meta :description="item.create_time">
                                             <span slot="title">
                                                 <p v-html="item.title"></p>
                                                 <p class="ant-list-item-meta-description" v-html="item.content"></p>

                                             </span>
                                            <a-avatar style="background-color: white" slot="avatar"
                                                      src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </template>
                            </a-list>
                            <div class="footer-action">
                                <a class="item muted" @click="setRead('notice')">清空通知</a>
                                <a class="item muted" @click="()=>{$router.push('/notify/notice')}">查看更多</a>
                            </div>
                        </template>
                        <template v-else>
                            <div class="notFound">
                                <img src="../../../assets/image/notify/bell.svg" alt="not found">
                                <div>你已查看所有通知</div>
                            </div>
                        </template>
                    </a-tab-pane>
                 <!--   <a-tab-pane key="3">
                        <span slot="tab">待办<span
                                v-if="task.total && task.total">({{task.total}})</span></span>
                        <template v-if="task.total && task.total">
                            <a-list>
                                <template v-for="item in task.list">
                                    <a-list-item :key="item.id">
                                        <a-list-item-meta>
                                            <a-avatar slot="avatar"
                                                      :src="item.executor.avatar"/>
                                            <span slot="title">
                                                    <p>
                                                        {{item.name}}
                                                         <a-tag style="position: absolute;right: 0" color="red"
                                                                v-if="item.end_time">还剩{{showDiff(item.end_time,new Date())}}</a-tag>
                                                         <a-tag style="position: absolute;right: 0" color="gold" v-else>已耗时{{showDiff(new Date(),item.create_time)}}</a-tag>
                                                    </p>
                                             </span>
                                            <span slot="description">
                                                    <span>来自项目{{item.projectInfo.name}}</span>
                                                    <span v-if="item.end_time">，需在{{formatTime(item.end_time)}}前完成</span>
                                             </span>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </template>
                            </a-list>
                            <div class="footer-action">
                                <a class="item muted" @click="setRead('task')">清空待办</a>
                                <a class="item muted">查看更多</a>
                            </div>
                        </template>
                        <template v-else>
                            <div class="notFound">
                                <img src="../../../assets/image/notify/ticket.svg" alt="not found">
                                <div>你已完成所有待办</div>
                            </div>
                        </template>
                    </a-tab-pane>-->
                </a-tabs>
            </a-spin>
        </template>
        <span>
          <a-badge :count="total">
            <a-icon class="action-item" type="bell"/>
          </a-badge>
        </span>
    </a-popover>
</template>

<script>
    import {mapState} from 'vuex'
    import moment from 'moment';
    import {_clearAll, noReads, setReadied} from "../../../api/notify";
    import {notice} from "../../../assets/js/notice";
    import {showMsgNotification} from "../../../assets/js/notify";
    import {selfList} from "../../../api/task";
    import {relativelyTime} from "../../../assets/js/dateTime";

    export default {
        name: 'HeaderNotice',
        data() {
            return {
                showNotice: false,
                loading: false,
                total: 0,
                messageTotal: 0,
                totalSum: 0,
                list: [],
                task: {
                    page: 1,
                    pageSize: 5,
                    total: 0,
                    list: [],
                }
            }
        },
        computed: {
            ...mapState({
                socketAction: state => state.socketAction,
                currentOrganization: state => state.currentOrganization,
            })
        },
        watch: {
            socketAction(val) {
                if (val.action === 'notice') {
                    this.init();
                } else if (val.action === 'task' || val.action === 'events') {
                    this.init();
                    const permission = showMsgNotification(val.title, val.msg, {icon: val.data.notify.avatar});
                    console.log(permission);
                    if (permission === false) {
                        notice(val, 'notice', 'info', 10);
                    }
                }
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.fetchNotice();
                // this.getTasks();
            },
            fetchNotice() {
                let app = this;
                noReads().then(res => {
                    app.list = res.data.list;
                    app.messageTotal = res.data.total;
                    app.total = app.messageTotal + app.task.total;
                    app.totalSum = res.data.totalSum;
                });
            },
            setRead(type) {
                this.total -= this.list[type].length;
                this.list[type] = [];
                switch (type) {
                    case 'message':
                        this.totalSum.message = 0;
                        _clearAll();
                }
            },
            showMore(key) {
                switch (key) {
                    default:
                        this.showNotice = false;
                        this.$router.push('/notify/notice');
                }
            },
            getTasks() {
                selfList({page: this.task.page, pageSize: this.task.pageSize}).then(res => {
                    this.task.list = res.data.list;
                    this.task.total = res.data.total;
                    this.total = this.messageTotal + this.task.total;
                })
            },
            messageAction(message) {
                const sendData = JSON.parse(message.send_data);
                this.showNotice = false;
                if (message.action === 'task') {
                    setReadied(JSON.stringify([message.id]));
                    this.$router.push(`/project/space/task/${sendData.project_code}/detail/${sendData.code}`);
                }
                this.init();
            },
            formatTime(time) {
                return moment(time).format('YY年MM月DD日 HH:mm');
            },
            showDiff(time, time2) {
                let diff = moment(time).diff(moment(time2), 'days');
                if (diff <= 0) {
                    diff = moment(time).diff(moment(time2), 'hours');
                    diff += '小时'
                } else {
                    diff += '天'
                }
                return diff;
            },
        }
    }
</script>

<style lang="less">
    .header-notice {
        .ant-popover-inner-content {
            padding: 0;

            .ant-tabs-bar {
                margin-bottom: 0 !important;
            }

            .ant-list {
                .ant-list-item {
                    padding: 12px 24px;
                    transition: all .3s;

                    &:hover {
                        background: #e6f7ff;
                    }
                }
            }
        }

        .header-notice-content {
            width: 340px;

            .ant-tabs-bar {
                text-align: center;
                margin-bottom: 5px;
            }

            .ant-list-item-meta-title {
                p {
                    margin-bottom: 0;
                    position: relative;
                }
            }

            .ant-list-item-meta-description {
                font-size: 12px;
            }

            .ant-list-item:hover {
                /*background: #e6f7ff;*/
                cursor: pointer;
            }

            .notFound {
                text-align: center;
                padding: 73px 0 88px 0;
                color: rgba(0, 0, 0, 0.45);
                height: 275px;

                img {
                    margin-bottom: 16px;
                }
            }

            .footer-action {
                border-top: 1px solid #e8e8e8;
                padding: 12px 0;

                .item {
                    width: 49%;
                    display: inline-block;
                    text-align: center;
                }
            }
        }
    }
</style>
