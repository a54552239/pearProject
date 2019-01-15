<template>
    <div class="account-setting">
        <div class="layout-item left">
            <div class="left-content">
                <div class="search-type">
                    <a-menu mode="inline" :selectedKeys="keys" @click="menuClick">
                        <a-menu-item key="base">
                            <span>基本设置</span>
                        </a-menu-item>
                        <a-menu-item key="security">
                            <span>安全设置</span>
                        </a-menu-item>
                       <!-- <a-menu-item key="binding">
                            <span>账号绑定</span>
                        </a-menu-item>
                        <a-menu-item key="notification">
                            <span>新消息通知</span>
                        </a-menu-item>-->
                    </a-menu>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "accountSetting",
        props: {
            keys: {
                type: Array,
                default: function () {
                    return ['base'];
                }
            }
        },
        methods: {
            menuClick(event) {
                const key = event.key;
                let url = '';
                switch (key) {
                    case "base":
                        url = '/account/setting/base';
                        break;
                    case "security":
                        url = '/account/setting/security';
                }
                this.$router.push(url);
            },
        }
    }
</script>

<style lang="less">
    .account-setting {
        .left {
            height: 100%;
            width: 225px;
            border-right: 1px solid #e8e8e8;

            .ant-menu-root {
                border-right: none;
            }
        }
    }
</style>
