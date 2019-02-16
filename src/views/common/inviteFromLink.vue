<template>
    <div class="inviteFromLink" style="height: 100%;">
        <div class="content">
            <a-spin :spinning="loading">
                <a-card v-if="inviteLink" :title="`来自 ${inviteLink.member.name} 的邀请`">
                    <div class="header">
                    <span>
                        {{inviteLink.member.name}} 邀请你
                        <span v-if="inviteLink.invite_type == 'project'">加入项目「{{inviteLink.sourceDetail.name}}」</span>
                        <span v-if="inviteLink.invite_type == 'organization'">加入组织「{{inviteLink.sourceDetail.name}}」</span>

                    </span>
                    </div>
                    <div class="member-info">
                        <div class="avatar">
                            <a-avatar size="large" :src="inviteLink.member.avatar"></a-avatar>
                        </div>
                        <div class="info">
                            <p>{{inviteLink.member.name}}</p>
                            <p class="muted">{{inviteLink.member.email}}</p>
                        </div>
                    </div>
                    <a-button type="primary" block size="large" class="middle-btn" @click="acceptInvite">
                        <span v-if="inviteLink.invite_type == 'project'">加入项目</span>
                        <span v-if="inviteLink.invite_type == 'organization'">加入组织</span>
                    </a-button>
                </a-card>
            </a-spin>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {checkResponse} from "@/assets/js/utils";
    import {inviteInfo} from "../../api/common/common";
    import {_joinByInviteLink} from "../../api/projectMember";
    import {_joinByInviteLink as joinOrganation} from "../../api/user";

    export default {
        data() {
            return {
                loading: false,
                inviteLink: undefined,
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            })
        },
        created() {
            this.getInviteInfo();
        },
        methods: {
            getInviteInfo() {
                this.loading = true;
                inviteInfo(this.$route.params.code).then(res => {
                    this.inviteLink = res.data;
                    this.loading = false;
                });
            },
            acceptInvite() {
                if (this.inviteLink.invite_type == 'project') {
                    _joinByInviteLink(this.$route.params.code).then(res => {
                        const result = checkResponse(res);
                        if (!result) {
                            return false;
                        }
                        this.$router.replace({name: 'task', params: {code: this.inviteLink.source_code}})
                    });
                } else if (this.inviteLink.invite_type == 'organization') {
                    joinOrganation(this.$route.params.code).then(res => {
                       ``
                        this.$notice({title: '你已成功加入组织', msg: '重新登录后可选择进入该组织'}, 'notice', 'success');
                        this.$router.replace('/')
                    });
                }
            }
        }
    }
</script>
<style lang="less">
    .inviteFromLink {
        .content {
            width: 600px;
            margin: 50px auto;

            .header {
                font-size: 18px;
            }

            .member-info {
                margin: 36px 0;
                display: flex;
                align-items: center;

                .avatar {
                    margin-right: 12px;
                }

                .info {
                    p {
                        margin: 0;
                    }
                }
            }
        }
    }
</style>
