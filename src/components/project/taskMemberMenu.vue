<template>
    <div class="member-menu">
        <a-spin :spinning="listLoading || doListLoading">
            <!--<div class="header">
            </div>-->
            <div class="search-content">
                <a-input v-model="keyword" size="large" placeholder="搜索">
                    <a-icon slot="prefix" type="search"/>
                </a-input>
            </div>
            <div class="member-list">
                <vue-scroll>
                    <div class="list-group" v-show="!keyword">
                        <span class="title muted">执行者</span>
                        <div class="member-list-item ant-list-item" v-if="!doList.length && !doListLoading" @click="assignTask(null)">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <a-avatar icon="user"></a-avatar>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h4 class="ant-list-item-meta-title"><span>待认领</span></h4>
                                </div>
                            </div>
                            <ul class="ant-list-item-action">
                                <li>
                                    <span><a-icon type="check"></a-icon></span>
                                </li>
                            </ul>
                        </div>
                        <a-list
                                class="list-content"
                                itemLayout="horizontal"
                                :dataSource="doList"
                                v-show="doList.length"

                        >
                            <a-list-item class="member-list-item" slot="renderItem" slot-scope="item">
                    <span slot="actions">
                        <a-icon type="check" v-show="showCheck(item)"></a-icon>
                     </span>
                                <a-list-item-meta>
                                    <span slot="title">{{item.name}}</span>
                                    <a-avatar slot="avatar" icon="user" :src="item.avatar"/>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </div>
                    <div class="list-group">
                        <span class="title muted">其他成员</span>
                        <div class="member-list-item ant-list-item" v-if="doList.length" @click="assignTask(null)">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <a-avatar icon="user"></a-avatar>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h4 class="ant-list-item-meta-title"><span>待认领</span></h4>
                                </div>
                            </div>
                        </div>
                        <a-list
                                class="list-content"
                                itemLayout="horizontal"
                                :dataSource="list"
                                :locale="{emptyText: (keyword && keyword.length > 1) ? '该成员不在任务成员列表中，你可以邀请他进来' : ''}"
                        >
                            <a-list-item class="member-list-item"
                                         slot="renderItem"
                                         slot-scope="item"
                                         @click.native="assignTask(item.code,item)"
                                         v-if="showMember(item)">
                                <a-list-item-meta>
                                    <span slot="title">{{item.name}}</span>
                                    <a-avatar slot="avatar" icon="user" :src="item.avatar"/>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </div>
                </vue-scroll>
            </div>
            <div class="footer">
                <a-button type="primary" size="large" block @click="inviteProjectMember">邀请新成员</a-button>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import _ from 'lodash'
    import {list} from "../../api/projectMember";
    import {list as getTaskMembers} from "../../api/taskMember";
    import {assignTask} from "../../api/task";

    export default {
        name: "taskMemberMenu",
        props: {
            projectCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            },
            taskCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            },
            isCommit: {//选择后是否提交
                type: [Boolean],
                default() {
                    return true
                }
            },
        },
        data() {
            return {
                keyword: '',
                searching: false,
                doListLoading: false,
                listLoading: false,
                showInviteMember: false,
                doList: [],
                list: [],
                listTemp: [],
            };
        },
        created() {
            this.init();
        },
        watch: {
            keyword() {
                this.search();
            }
        },
        methods: {
            init() {
                if (this.projectCode) {
                    this.listLoading = true;
                    list({projectCode: this.projectCode, pageSize: 300}).then(res => {
                        this.list = res.data.list;
                        this.listTemp = res.data.list;
                        this.listLoading = false;
                    });
                }
                if (this.taskCode) {
                    this.doListLoading = true;
                    getTaskMembers({taskCode: this.taskCode, pageSize: 300}).then(res => {
                        this.doList = res.data.list.filter(item => item.is_executor);
                        this.doListLoading = false;
                    });
                }
            },
            showMember(item) {
                let show = true;
                this.doList.forEach((v) => {
                    if (item.code == v.code) {
                        show = false;
                    }
                });
                return show;
            },
            showCheck(item) {
                if (item.is_executor) {
                    return true;
                }
            },
            assignTask(executorCode, executor = null) {
                if (this.isCommit) {
                    assignTask({taskCode: this.taskCode, executorCode: executorCode}).then(() => {
                        this.$emit('close', executor)
                    });
                }else{
                    this.$emit('close', executor)
                }
            },
            inviteProjectMember() {
                this.$emit('inviteProjectMember')
            },
            search: _.debounce(
                function () {
                    this.keyword = this.keyword.trim();
                    if (!this.keyword) {
                        this.list = JSON.parse(JSON.stringify(this.listTemp));
                    }
                    if (this.keyword.length <= 1) {
                        return false;
                    }
                    this.searching = true;
                    this.list = this.list.filter(item => item.name.indexOf(this.keyword) != -1);
                    // searchInviteMember(this.keyword, this.projectCode).then(res => {
                    //     this.searching = false;
                    //     this.list = res.data;
                    // });
                }, 500
            ),
        }
    }
</script>
