<template>
    <div class="admin-auth-apply">
        <wrapper-content>
            <div slot="page-action">

            </div>
            <div style="padding: 12px;">
                <Button @click="back">返回</Button>
                <Button type="primary" @click="saveAuth" :style="{marginLeft: '4px'}">保存</Button>
            </div>
            <Tree
                    checkable
                    :defaultExpandAll="defaultExpandAll"
                    :autoExpandParent="autoExpandParent"
                    v-if="nodeList.length"
                    :treeNodes="nodeList"
                    v-model="checkedList"
            >
            </Tree>
        </wrapper-content>
    </div>
</template>
<script>
    import {Button, Tree} from 'ant-design-vue';
    import {getAuthList, apply} from '@/api/auth';
    import {createRoute, checkResponse} from '@/assets/js/utils';
    import {getStore} from '@/assets/js/storage';

    export default {
        components: {
            Button,
            Tree
        },
        data() {
            return {
                nodeList: [],
                checkedList: [],
                defaultExpandAll: true,
                autoExpandParent: true,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let app = this;
                apply(app.$route.params.id).then(res => {
                    app.nodeList = res.data.list;
                    app.checkedList = res.data.checkedList;
                });
            },
            saveAuth() {
                let app = this;
                apply(app.$route.params.id, JSON.stringify(app.checkedList), 'save')
            },
            back(){
                this.$router.push('/system/account/auth')
            }
        }
    }
</script>
<style lang="less">
    .admin-auth-apply {
        .ant-tree li ul {
            margin: 12px 0;
        }
        .ant-tree-child-tree-open {
            .ant-tree-child-tree-open li {
                display: inline;
                white-space: initial;
            }
        }
    }
</style>
