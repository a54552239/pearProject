<template>
    <a-modal
            class="invite-project-member"
            :width="360"
            v-model="actionInfo.modalStatus"
            :title="actionInfo.modalTitle"
            :footer="null"
            @cancel="cancel"
    >
        <div class="header">
            <span>账号邀请</span>
            <a>通过链接邀请</a>
        </div>
        <div class="search-content">
            <a-input v-model="keyword" placeholder="输入昵称或邮箱查找">
                <a-icon slot="prefix" type="search"/>
            </a-input>
        </div>
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
    </a-modal>
</template>

<script>
    import _ from 'lodash'
    import {inviteMember, searchInviteMember} from "../../api/projectMember";
    import {checkResponse} from "../../assets/js/utils";

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
        methods: {
            invite(item) {
                inviteMember(item.memberCode, this.projectCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                    }
                })
            },
            search: _.debounce(
                function () {
                    if (!this.keyword) {
                        this.list = [];
                    }
                    if (this.keyword.length <= 1) {
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
            padding-top: 12px;
        }

    }
</style>
