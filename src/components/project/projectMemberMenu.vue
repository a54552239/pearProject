<template>
    <div class="member-menu project-member-menu">
        <a-spin :spinning="projectMemberLoading || taskMemberLoading">
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
                        <span class="title muted">参与者</span>
                        <a-list
                                class="list-content"
                                itemLayout="horizontal"
                                :dataSource="taskMemberList"
                                v-show="taskMemberList.length"

                        >
                            <a-list-item class="member-list-item"
                                         :class="{'owner':item.is_owner}"
                                         slot="renderItem"
                                         slot-scope="item"
                                         @click.native="addToInvite(item.code,item.is_owner)"
                            >
                                <span slot="actions">
                                    <a-icon type="check" v-show="showCheck(item.code)"></a-icon>
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
                        <div class="member-list-item ant-list-item" @click="addToInvite('all')">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <a-avatar icon="user"></a-avatar>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h4 class="ant-list-item-meta-title"><span>所有项目成员</span></h4>
                                </div>
                            </div>
                            <ul class="ant-list-item-action" v-show="showCheck('all')">
                                <li>
                                    <span><a-icon type="check"></a-icon></span>
                                </li>
                            </ul>
                        </div>
                        <a-list
                                class="list-content"
                                itemLayout="horizontal"
                                :dataSource="projectMemberList"
                                :locale="{emptyText: (keyword && keyword.length > 1) ? '该成员不在项目成员列表中' : ''}"
                        >
                            <a-list-item class="member-list-item"
                                         slot="renderItem"
                                         slot-scope="item"
                                         @click.native="addToInvite(item.code,false)"
                                         v-if="showMember(item)">
                                 <span slot="actions">
                                    <a-icon type="check" v-show="showCheck(item.code)"></a-icon>
                                 </span>
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
                <a-button type="primary" size="large" block @click="inviteTaskMember">确定</a-button>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import _ from 'lodash'
    import {inviteMember, list, searchInviteMember} from "../../api/projectMember";
    import {list as getTaskMembers, inviteMemberBatch} from "../../api/taskMember";

    export default {
        name: "projectMemberMenu",
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
            }
        },
        data() {
            return {
                keyword: '',
                searching: false,
                taskMemberLoading: true,
                projectMemberLoading: true,
                showInviteMember: false,
                taskMemberList: [],
                projectMemberList: [],
                listTemp: [],
                projectMemberListCopy: [],
                initAllMember: false, //初始化选择“所有项目成员”
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
                this.projectMemberLoading = true;
                this.taskMemberLoading = true;
                if (this.projectCode) {
                    list({projectCode: this.projectCode, pageSize: 300}).then(res => {
                        this.projectMemberList = res.data.list;
                        this.projectMemberListCopy = res.data.list;
                        this.projectMemberLoading = false;
                    });
                }
                if (this.taskCode) {
                    getTaskMembers({taskCode: this.taskCode, pageSize: 300}).then(res => {
                        this.taskMemberList = res.data.list;
                        res.data.list.forEach((v) => {
                            this.listTemp.push(v.code);
                        });
                        this.taskMemberLoading = false;
                    });
                }
            },
            showMember(item) {
                let show = true;
                this.taskMemberList.forEach((v) => {
                    if (item.code == v.code) {
                        show = false;
                    }
                });
                return show;
            },
            showCheck(code) {
                if (code == 'all' && !this.initAllMember) {
                    return false;
                }
                const index = this.listTemp.find(item => item == code);
                if (index) {
                    return true;
                }
            },
            addToInvite(code, isOwner = false) {
                if (isOwner) {
                    return false;
                }
                if (code == 'all') {
                    this.initAllMember = true;
                }
                const index = this.listTemp.findIndex(item => item == code);
                if (index !== -1) {
                    this.listTemp.splice(index, 1);
                } else {
                    this.listTemp.push(code);
                }
            },
            inviteTaskMember() {
                //求差集
                let memberCodes = [];
                this.taskMemberList.forEach((item) => {
                    const index = this.listTemp.findIndex(code => code == item.code);
                    if (index === -1) {
                        memberCodes.push(item.code);
                    }
                });
                this.listTemp.forEach((code) => {
                    const index = this.taskMemberList.findIndex(item => code == item.code);
                    if (index === -1) {
                        memberCodes.push(code);
                    }
                });
                if (memberCodes) {
                    inviteMemberBatch({memberCodes: JSON.stringify(memberCodes), taskCode: this.taskCode}).then(() => {
                        this.$emit('close')
                    });
                }else{
                    this.$emit('close')
                }
            },
            search: _.debounce(
                function () {
                    this.keyword = this.keyword.trim();
                    if (!this.keyword) {
                        this.projectMemberList = JSON.parse(JSON.stringify(this.projectMemberListCopy));
                    }
                    if (this.keyword.length <= 1) {
                        return false;
                    }
                    this.searching = true;
                    this.projectMemberList = this.projectMemberList.filter(item => item.name.indexOf(this.keyword) != -1);
                    // searchInviteMember(this.keyword, this.projectCode).then(res => {
                    //     this.searching = false;
                    //     this.list = res.data;
                    // });
                }, 500
            ),
        }
    }
</script>
