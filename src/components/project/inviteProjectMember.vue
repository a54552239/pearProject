<template>
    <div>
        <a-modal
                class="invite-project-member"
                :width="500"
                v-model="actionInfo.modalStatus"
                :title="actionInfo.modalTitle"
                :footer="null"
                @cancel="cancel"
        >
            <div class="header">
                <span>账号邀请</span>
                <a @click="createInviteLink">通过链接邀请</a>
            </div>
            <div class="search-content m-b">
                <a-input v-model="keyword" placeholder="输入昵称或邮箱查找">
                    <a-icon slot="prefix" type="search"/>
                </a-input>
            </div>
            <vue-scroll>
                <div class="member-list">
                    <a-list
                            class="project-list"
                            itemLayout="horizontal"
                            :loading="searching"
                            :dataSource="list"
                            :locale="{emptyText: (keyword && keyword.length > 1) ? '没有搜索到相关成员' : ''}"
                    >
                        <a-list-item slot="renderItem" slot-scope="item">
                    <span slot="actions">
                        <a-button size="small" type="dashed" icon="user-add"
                                  v-if="!item.joined"
                                  @click="invite(item)"
                        >邀请</a-button>
                        <template v-else>
                             <a-icon type="user"></a-icon>
                            <span> 已加入</span>
                        </template>
                     </span>
                            <a-list-item-meta
                                    :description="item.email"
                            >
                                <span slot="title">{{item.name}}</span>
                                <a-avatar slot="avatar" icon="user" :src="item.avatar"/>
                            </a-list-item-meta>
                        </a-list-item>
                    </a-list>
                </div>
            </vue-scroll>
        </a-modal>
        <a-modal
                class="invite-link"
                :width="600"
                v-model="linkInfo.modalStatus"
                :title="linkInfo.modalTitle"
                :footer="null"
        >
            <div class="header">
                <p>链接有效日期：{{linkInfo.overTime}}</p>
                <a-input-search
                        size="large"
                        v-model="linkInfo.link"
                        v-clipboard:copy="linkInfo.link"
                        enterButton="复制链接"
                />
            </div>
        </a-modal>
    </div>

</template>

<script>
    import _ from 'lodash'
    import moment from 'moment';
    import {inviteMember, searchInviteMember, _listForInvite} from "../../api/projectMember";
    import {checkResponse} from "../../assets/js/utils";
    import {createInviteLink} from "../../api/common/common";

    export default {
        name: "inviteProjectMember",
        props: {
            value: {
                type: Boolean,
                default() {
                    return false
                }
            },
            projectCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            }
        },
        data() {
            return {
                form: this.$form.createForm(this),
                actionInfo: {
                    modalStatus: this.value,
                    confirmLoading: false,
                    modalTitle: '邀请新成员',
                },
                linkInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '邀请成员',
                    link: '',
                    overTime: '',
                },
                keyword: '',
                searching: false,
                list: [],
                // emptyText: keyword ? '没有搜索结果' : ''
            };
        },
        watch: {
            value(value) {
                this.actionInfo.modalStatus = value;
            },
            keyword() {
                this.search();
            }
        },
        created() {
            this.getMembers();
        },
        methods: {
            getMembers() {
                let app = this;
                _listForInvite({projectCode: app.projectCode}).then(res=>{
                    app.list = res.data;
                });
            },
            invite(item) {
                inviteMember(item.memberCode, this.projectCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                    }
                })
            },
            createInviteLink() {
                if (!this.linkInfo.link) {
                    createInviteLink({inviteType: 'project', sourceCode: this.projectCode}).then(res => {
                        const success = checkResponse(res);
                        if (success) {
                            this.linkInfo.modalStatus = true;
                            this.linkInfo.link = window.location.href.split('#')[0] + '#/invite_from_link/' + res.data.code;
                            this.linkInfo.overTime = moment(res.data.code.over_time).format('YYYY年M月D日 HH:mm');
                        }
                    });
                }else{
                    this.linkInfo.modalStatus = true;
                }
            },
            search: _.debounce(
                function () {
                    if (!this.keyword) {
                        this.list = [];
                    }
                    if (this.keyword.length <= 1) {
                        this.getMembers();
                        return false;
                    }
                    this.searching = true;
                    searchInviteMember(this.keyword, this.projectCode).then(res => {
                        this.searching = false;
                        this.list = res.data;
                    });
                }, 500
            ),
            cancel() {
                this.actionInfo.modalStatus = false;
                this.$emit('input', this.actionInfo.modalStatus);
            }
        }
    }
</script>

<style lang="less">
    .invite-project-member {
        .ant-modal-body {
            padding-top: 0;
            padding-right: 12px;
            padding-bottom: 24px;
            min-height: 40vh;
        }

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 12px 0;
        }

        .member-list {
            padding-right: 12px;
            max-height: 400px;
        }

    }
</style>
