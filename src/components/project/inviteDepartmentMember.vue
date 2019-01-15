<template>
    <a-modal
            class="invite-department-member"
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
                        >添加</a-button>
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
    import {inviteMember, searchInviteMember} from "../../api/departmentMember";
    import {checkResponse} from "../../assets/js/utils";


    export default {
        name: "inviteDepartmentMember",
        props: {
            value: {
                type: Boolean,
                default() {
                    return false
                }
            },
            departmentCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            },
        },
        data() {
            return {
                form: this.$form.createForm(this),
                actionInfo: {
                    modalStatus: this.value,
                    confirmLoading: false,
                    modalTitle: this.departmentCode? '添加成员至部门' : '添加成员至组织',
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
        created(){
            if (this.departmentCode) {
                this.searching = true;
                searchInviteMember(this.keyword, this.departmentCode).then(res => {
                    this.searching = false;
                    this.list = res.data;
                });
            }
        },
        methods: {
            invite(item) {
                inviteMember(item.accountCode, this.departmentCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                        this.$emit('update', item);
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
                    searchInviteMember(this.keyword, this.departmentCode).then(res => {
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
    .invite-department-member {
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
