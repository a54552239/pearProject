<template>
    <div class="error-page">
        <div class="exception">
            <div class="imgBlock">
                <div class="img-exception">
                    <slot name="img"></slot>
                </div>
            </div>
            <div class="content">
                <h1>{{code}}</h1>
                <div class="desc">{{desc}}</div>
                <div class="actions">
                    <router-link :to="url">
                        <Button type="primary">{{urlText}}</Button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Button} from 'ant-design-vue';
    import {getStore} from "../../assets/js/storage";
    const currentOrganization = getStore('currentOrganization', true);

    export default {
        components: {
            Button
        },
        props: {
            code: {
                default: '500'
            },
            desc: {
                default: '抱歉，服务器出错了',
            },
            url: {
                default: currentOrganization ? '/home/' + currentOrganization.code : '/home'
            },
            urlText: {
                default: '返回首页'
            }
        },
        data() {
            return {}
        },
    }
</script>
<style lang="less">
    .error-page {
        background: #f0f2f5;
        height: 100vh;
    }

    .exception {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        height: 70vh;
    }

    .exception .imgBlock {
        -ms-flex: 0 0 62.5%;
        flex: 0 0 55.5%;
        width: 62.5%;
        padding-right: 60px;
        zoom: 1;
    }

    .exception .img-exception {
        width: 100%;
        max-width: 430px;
        float: right;
        background: no-repeat 50% 50%;
        background-size: contain;
    }

    .exception .img-exception img {
        width: 75%;
    }

    .exception .content {
        -ms-flex: auto;
        flex: auto;
    }

    .exception .content h1 {
        color: #434e59;
        font-size: 72px;
        font-weight: 600;
        line-height: 72px;
        margin-bottom: 24px;
    }

    .exception .content .desc {
        color: rgba(0, 0, 0, .45);
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
    }
</style>
