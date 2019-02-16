<template>
    <div class="member-menu" :class="{'creating': creating,'editing': editing}">
        <a-spin :spinning="listLoading">
            <div class="search-content">
                <a-input v-model="keyword" size="large" :placeholder="(creating || editing) ? '标签名称': '搜索标签'">
                    <a-icon slot="prefix" type="search" v-if="!creating && !editing"/>
                    <a-icon slot="prefix" type="tag" v-else/>
                </a-input>
            </div>
            <div class="member-list tag-list">
                <template v-if="!creating && !editing">
                    <vue-scroll>
                        <div class="list-group">
                            <a-list
                                    class="list-content"
                                    itemLayout="horizontal"
                                    :dataSource="list"
                                    v-show="list.length"

                            >
                                <a-list-item class="member-list-item" slot="renderItem" slot-scope="item,index"
                                             @click.native="setTag(item)">
                                    <span slot="actions">
                                       <a class="tag-edit muted">
                                            <a-icon type="edit"
                                                    @click.stop="editTag(item,index)"></a-icon>
                                       </a>
                                        <a-icon type="check" class="m-l-sm" v-show="showCheck(item)"></a-icon>
                                     </span>
                                    <a-list-item-meta>
                                    <span class="tag-title" slot="title"> <a-badge status="success" :class="`badge-${item.color}`"/> {{item.name}}</span>
                                    </a-list-item-meta>
                                </a-list-item>
                            </a-list>
                        </div>
                    </vue-scroll>
                </template>
                <template v-if="creating || editing">
                    <div class="tag-badge">
                        <span class="badge-item" v-for="badge in badgeList" :key="badge" @click="currentBadge = badge">
                            <a-badge status="success"
                                     :class="`badge-${badge}`"/>
                            <a-icon type="check" v-show="currentBadge == badge"/>
                        </span>
                    </div>
                </template>

            </div>
            <div class="footer">
                <template v-if="creating">
                    <a-button type="default" size="large" @click="creating = false,keyword = ''">取消</a-button>
                    <a-button type="primary" :disabled="!keyword" size="large" @click="createTag">创建</a-button>
                </template>
                <template v-else-if="editing">
                    <a-popconfirm :overlayStyle="{zIndex: '1080'}" title="确认删除标签？" okText="确定" cancelText="取消"
                                  @confirm="deleteTag">
                        <a-button type="danger" size="large">删除</a-button>
                    </a-popconfirm>
                    <a-button type="primary" :disabled="!keyword" size="large" @click="saveTag">完成</a-button>
                </template>
                <template v-else>
                    <a-button type="primary" size="large" block @click="creating = true,activeCreating = true">新建标签
                    </a-button>
                </template>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import _ from 'lodash'
    import {del, edit, list, save} from "../../api/taskTag";
    import {setTag, taskToTags} from "../../api/task";
    import {checkResponse} from "../../assets/js/utils";

    export default {
        name: "taskTagMenu",
        props: {
            projectCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            },
            taskCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            },
            isCommit: {//选择后是否提交
                type: [Boolean],
                default() {
                    return true
                }
            },
        },
        data() {
            return {
                keyword: '',
                editing: false, //编辑标签状态
                creating: false, //创建标签状态
                activeCreating: false,//是否手动发起的创建（搜索结果为空时，也会发起创建，但不属于手动发起）
                searching: false,
                listLoading: false,
                showInviteMember: false,
                tags: [],
                list: [],
                listTemp: [],
                badgeList: ['blue', 'red', 'orange', 'green', 'brown', 'purple'],
                currentBadge: 'blue',
                currentTag: {
                    tag: null,
                    index: -1,
                },
            };
        },
        created() {
            this.init();
        },
        watch: {
            keyword() {
                this.search();
            }
        },
        methods: {
            init() {
                if (this.projectCode) {
                    this.listLoading = true;
                    list({projectCode: this.projectCode}).then(res => {
                        this.list = res.data;
                        this.listTemp = res.data;
                        this.listLoading = false;
                    });
                }
                if (this.taskCode) {
                    taskToTags({taskCode: this.taskCode}).then(res => {
                        this.tags = res.data;
                    });
                }
            },
            showCheck(tag) {
                const index = this.tags.findIndex(item => item.tag_code == tag.code)
                if (index !== -1) {
                    return true;
                }
            },
            checkTaskChange(tag) {
                const index = this.tags.findIndex(item => item.tag_code == tag.code)
                if (index !== -1) {
                    this.tags.splice(index, 1);
                } else {
                    this.tags.push({
                        tag_code: tag.code
                    });
                }
            },
            editTag(tag, index) {
                this.editing = true;
                this.keyword = tag.name;
                this.currentBadge = tag.color;
                this.currentTag.tag = tag;
                this.currentTag.index = index;
            },
            saveTag() {
                edit({name: this.keyword, color: this.currentBadge, tagCode: this.currentTag.tag.code}).then(res => {
                    if (!checkResponse(res)) {
                        return false;
                    }
                    this.currentTag.tag.name = this.listTemp[this.currentTag.index].name = this.keyword;
                    this.currentTag.tag.color = this.listTemp[this.currentTag.index].color = this.currentBadge;
                    this.$emit('update', this.currentTag.tag);
                    this.clearCreating();
                });
            },
            deleteTag() {
                del(this.currentTag.tag.code).then(res => {
                    if (!checkResponse(res)) {
                        return false;
                    }
                    this.listTemp.splice(this.currentTag.index, 1);
                    this.$emit('delete', this.currentTag.tag);
                    this.clearCreating();
                });
            },
            setTag(tag) {
                this.checkTaskChange(tag);
                if (this.isCommit) {
                    setTag({taskCode: this.taskCode, tagCode: tag.code}).then(() => {
                        this.$emit('change', tag)
                    });
                } else {
                    this.$emit('change', tag)
                }
            },
            createTag() {
                save({projectCode: this.projectCode, name: this.keyword, color: this.currentBadge}).then(res => {
                    if (!checkResponse(res)) {
                        return false;
                    }
                    const tag = res.data;
                    this.listTemp.push(tag);
                    this.list.push(tag);
                    this.checkTaskChange(tag);
                    setTag({taskCode: this.taskCode, tagCode: tag.code}).then(() => {
                        this.$emit('change', tag);
                        this.clearCreating();
                    });
                });
            },
            clearCreating() {
                this.editing = false;
                this.creating = false;
                this.activeCreating = false;
                this.keyword = '';
            },
            search() {
                this.keyword = this.keyword.trim();
                if (!this.keyword) {
                    this.list = JSON.parse(JSON.stringify(this.listTemp));
                    if (!this.activeCreating) {//如果不是手动发起的创建，则返回搜索结果
                        this.creating = false;
                    }
                }
                this.searching = true;
                this.list = this.list.filter(item => item.name.indexOf(this.keyword) != -1);
                if (!this.list.length && !this.editing) {
                    this.creating = true;
                }
            },
        }
    }
</script>
<style lang="less">
    .creating, .editing {
        &.member-menu {
            height: 190px;

            .member-list {
                height: auto;
            }
        }

        .footer {
            display: flex;
            justify-content: space-between;

            .ant-btn {
                flex: 1;

                &:first-child {
                    margin-right: 6px;
                }
            }
        }
    }

    .tag-list {
        .tag-title {
            display: flex;
            align-items: center;

            .ant-badge-status-dot {
                width: 7px;
                height: 7px;
            }
        }

        .tag-badge {
            display: flex;
            justify-content: space-between;
            margin: 6px 12px 12px 12px;

            .badge-item {
                position: relative;

                .ant-badge-status-dot {
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                }

                .anticon {
                    position: absolute;
                    left: 5px;
                    top: 5px;
                    color: #fff;
                }
            }
        }

        .tag-edit {
            visibility: hidden;
        }

        .member-list-item {
            &:hover {
                .tag-edit {
                    visibility: visible;
                }
            }
        }
    }
</style>
