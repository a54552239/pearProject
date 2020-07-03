<template>
    <div id="app" style="height: 100%">
        <a-config-provider :getPopupContainer="getPopupContainer" :locale="zh_CN">
            <transition name="router-fades" mode="out-in">
                <router-view></router-view>
            </transition>
        </a-config-provider>
    </div>
</template>
<script>
    import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
    import 'moment/locale/zh-cn';
    export default {
        name: 'app',
        data() {
            return {
                zh_CN
            }
        },
        watch: {},
        methods: {
            getPopupContainer(el, dialogContext) {
                if (dialogContext) {
                    return dialogContext.getDialogWrap();
                } else {
                    return document.body;
                }
            },
        },
    }
</script>
