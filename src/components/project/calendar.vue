<template>
    <div class="calendar-index" id="calendar-index">
        <div class="layout-item left">
            <div class="left-content">
                <div class="search-content">
                    <a-input size="large" v-model="keyword" ref="keywordInput" placeholder="搜索" @pressEnter="search">
                        <a-icon slot="prefix" class="muted" type="search"/>
                        <a-icon v-if="keyword" slot="suffix" class="muted" type="close-circle" @click="emitEmpty"/>
                    </a-input>
                </div>
                <div class="content-item muted">成员</div>
                <div class="members">
                    <a-checkbox-group v-model="memberCodes">
                        <!--<div class="user-info" v-for="item in memberList" :key="item.id">
                            <a-avatar :src="item.avatar" alt="">{{item.name}}</a-avatar>
                            <span>{{item.name}}</span>
                        </div>-->
                        <a-list
                            class="publish-task-list"
                            itemLayout="horizontal"
                            :dataSource="memberList"
                        >
                            <a-list-item slot="renderItem" slot-scope="item,index">
                                <a-list-item-meta
                                >
                                    <div slot="title">
                                        {{item.name}}
                                    </div>
                                    <div slot="avatar" style="display:flex;align-items: center">
                                        <a-checkbox :value="item.memberCode" class="m-r-sm"></a-checkbox>
                                        <a-avatar :src="item.avatar" alt="">{{item.name}}</a-avatar>
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-checkbox-group>
                </div>
            </div>
        </div>
        <div class="layout-item right">
            <div class="calendar-content">
                <a-calendar @panelChange="onPanelChange" v-model="calendarValue">
                    <ul slot="dateCellRender" slot-scope="value" class="events">
                        <li class="add-item" @click.stop="rowClick(null, 'add', value)">添加日程</li>
                        <template v-for="(item, key) in list[value.format('YYYY-MM-DD')]">
                            <a-popover className="calendar-pop" :visible="item.visible" title="" trigger="click" :key="item.id" v-if="key <= 3" :getPopupContainer="getPopup">
                                <a slot="content">
                                    <a-card class="calendar-pop-detail" size="small" style="width: 350px">
                                        <div slot="title">
                                            <template  v-if="item.created_by !== currentMemberCode">
                                                <span class="m-l-xs muted text-success" v-if="item.myStatus == 1"><a-icon type="check-circle" class="m-r-xs" theme="filled"/>已接受</span>
                                                <span class="m-l-xs muted text-error" v-if="item.myStatus == 2"><a-icon type="check-circle" class="m-r-xs" theme="filled"/>已拒绝</span>
                                                <template v-if="item.waitConfirm">
                                                    <a class="m-l-xs muted" @click="confirmJoinEvents(item, 1)"><a-icon type="check-circle" class="m-r-xs"/>接受</a>
                                                    <a class="m-l muted" @click="confirmJoinEvents(item, 2)"><a-icon type="minus-circle" class="m-r-xs"/>拒绝</a>
                                                </template>
                                            </template>
                                            <template v-else>
                                                我组织的
                                            </template>
                                        </div>
                                        <div slot="extra">
                                            <template v-if="item.created_by == currentMemberCode">
                                                <a-tooltip title="编辑日程">
                                                    <a class="text-default" @click="rowClick(item, 'edit')"><a-icon type="edit"/></a>
                                                </a-tooltip>
                                                <a-tooltip title="取消日程">
                                                    <a class="text-default" @click="rowClick(item, 'del')"><a-icon type="delete"/></a>
                                                </a-tooltip>
                                            </template>
                                            <a-tooltip title="关闭面板">
                                                <a class="text-default"><a-icon type="close" @click="item.visible = false"/></a>
                                            </a-tooltip>
                                        </div>
                                        <div class="calendar-content">
                                            <div><a-icon type="profile" class="m-r-xs" />{{item.title}}</div>
                                            <div style="display:flex;line-height: 30px;align-items: center">
                                                <a-icon type="clock-circle" class="m-r-xs" />
                                                <div>{{ moment(item.begin_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                                <div> &nbsp;&nbsp;-&nbsp;&nbsp; </div>
                                                <div>{{ moment(item.end_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                            </div>
                                            <div v-if="item.position" class="line-item"><a-icon type="environment"  class="m-r-xs"/>{{ item.position }}</div>
                                            <template v-if="item.description">
                                                <div class="line-item"><a-icon type="flag" class="m-r-xs" />{{item.description}}</div>
                                            </template>
                                            <div class="line-item">
                                                <a-icon type="team" class="m-r-xs"/>
                                                <template v-for="member in item.memberList">
                                                    <a-tooltip :title="`${member.memberInfo.name} ${member.is_owner ? ' · 组织者' : member.status ? member.status == 1 ? ' · 已接受' : ' · 已拒绝' : ' · 未响应'}`" :key="member.id">
                                                        <a-tag>
                                                            <!--                                                        <a-avatar :size="24" icon="user" :src="member.memberInfo.avatar" class="m-r-sm" />-->
                                                            {{member.memberInfo.name}}
                                                        </a-tag>
                                                    </a-tooltip>
                                                </template>
                                            </div>
                                        </div>
                                    </a-card>
                                </a>
                                <li>
                                    <div @click.stop="showCalendarPop(item)" v-if="key <= 2">{{item.title}}</div>
                                    <a-popover class="calendar-pop" :visible="item.visibleMore" title="" trigger="click" :key="item.id" v-if="key == 3"  :getPopupContainer="getPopup">
                                        <a slot="content">
                                            <a-card class="calendar-pop-detail" size="small" style="width: 350px">
                                                <div slot="title">{{value.format('YYYY-MM-DD')}}</div>
                                                <div slot="extra">
                                                    <a-tooltip title="关闭面板">
                                                        <a class="text-default"><a-icon type="close" @click="item.visibleMore = false;item.visibleInner = false"/></a>
                                                    </a-tooltip>
                                                </div>
                                                <ul class="events">
                                                    <template v-for="(item2, key2) in list[value.format('YYYY-MM-DD')]">
                                                        <a-popover placement="left" class="calendar-pop" :visible="item2.visibleInner" title="" trigger="click" :key="item2.id" v-if="key <= 3"  :getPopupContainer="getPopup">
                                                            <a slot="content">
                                                                <a-card class="calendar-pop-detail" size="small" style="width: 350px">
                                                                    <div slot="title">
                                                                        <template  v-if="item.created_by !== currentMemberCode">
                                                                            <span class="m-l-xs muted text-success" v-if="item2.myStatus == 1"><a-icon type="check-circle" class="m-r-xs" theme="filled"/>已接受</span>
                                                                            <span class="m-l-xs muted text-error" v-if="item2.myStatus == 2"><a-icon type="check-circle" class="m-r-xs" theme="filled"/>已拒绝</span>
                                                                            <template v-if="item2.waitConfirm">
                                                                                <a class="m-l-xs muted" @click="confirmJoinEvents(item2, 1)"><a-icon type="check-circle" class="m-r-xs"/>接受</a>
                                                                                <a class="m-l muted" @click="confirmJoinEvents(item2, 2)"><a-icon type="minus-circle" class="m-r-xs"/>拒绝</a>
                                                                            </template>
                                                                        </template>
                                                                        <template v-else>
                                                                            我组织的
                                                                        </template>
                                                                    </div>
                                                                    <div slot="extra">
                                                                        <template v-if="item2.created_by == currentMemberCode">
                                                                            <a-tooltip title="编辑日程">
                                                                                <a class="text-default" @click="rowClick(item2, 'edit')"><a-icon type="edit"/></a>
                                                                            </a-tooltip>
                                                                            <a-tooltip title="取消日程">
                                                                                <a class="text-default" @click="rowClick(item2, 'del')"><a-icon type="delete"/></a>
                                                                            </a-tooltip>
                                                                        </template>
                                                                        <a-tooltip title="关闭面板">
                                                                            <a class="text-default"><a-icon type="close" @click="item2.visibleInner = false"/></a>
                                                                        </a-tooltip>
                                                                    </div>
                                                                    <div class="calendar-content">
                                                                        <div><a-icon type="profile" class="m-r-xs" />{{item2.title}}</div>
                                                                        <div style="display:flex;line-height: 30px;align-items: center">
                                                                            <a-icon type="clock-circle" class="m-r-xs" />
                                                                            <div>{{ moment(item2.begin_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                                                            <div> &nbsp;&nbsp;-&nbsp;&nbsp; </div>
                                                                            <div>{{ moment(item2.end_time).format('YYYY年MM月DD日 HH:mm') }}</div>
                                                                        </div>
                                                                        <div v-if="item2.position" class="line-item"><a-icon type="environment"  class="m-r-xs"/>{{ item2.position }}</div>
                                                                        <template v-if="item2.description">
                                                                            <div class="line-item"><a-icon type="flag" class="m-r-xs" />{{item2.description}}</div>
                                                                        </template>
                                                                        <div class="line-item">
                                                                            <a-icon type="team" class="m-r-xs"/>
                                                                            <template v-for="member in item2.memberList">
                                                                                <a-tooltip :title="`${member.memberInfo.name} ${member.is_owner ? ' · 组织者' : member.status ? member.status == 1 ? ' · 已接受' : ' · 已拒绝' : ' · 未响应'}`" :key="member.id">
                                                                                    <a-tag>
                                                                                        <!--                                                        <a-avatar :size="24" icon="user" :src="member.memberInfo.avatar" class="m-r-sm" />-->
                                                                                        {{member.memberInfo.name}}
                                                                                    </a-tag>
                                                                                </a-tooltip>
                                                                            </template>
                                                                        </div>
                                                                    </div>
                                                                </a-card>
                                                            </a>
                                                            <li>
                                                                <div @click.stop="showCalendarPopInner(item2)">{{item2.title}}</div>
                                                            </li>
                                                        </a-popover>
                                                    </template>
                                                </ul>
                                            </a-card>
                                        </a>
                                        <div  @click.stop="showCalendarPopMore(item)" v-if="key === 3">还有{{list[value.format('YYYY-MM-DD')].length - 3}}项...</div>
                                    </a-popover>
                                </li>
                            </a-popover>
                        </template>
                    </ul>
                    <template slot="headerRender" slot-scope="{ value, type, onChange, onTypeChange }">
                        <div class="calendar-header">
                            <a-button type="dashed" class="m-r" @click="changeMonth(0, onChange)">今天</a-button>
                            <a-button shape="circle" class="m-r" @click="changeMonth(-1, onChange)">
                                <a-icon type="left"/>
                            </a-button>
                            <span class="m-r" style="font-size: 16px;">{{value.format('YYYY年MM月')}}</span>
                            <a-button shape="circle" @click="changeMonth(1, onChange)">
                                <a-icon type="right"/>
                            </a-button>
                            <a-button type="primary" class="m-l" @click="rowClick(null, 'add')">添加日程</a-button>
                        </div>
                    </template>
                </a-calendar>
            </div>
        </div>
        <events v-if="eventsModal" :visible.sync="eventsModal" :code="eventsCode" :date="eventsDate" :project-code="code" @confirm="eventsConfirm"/>
    </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import pagination from "@/mixins/pagination";
import {confirmJoin, del, getEventsListByCalendar} from "@/api/projectEvents";
import {mapState} from "vuex";
import {_allList} from "@/api/user";
import {checkResponse} from "assets/js/utils";
import events from '@/components/project/events'

export default {
    name: "calendar",
    components: {
        events,
    },
    mixins: [pagination],
    data() {
        return {
            moment,
            keyword: '',
            memberCodes: [],
            begin: '',
            calendarValue: moment(),
            showData: false,
            list: [],
            memberList: [],
            memberListTemp: [],
            currentMemberCode: this.$store.state.userInfo.code,

            eventsModal: false,
            eventsCode: '',
            eventsDate: moment(),
            code: ''
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
        })
    },
    watch: {
        keyword() {
            this.search();
        },
        memberCodes() {
            this.getEventsListByCalendar(this.calendarValue);
        }
    },
    created() {
        this.memberCodes.push(this.userInfo.code);
        this.getEventsListByCalendar(this.calendarValue);
        this.getMemberList();
    },
    mounted() {
        this.$nextTick(() => {
            window.scrollTo(0, 0);
        })
    },
    methods: {
        // search: _.debounce(
        //     function () {
        //         // if (!this.keyword) {
        //         //     return false;
        //         // }
        //         // if (this.keyword.length <= 1) {
        //         //     return false;
        //         // }
        //         this.requestData.keyword = this.keyword;
        //         this.getMemberList();
        //     }, 500
        // ),
        search: _.debounce(
            function () {
                this.keyword = this.keyword.trim();
                if (!this.keyword) {
                    this.memberList = JSON.parse(JSON.stringify(this.memberListTemp));
                }
                if (this.keyword.length <= 1) {
                    return false;
                }
                this.memberList = this.memberList.filter(item => item.name.indexOf(this.keyword) != -1);
            }, 500
        ),
        eventsConfirm() {
            this.getEventsListByCalendar(this.calendarValue);
        },
        changeMonth(num, onChange) {
            console.log(num);
            if (num) {
                this.calendarValue.add(num, 'months')
                onChange(this.calendarValue)
            } else {
                this.calendarValue = moment();
                onChange(this.calendarValue)
            }
            this.calendarValue = moment(this.calendarValue.format('YYYY-MM-DD'));
        },
        getListData(value) {
            const date = value.format('YYYY-MM-DD');
            let listData = this.list[date];
            return listData || [];
        },
        onPanelChange(value, mode) {
            console.log(value, mode);
            this.getEventsListByCalendar(value);
        },
        getEventsListByCalendar(value) {
            let app = this;
            let obj = {date: value.format('YYYY-MM-DD HH:mm:ss'), memberCodes: JSON.stringify(this.memberCodes)};
            console.log(obj);
            // this.showData = false;
            getEventsListByCalendar(obj).then(res => {
                this.list = res.data.list;
                this.$nextTick(()=>{
                    $(".ant-fullcalendar-date").hover(function (){
                        $(".add-item").hide();
                        $(this).find(".add-item").show();
                    })
                })
                // this.showData = true;
            });
        },
        getMemberList() {
            _allList(this.requestData).then(res => {
                this.memberList = res.data;
                this.memberListTemp = res.data;
            })
        },
        emitEmpty() {
            this.$refs.keywordInput.focus();
            this.keyword = '';
            this.requestData.keyword = '';
            // this.getMemberList();
        },
        confirmJoinEvents(events, status) {
            let app = this;
            confirmJoin({eventsCode: events.code, status: status}).then(res=>{
                if (checkResponse(res)) {
                    events.waitConfirm = 0;
                    events.myStatus = status;
                    events.memberList.forEach(v => {
                        if (v.member_code == app.$store.state.userInfo.code ) {
                            v.status = status;
                        }
                    })
                }
            });
        },
        showCalendarPop(record) {
            _.forIn(this.list, (calendarList) => {
                calendarList.forEach(item => {item.visible = false;item.visibleMore = false;item.visibleInner = false});
            })
            if (record) {
                record.visible = true;
            }
        },
        showCalendarPopInner(record) {
            _.forIn(this.list, (calendarList) => {
                calendarList.forEach(item => {item.visible = false;item.visibleInner = false});
            })
            if (record) {
                record.visibleInner = true;
            }
        },
        showCalendarPopMore(record) {
            _.forIn(this.list, (calendarList) => {
                calendarList.forEach(item => {item.visibleMore = false;item.visible = false;item.visibleInner = false});
            })
            if (record) {
                record.visibleMore = true;
            }
        },
        async rowClick(record, action, date) {
            let app = this;
            if (date) {
                this.eventsDate = date;
            }else{
                this.eventsDate = moment();
            }

            if (record) {
                record.visible = false;
                record.visibleInner = false;
                record.visibleMore = false;
                this.code = record.project_code;
            }else {
                this.code = '';
            }
            console.log(record);
            if (action == 'add' || action == 'edit' || action == 'new') {
                app.eventsCode = '';
                if (action == 'edit') {
                    app.eventsCode = record.code;
                }
                app.eventsModal = true;
            } else if (action == 'del') {
                app.$confirm({
                    title: `确定要删除?`,
                    content: '关联的相关信息将会同时被删除',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '放弃',
                    onOk() {
                        del({eventsCode: record.code}).then(res=>{
                            if (!checkResponse(res, true)) {
                                return;
                            }
                            app.init(true);
                        })
                    }
                });
            }
        },
        getPopup() {
            return document.getElementById('calendar-index');
        },
    }
}
</script>
<style lang="less">
</style>
<style lang="less">
.calendar-index {
    margin: 24px auto;
    display: flex;
    flex-direction: row;
    min-width: 1200px;
    padding: 0 12px;

    .add-item{
        display: none;
        position: absolute;
        top: 5px;
    }

    .layout-item {
        background: #FFF;
        width: 100%;
    }

    .left {
        padding: 12px 24px 12px 0;
        width: 280px;
        //height: 85vh;

        .left-content {
            width: 255px;
            height: 100%;
            border-right: 1px solid #e8e8e8;

            .content-item {
                padding: 6px 24px 12px 24px;
            }

            .search-content {
                padding: 12px;
            }

            .members {
                padding: 0 15px;
                max-height: 750px;
                overflow-y: auto;

                .ant-checkbox-group {
                    width: 100%;
                }

                .ant-list-item-meta {
                    align-items: center;
                }
            }
        }

        .ant-menu-root {
            border-right: none;
        }
    }

    .right {
        padding: 24px 12px 12px 0;

        .calendar-content {
            //height: 75vh;
            .calendar-header {
                display: flex;
                align-items: center;
                text-align: center;
                width: 380px;
                margin: 15px;
            }

            .ant-fullcalendar-fullscreen, .ant-fullcalendar, .ant-fullcalendar-calendar-body, .ant-fullcalendar table, .ant-fullcalendar-fullscreen .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-date {
                height: 100%;
            }

            .ant-fullcalendar-date {
                background: inherit;
                //padding: 0;
                //margin: 0;

                .ant-fullcalendar-content {
                    overflow-y: hidden;
                }
            }

            .ant-fullcalendar-date:hover {
                background: inherit;
                border-top-color: #1890ff;
            }
        }
    }

    .ant-popover-inner-content{
        padding: 0;
    }
    .calendar-pop-detail{
        .ant-card-extra {
            a{
                margin-left: 10px;
            }
        }
        .ant-card-body{
            line-height: 30px;
        }

    }

    .events {
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 12px;
        line-height: 20px;

        li {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 5px;
            background-color: #f6ffed;
            border: 1px solid #f6ffed;

            &:hover {
                border: 1px solid #b7eb8f;
            }
        }
    }

    .events .ant-badge-status {
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        font-size: 12px;
    }
}
</style>
