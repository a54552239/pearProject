<template>
    <div class="inviteFromLink" style="height: 100%;">
        <div class="content">
            <a-card :title="`来自 ${inviteLink.member.name} 的邀请`">
                <div class="header">
                    <span>
                        {{inviteLink.member.name}} 邀请你<span v-if="inviteLink.invite_type == 'project'">加入项目 {{inviteLink.sourceDetail.name}}</span>
                    </span>
                </div>
                <div class="member-info">
                    <div class="avatar">
                        <a-avatar size="large" :src="userInfo.avatar"></a-avatar>
                    </div>
                    <div class="info">
                        <p>{{userInfo.name}}</p>
                        <p class="muted">{{userInfo.email}}</p>
                    </div>
                </div>
                <a-button type="primary" block size="large" class="middle-btn" @click="acceptInvite">
                    <span v-if="inviteLink.invite_type == 'project'">加入项目</span>
                </a-button>
            </a-card>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {checkResponse} from "@/assets/js/utils";
    import {inviteInfo} from "../../api/common/common";
    import {_joinByInviteLink} from "../../api/projectMember";

    export default {
        components: {},
        data() {
            return {
                loading: false,
                inviteLink: {},
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
                inviteInfo(this.$route.params.code).then(res => {
                    this.inviteLink = res.data;
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
                }
            }
        }
    }
</script>
<style lang="less">
    .inviteFromLink {
        .content {
            width: 400px;
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
