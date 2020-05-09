<template>
    <div class="project-archive-index">
        <wrapper-content :showHeader="false">
            <a-list
                    class="project-list"
                    :loading="loading"
                    itemLayout="horizontal"
                    :dataSource="dataSource"
                    :locale="{emptyText:''}"
            >
                <div v-if="showLoadingMore" slot="loadMore"
                     :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore"/>
                    <a-button v-else @click="onLoadMore">查看更多项目</a-button>
                </div>
                <a-list-item slot="renderItem" slot-scope="item,index">
                     <span slot="actions">
                         <a-tooltip title="恢复项目" @click="doAction(item,'recoveryArchive',index)">
                             <a-icon type="undo"/>
                         </a-tooltip>
                    </span>
                    <span slot="actions" @click="doAction(item,'del',index)">
                         <a-tooltip title="移至回收站">
                              <a-icon type="delete"/>
                         </a-tooltip>
                    </span>
                    <a-list-item-meta
                            :description="item.description"
                    >
                        <router-link  :to="'/project/space/task/' + item.code" slot="title">{{item.name}}</router-link>
                        <a-avatar slot="avatar" icon="user" :src="item.cover"/>
                    </a-list-item-meta>
                    <div class="other-info muted">
                        <div class="info-item">
                            <span>移动日期</span>
                            <span>{{moment(item.archive_time).format('YYYY-MM-DD')}}</span>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
        </wrapper-content>
    </div>
</template>
<script>
    import {list, doData, del} from '@/api/project';
    import {checkResponse} from '@/assets/js/utils';
    import pagination from "@/mixins/pagination";
    import moment from 'moment';
    import {recoveryArchive, recycle} from "../../../api/project";

    export default {
        mixins: [pagination],
        data() {
            return {
                dataSource: [],
                loading: true,
                showLoadingMore: false,
                loadingMore: false,
                showInviteMember: false,
                currentProject: {},
                currentProjectId: 0,
                newData: {
                    id: 0
                },
            }
        },
        created() {
            this.init();
        },
        methods: {
            moment,
            init(reset = true) {
                let app = this;
                if (reset) {
                    this.dataSource = [];
                    this.pagination.page = 1;
                    this.pagination.pageSize = 1000;
                    this.showLoadingMore = false;
                }
                this.requestData.archive = 1;
                this.requestData.type = 'other';
                app.loading = true;
                list(app.requestData).then(res => {
                    app.dataSource = app.dataSource.concat(res.data.list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.dataSource.length;
                    app.loading = false;
                    app.loadingMore = false
                });
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.init(false);
            },
            inviteProjectMember(item){
                this.currentProject = item;
                this.currentProjectId = item.id;
                this.showInviteMember = true;
            },
            doAction(record, action,index) {
                this.currentProject = record;
                let app = this;
                app.newData = {id: 0};
                 if (action == 'recoveryArchive') {
                    this.$confirm({
                        title: '取消归档项目？',
                                content: `取消归档「${this.currentProject.name}」后就可以正常使用了`,
                        okText: '取消归档',
                        okType: 'primary',
                        cancelText: '再想想',
                        onOk() {
                            recoveryArchive(record.code).then(()=>{
                                app.dataSource.splice(index, 1);
                            });
                            return Promise.resolve();
                        }
                    });
                }else if (action == 'del') {
                     this.$confirm({
                         title: '确定放入回收站？',
                         content: `一旦将项目「${this.currentProject.name}」放入回收站，所有与项目有关的信息将会被放入回收站`,
                         okText: '放入回收站',
                         okType: 'danger',
                         cancelText: '再想想',
                         onOk() {
                             recycle(record.code).then(()=>{
                                 app.dataSource.splice(index, 1);
                             });
                             return Promise.resolve();
                         }
                     });
                 }
            },
        }
    }
</script>
<style lang="less">
    @import "../../../../node_modules/ant-design-vue/lib/style/themes/default";

    .project-archive-index {
        .project-list {
            .ant-list-item-meta-avatar {
                .ant-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 3px;
                }
            }

            .ant-list-item-content {
                .other-info {
                    display: flex;

                    .info-item {
                        display: flex;
                        flex-direction: column;
                        padding-left: 48px;
                    }
                }
            }

            .ant-list-item-action {
                .anticon:hover {
                    svg {
                        color: @primary-color;
                    }
                }
            }
        }
    }
</style>
