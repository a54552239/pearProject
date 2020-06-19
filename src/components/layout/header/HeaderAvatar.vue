<template>
    <div v-if="userInfo">
        <a-dropdown class="action-item" placement="bottomRight">
            <div class="user-info">
                <a-avatar :src="userInfo.avatar" alt="">{{userInfo.name}}</a-avatar>
                <span>{{userInfo.name}}</span>
            </div>
            <a-menu slot="overlay" class="middle-menu" :selectable="false" @click="userAction">
                <a-menu-item key="setting">
                    <a href="javascript:;">
                        <a-icon type="user"></a-icon>
                        个人设置</a>
                </a-menu-item>
                <a-menu-item key="theme">
                    <a href="javascript:;">
                        <a-icon type="swap"/>
                        切换主题</a>
                </a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="logout">
                    <a href="javascript:;">
                        <a-icon type="logout"></a-icon>
                        退出登录</a>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>

</template>

<script>
    import {mapState} from 'vuex'
    import {_out} from "../../../api/user";

    export default {
        name: 'HeaderAvatar',
        data() {
            return {}
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
                theme: state => state.theme,
            })
        },
        methods: {
            userAction(action) {
                let app = this;
                if (action.key == 'logout') {
                    _out();
                    app.$store.dispatch('SET_LOGOUT');
                } else if (action.key == 'setting') {
                    app.$router.push('/account/setting/base');
                } else if (action.key == 'theme') {
                    let theme = 'dark';
                    if (this.theme == theme) {
                        theme = 'light';
                    }
                    this.$store.dispatch('setTheme', theme);
                } else {
                }
            },
        }
    }
</script>

<style lang="less">
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }

    .avatar-uploader img {
        width: 100%;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
