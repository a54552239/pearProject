<template>
    <div class="project-space-task">
        <div class="project-navigation">
            <div class="project-nav-header">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <a-tooltip :mouseEnterDelay="0.3" :title="project.name">
                            <span class="nav-title">{{ project.name }}</span>
                        </a-tooltip>
                        <span class="actions">
                             <a-tooltip :mouseEnterDelay="0.3" :title="project.collected ? '取消收藏' : '加入收藏'"
                                        @click="collectProject">
                            <a-icon type="star" theme="filled" style="color: grey;" v-show="!project.collected"/>
                            <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="project.collected"/>
                        </a-tooltip>
                        </span>
                        <span class="label label-normal" v-if="project.private === 0"><a-icon type="global"/> 公开</span>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li class="actives"><a class="app" data-app="tasks">任务</a></li>
                    <li class=""><a class="app" data-app="works"
                                    @click="$router.push('/project/space/files/' + project.code)">
                        文件</a>
                    <li class=""><a class="app" data-app="build"
                                    @click="$router.push('/project/space/overview/' + project.code)">
                        概览</a>
                    </li>
                    <li class=""><a class="app" data-app="build" @click="$router.push('/project/build/' + project_id)">
                        版本 * </a>
                    </li>
                </ul>
            </section>
            <div class="project-nav-footer">
                <a class="footer-item" :class="{active:slideMenuKey == 'member'}" @click="visibleDraw('member')">
                    <a-icon type="user"></a-icon>
                    <span> {{projectMembers.length}}</span>
                </a>
                <a class="footer-item" :class="{active:slideMenuKey == 'config'}" @click="visibleDraw('config')">
                    <a-icon type="menu"></a-icon>
                    <span> 菜单</span>
                </a>
            </div>
        </div>
        <wrapper-content :showHeader="false">
            <draggable v-model="taskStages"
                       :options="{group:'stages',filter:'.undraggables',handle:'.ui-sortable-handle',ghostClass:'stage-ghost',animation: 200,forceFallback:false}"
                       id="board-scrum-stages" class="board-scrum-stages" :move="stageMove" @update="stageSort">
                <div class="scrum-stage" v-for="(stage,index) in taskStages" :key="index" :id="stage.code"
                     :class="{ 'fixed-creator': stage.fixedCreator == true}">
                    <!--<a-spin wrapperClassName="tasks-loading" :spinning="stage.tasksLoading">-->
                    <!--<a-tooltip placement="top" >
                     <template slot="title">
                         {{ stage.name }}
                         <span class="task-count" v-if="stage.list.length > 0"> · {{ stage.list.length }}</span>
                     </template>-->
                    <header class="scrum-stage-header ui-sortable-handle" v-show="!stage.tasksLoading">
                        <div class="stage-name hinted">
                            {{ stage.name }}
                            <span class="task-count"
                                  v-if="stage.tasks.length > 0"> · {{ stage.tasks.length }}</span>
                        </div>
                        <div class="stage-menu-toggler popover">
                            <a-dropdown :trigger="['click']" placement="bottomCenter">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>编辑任务列表</span>
                                    </template>
                                    <a href="javascript:void(0)" class="menu-toggler-title">
                                        <a-icon type="down-circle" style="font-size: 18px;"/>
                                    </a>
                                </a-tooltip>
                                <!--<div slot="overlay" class="task-popover-content">-->
                                <!--<header class="popover-header" name="333">
                                    <span class="popover-title">列表菜单</span>
                                </header>-->
                                <a-menu slot="overlay" @click="doStage" :selectable="false">
                                    <a-menu-item :key="'editStage_' + stage.code + '_' + index">
                                        <a-icon type="edit"></a-icon>
                                        编辑列表
                                    </a-menu-item>
                                    <a-menu-item :key="'setExecutor_' + stage.code + '_' + index">
                                        <a-icon size="14" type="user"></a-icon>
                                        设置本列所有任务执行者
                                    </a-menu-item>
                                    <!--<a-menu-item :key="'setEndTime_' + stage.code + '_' + index">
                                        <a-icon size="14" type="clock-circle"></a-icon>
                                        设置本列所有任务截止时间 *
                                    </a-menu-item>-->
                                    <a-menu-item :key="'recycleBatch_' + stage.code + '_' + index">
                                        <a-icon size="14" type="delete"></a-icon>
                                        本列所有任务移到回收站
                                    </a-menu-item>
                                    <a-menu-item :key="'delStage_' + stage.code + '_' + index">
                                        <a-icon size="14" type="delete"></a-icon>
                                        删除列表
                                    </a-menu-item>
                                </a-menu>
                                <!--</div>-->
                            </a-dropdown>
                        </div>
                    </header>
                    <!--</a-tooltip>-->
                    <div class="scrum-stage-wrap ui-sortable"
                         :class="{ 'hidden-creator-bottom': stage.showTaskCard}">
                        <vue-scroll :ref="index + '-stage'" @handle-resize="handleResize($event,index)"
                                    :ops="scrollOps">
                            <section :id="stage.code" :task-type-index="index"
                                     class="scrum-stage-content thin-scroll">
                                <a-spin wrapperClassName="tasks-loading" :spinning="stage.tasksLoading">
                                    <!--未完成列表-->
                                    <draggable v-model="stage.tasks"
                                               :options="{group:'task',ghostClass:'task-ghost',dragClass:'task-drag',fallbackClass:'task-drag',forceFallback:false}"
                                               @end="taskSort"
                                               class="scrum-stage-tasks">
                                        <template v-for="(task,taskIndex) in stage.tasks">
                                            <div class="task task-card ui-sortable-handle"
                                                 :index="taskIndex"
                                                 :id="task.code"
                                                 :key="task.code"
                                                 :class="showTaskPri(task.pri)"
                                                 v-if="!task.done && task.canRead"
                                                 @click.stop="taskDetail(task.code,index)"
                                            >
                                                <div class="task-priority bg-priority-0"></div>
                                                <a-tooltip placement="top">
                                                    <template slot="title">
                                                        <span v-if="task.hasUnDone" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                                                    </template>
                                                    <a class="check-box"
                                                       :class="{'disabled': task.hasUnDone}"
                                                       @click.stop="taskDone(task.code,index,taskIndex,1)"></a>
                                                </a-tooltip>
                                                <div class="task-content-set open-detail">
                                                    <div class="task-content-wrapper">
                                                        <div class="task-content"> {{ task.name }}</div>
                                                        <a-tooltip placement="top"
                                                                   v-if="task.executor && task.executor.avatar">
                                                            <template slot="title">
                                                                <span>{{task.executor.name}}</span>
                                                            </template>
                                                            <img
                                                                    :src="task.executor.avatar"
                                                                    :title="task.executor.name"
                                                                    class="avatar img-circle img-24 hinted">
                                                        </a-tooltip>
                                                    </div>
                                                    <div class="task-info-wrapper clearfix">
                                                        <div class="task-infos">
                                                       <span class="label" :class="showTimeLabel(task.end_time)"
                                                             v-if="task.end_time">
                                                            <span :title="task.end_time">
                                                               {{ showTaskTime(task.begin_time,task.end_time)}}
                                                            </span>
                                                        </span>
                                                            <span class="icon-wrapper muted" v-if="task.description">
                                                           <a-icon type="file-text"></a-icon>
                                                       </span>
                                                            <span class="icon-wrapper muted" v-if="task.hasSource">
                                                             <a-icon type="link"></a-icon>
                                                       </span>
                                                            <span class="icon-wrapper muted" v-if="task.hasComment">
                                                           <a-icon type="message"/>
                                                        </span>
                                                            <span class="icon-wrapper muted"
                                                                  v-if="task.childCount[0] > 0">
                                                             <a-icon type="bars"></a-icon>
                                                            <span>{{task.childCount[1]}}/{{task.childCount[0]}}</span>
                                                       </span>
                                                            <span class="tag muted" :class="'tag-color-'+ tag.color"
                                                                  v-for="(tag,tag_index) in task.task_tag_item_list"> {{ tag.name }} </span>
                                                            <span :class="'icon-wrapper text text-' + task.task_execute.color"
                                                                  v-if="task.execute_state > 0">{{ task.task_execute_name }}</span>
                                                            <span class="icon-wrapper muted" v-if="task.like">
                                                           <a-icon type="like"/>
                                                                <span>{{task.like}}</span>
                                                       </span>
                                                        </div>
                                                    </div>
                                                    <footer class="task-info-footer"
                                                            v-if="project.prefix && project.open_prefix">
                                                        <span class="task-id-number">
                                                            {{project.prefix}}-{{task.id_num}}
                                                        </span>
                                                    </footer>
                                                </div>
                                            </div>
                                        </template>
                                    </draggable>
                                    <!--创建任务卡片-->
                                    <div class="task-creator-wrap card" :id="'card' + index"
                                         v-show="stage.showTaskCard">
                                        <form class="task-creator">
                                            <a-input :ref="`inputTaskName${index}`" v-model="task.name"
                                                     class="task-content-input" type="textarea"
                                                     :rows="3"
                                                     placeholder="任务内容" @keyup.enter="createTask(stage.code,index)"/>
                                            <div class="handler-wrap">
                                                <a-dropdown :trigger="['click']">
                                                    <a class="executor-handler"><img
                                                            :src="defaultExecutor.avatar"
                                                            class="avatar img-circle img-24 hinted"> <span
                                                            class="creator-handler-text name">{{ defaultExecutor.name }}</span></a>
                                                    <a-menu class="executor-handler-menu" @click="selectExecutor"
                                                            slot="overlay">
                                                        <a-menu-item
                                                                v-for="(member,index) in projectMembers"
                                                                :key="index">
                                                            <img class="avatar img-circle img-32 pull-left m-r-sm "
                                                                 :src="member.avatar">
                                                            <span class="muted"
                                                                  style="line-height: 25px;">{{ member.name }}</span>
                                                            <a-icon type="check" class="muted"
                                                                    v-if="member.code == defaultExecutor.code"></a-icon>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </a-dropdown>
                                            </div>
                                            <div class="submit-set">
                                                <a-button type="default" size="large" class="middle-btn"
                                                          @click.stop="showTaskCard(index,false)">取消
                                                </a-button>
                                                <a-button :loading="createTaskLoading" type="primary" size="large"
                                                          class="middle-btn"
                                                          @click.stop="createTask(stage.code,index)">创建
                                                </a-button>
                                            </div>
                                        </form>
                                    </div>
                                    <!--已完成列表-->
                                    <ul v-if="stage.tasks.length" class="scrum-stage-tasks-done">
                                        <template v-for="(task,taskIndex) in stage.tasks">
                                            <li class="task done task-card ui-sortable-handle"
                                                :key="task.code"
                                                v-if="task.done && task.canRead"
                                                @click.stop="taskDetail(task.code,index)"
                                            >
                                                <div class="task-priority bg-priority-0"></div>
                                                <a class="check-box"
                                                   @click.stop="taskDone(task.code,index,taskIndex,0)">
                                                    <a-icon type="check"/>
                                                </a>
                                                <div class="task-content-set open-detail">
                                                    <div class="task-content-wrapper">
                                                        <div class="task-content">{{ task.name }}</div>
                                                        <a-tooltip placement="top"
                                                                   v-if="task.executor && task.executor.avatar">
                                                            <template slot="title">
                                                                <span>{{task.executor.name}}</span>
                                                            </template>
                                                            <img v-if="task.executor && task.executor.avatar"
                                                                 :src="task.executor.avatar"
                                                                 :title="task.executor.name"
                                                                 class="avatar img-circle img-24 hinted">
                                                        </a-tooltip>
                                                    </div>
                                                    <div class="task-info-wrapper clearfix">
                                                        <div class="task-infos">
                                            <span class="tag muted" :class="'tag-color-'+ tag.color"
                                                  v-for="(tag,tag_index) in task.task_tag_item_list"> {{ tag.name }} </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </template>
                                        <li class="task muted" style="margin: 0 10px 8px;"
                                            v-show="stage.canNotReadCount">
                                            <span><a-icon type="lock"></a-icon>
                                                有 {{stage.canNotReadCount}} 个任务被隐藏（因为设置了仅参与者可见）</span>
                                        </li>
                                    </ul>
                                    <!--添加任务按钮-->
                                    <div class="task-creator-handler-wrap" @click.stop="showTaskCard(index)"
                                         v-if="!stage.showTaskCard">
                                        <a class="task-creator-handler link-add-handler">
                                            <a-icon type="plus-circle" style="padding-right: 6px;"></a-icon>
                                            添加任务
                                        </a>
                                    </div>
                                </a-spin>
                            </section>
                        </vue-scroll>
                    </div>
                    <!--</a-spin>-->
                </div>
                <div class="scrum-stage undraggable create-stage">
                    <header class="scrum-stage-header">
                        <div class="stage-name hinted" style="width: 100%">
                            <a class="muted" v-show="!showCreateStage" @click="showInputStrageName">
                                <span class="ivu-icon ivu-icon-plus"></span>
                                <span>新建任务列表...</span>
                            </a>
                            <div v-show="showCreateStage">
                                <div>
                                    <a-input ref="inputStageName" v-model="stageName" placeholder="新建任务列表..."
                                             @keyup.enter="creteStage"
                                             auto-focus></a-input>
                                </div>
                                <div class="submit-set create-stage-footer">
                                    <a type="text" class="cancel-text muted"
                                       @click="showCreateStage = !showCreateStage">
                                        取消
                                    </a>
                                    <a-button type="primary" class="middle-btn" @click="creteStage">保存</a-button>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </draggable>
            <router-view></router-view>
        </wrapper-content>
        <a-modal
                :width="360"
                v-model="stageModal.modalStatus"
                :title="stageModal.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
        >
            <a-form
                    @submit.prevent="editStage"
                    :form="stageModal.form"
            >
                <a-form-item
                >
                    <a-input ref="inputStageTitle" placeholder='列表标题'
                             v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入列表标题' }]}
                                            ]"/>
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn pull-right">
                        <a type="text" class="cancel-text muted"
                           @click="stageModal.modalStatus = false">
                            取消
                        </a>
                        <a-button type="primary" htmlType='submit' class="middle-btn">保存</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-drawer
                wrapClassName="info-drawer"
                title="项目成员"
                width=350
                placement="right"
                @close="inviteMemberDraw.visible = false"
                :visible="inviteMemberDraw.visible"
        >
            <div class="search-content">
                <a-input v-model="inviteMemberDraw.keyword" size="large" placeholder="输入昵称或邮箱查找">
                    <a-icon slot="prefix" type="search"/>
                </a-input>
            </div>
            <div class="member-list">
                <div class="member-list-item ant-list-item header-action">
                    <div class="ant-list-item-meta" @click="showInviteMember = true">
                        <div class="ant-list-item-meta-avatar">
                            <a-avatar icon="plus"></a-avatar>
                        </div>
                        <div class="ant-list-item-meta-content">
                            <h4 class="ant-list-item-meta-title"><span>邀请新成员</span></h4>
                        </div>
                    </div>
                </div>
                <a-list
                        itemLayout="horizontal"
                        :loading="inviteMemberDraw.searching"
                        :dataSource="projectMembers"
                        :locale="{emptyText: (inviteMemberDraw.keyword && inviteMemberDraw.keyword.length > 1) ? '没有搜索到相关成员' : ''}"
                >
                    <a-list-item class="member-list-item" slot="renderItem" slot-scope="item,index">
                   <span slot="actions" v-if="!item.is_owner">
                         <a class="muted" @click="removeMember(item,index)"><a-icon type="user-delete"/> 移除</a>
                       <!-- <a-button size="small" type="dashed" icon="user-add"
                                  v-if="!item.is_owner"
                        >操作</a-button>-->
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
        </a-drawer>
        <a-drawer
                wrapClassName="info-drawer"
                title="项目设置"
                width=350
                placement="right"
                @close="configDraw.visible = false"
                :visible="configDraw.visible"
        >
            <div class="config-wrapper">
                <ul class="config-menus">
                    <li class="menu-item">
                        <a @click="projectModal.modalStatus = true">
                            <a-icon type="setting"/>
                            项目设置
                        </a>
                    </li>
                    <li class="menu-item">
                        <a>
                            <a-icon type="tags"/>
                            标签 *
                        </a>
                    </li>
                    <li class="menu-item">
                        <a @click="recycleModal.modalStatus = true">
                            <a-icon type="delete"/>
                            查看回收站
                        </a>
                    </li>
                    <li class="menu-item">
                        <a>
                            <a-icon type="copy"/>
                            复制项目 *
                        </a>
                    </li>
                    <li class="menu-item">
                        <a>
                            <a-icon type="login"/>
                            导入任务 *
                        </a>
                    </li>
                    <li class="menu-item">
                        <a>
                            <a-icon type="logout"/>
                            导出任务 *
                        </a>
                    </li>
                    <li class="menu-item">
                        <a>
                            <a-icon type="block"/>
                            保存为项目模板 *
                        </a>
                    </li>
                </ul>

            </div>
        </a-drawer>
        <a-modal
                class="project-config-modal"
                :width="800"
                v-model="projectModal.modalStatus"
                :title="projectModal.modalTitle"
                :footer="null"
        >
            <project-config :code="code" @update="updateProject"></project-config>
        </a-modal>
        <a-modal
                class="recycle-bin-modal"
                :width="800"
                v-model="recycleModal.modalStatus"
                :title="recycleModal.modalTitle"
                :footer="null"
        >
            <recycle-bin v-if="recycleModal.modalStatus" :code="code" @update="init"></recycle-bin>
        </a-modal>
        <a-modal
                class="invite-project-member"
                :width="360"
                v-model="projectMemberModal.modalStatus"
                :title="projectMemberModal.modalTitle"
                :footer="null"
        >
            <div class="member-list">
                <a-list
                        class="project-list"
                        itemLayout="horizontal"
                        :loading="loading"
                        :dataSource="projectMembers"
                >
                    <a-list-item slot="renderItem" slot-scope="item">
                    <span slot="actions">
                        <a-button size="small" type="dashed" icon="user-add"
                                  @click="setExecutor(item)"
                        >设置</a-button>
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

        <invite-project-member v-model="showInviteMember" :project-code="code"
                               v-if="showInviteMember"></invite-project-member>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import _ from 'lodash'
    import moment from 'moment'
    import draggable from 'vuedraggable'
    import inviteProjectMember from '@/components/project/inviteProjectMember'
    import projectConfig from '@/components/project/projectConfig'
    import RecycleBin from '@/components/project/recycleBin'

    import {list as getTaskStages, sort, tasks as getTasks} from "../../../api/taskStages";
    import {read as getProject} from "../../../api/project";
    import {inviteMember, list as getProjectMembers, removeMember} from "../../../api/projectMember";
    import {save as createTask, taskDone, sort as sortTask, recycleBatch, batchAssignTask} from "../../../api/task";
    import {save as createState, edit as editStage, del as delStage} from "../../../api/taskStages";
    import {checkResponse} from "../../../assets/js/utils";
    import {formatTaskTime} from "../../../assets/js/dateTime";
    import {collect} from "../../../api/projectCollect";
    import {notice} from "../../../assets/js/notice";

    export default {
        name: "project-space-task",
        components: {
            RecycleBin,
            draggable,
            inviteProjectMember,
            projectConfig
        },
        data() {
            return {
                code: this.$route.params.code,
                loading: true,
                project: {},
                stageName: '',
                task: {}, //当前任务
                taskStages: [], //任务列表
                defaultExecutor: {},//默认执行人
                projectMembers: [], //项目成员列表
                projectMembersCopy: [], //项目成员列表副本
                createTaskLoading: false, //创建任务loading
                showCreateStage: false,

                preCode: '',
                nextCode: '',

                stageKeys: [],
                stageModal: {
                    form: this.$form.createForm(this),
                    stageCode: '',
                    stageIndex: 0,
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑列表',
                },

                slideMenuKey: '',
                showInviteMember: false,
                inviteMemberDraw: {
                    visible: false,
                    keyword: '',
                    searching: false,
                    list: [],
                },
                configDraw: {
                    visible: false,
                },

                /*项目设置*/
                projectModal: {
                    modalStatus: false,
                    modalTitle: '项目设置',
                },
                /*回收站*/
                recycleModal: {
                    modalStatus: false,
                    modalTitle: '查看回收站',
                },

                /*项目成员*/
                projectMemberModal: {
                    loading: false,
                    currentStageIndex: 0,
                    modalStatus: false,
                    modalTitle: '设置任务执行者',
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            }),
            scrollOps() {
                return {
                    rail: {
                        background: '#e5e5e5',
                        opacity: 1
                    },
                    bar: {
                        keepShow: true
                    }
                }
            }
        },
        watch: {
            $route(to, from) {
                if (from.name == 'taskdetail') {
                    const stageIndex = from.query.from;
                    if (stageIndex != undefined) {
                        getTasks({stageCode: this.taskStages[stageIndex].code}).then((res) => {
                            this.taskStages[stageIndex].tasksLoading = false;
                            this.taskStages[stageIndex].tasks = res.data
                        });
                    }
                }
            },
            inviteMemberDraw: {
                handler(newVal) {
                    if (newVal.visible) {
                        this.slideMenuKey = 'member';
                    } else {
                        this.slideMenuKey = false;
                    }
                    if (newVal.keyword) {
                        this.searchInviteMember();
                    }
                },
                deep: true
            },
            configDraw: {
                handler(newVal) {
                    if (newVal.visible) {
                        this.slideMenuKey = 'config';
                    } else {
                        this.slideMenuKey = false;
                    }
                },
                deep: true
            },
            showInviteMember(val) {
                if (!val) {
                    this.getProjectMembers();
                }
            },
        },
        created() {
            this.defaultExecutor = this.userInfo;
            this.getProject();
            this.getProjectMembers();
            this.init();
        },
        methods: {
            init() {
                this.getTaskStages();
            },
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                });
            },
            getProjectMembers() {
                getProjectMembers({projectCode: this.code, pageSize: 100}).then((res) => {
                    this.projectMembers = res.data.list;
                    this.projectMembersCopy = res.data.list;
                });
            },
            getTaskStages() {
                getTaskStages({projectCode: this.code, pageSize: 30}).then((res) => {
                    this.taskStages = res.data.list;
                    if (this.taskStages) {
                        this.taskStages.forEach((v) => {
                            getTasks({stageCode: v.code}).then((res) => {
                                let canNotReadCount = 0;
                                res.data.forEach((task) => {
                                    if (!task.canRead) {
                                        canNotReadCount++;
                                    }
                                });
                                v.canNotReadCount = canNotReadCount;
                                v.tasksLoading = false;
                                v.tasks = res.data;
                            })
                        })
                    }
                })
            },
            filterTask(tasks, done) {
                return tasks.filter(item => item.done == done);
            },
            //显示添加任务卡片
            showTaskCard(index = false, show = true) {
                this.taskStages.forEach((v) => {
                    v.showTaskCard = false;
                });
                if (index === false) {
                    return false;
                }
                this.taskStages[index].showTaskCard = show;
                this.$nextTick(() => {
                    //滚动创建到创建窗口
                    this.$refs[index + '-stage'][0].scrollIntoView('#card' + index);
                    this.$refs[`inputTaskName${index}`][0].focus();

                });
            },
            selectExecutor({key}) {
                this.defaultExecutor = this.projectMembers[key];
            },
            //准备添加任务
            createTask(stageCode, stageIndex) {
                if (this.task.name === '') {
                    this.$message.warning('任务内容不能为空', 2);
                    return false
                }
                this.task.stage_code = stageCode;
                this.task.project_code = this.code;
                this.task.assign_to = this.defaultExecutor.code;
                //判断换行，添加多条任务
                // let titles = this.task.name.split("\n");
                // if (titles.length > 1) {
                //     this.$confirm({
                //         title: '任务提示',
                //         content: `系统检测到你输入了 ${titles.length} 行内容，你是想创建多条任务吗？`,
                //         okText: '创建1条',
                //         cancelText: `创建${titles.length}条`,
                //         onCancel() {
                //             console.log('Cancel');
                //         },
                //         onOk() {
                //             this.confirmCreateTask(stageIndex);
                //             return Promise.resolve();
                //         }
                //     });
                //     return false;
                // }
                this.confirmCreateTask(stageIndex);
            },
            //添加任务
            confirmCreateTask(stageIndex) {
                let app = this;
                if (app.createTaskLoading) {
                    app.$message.warning('正在添加任务，请稍后...', 2);
                    return false;
                }
                setTimeout(function () {
                    if (app.createTaskLoading === true) {
                        app.$message.loading({
                            content: '正在添加任务，请稍后...',
                            duration: 5
                        })
                    }
                }, 2000);
                app.createTaskLoading = true;
                createTask(app.task).then(res => {
                    app.createTaskLoading = false;
                    const result = checkResponse(res);
                    if (result) {
                        app.$message.destroy();
                        getTasks({stageCode: app.task.stage_code}).then((res) => {
                            app.taskStages[stageIndex].tasks = res.data;
                        });
                        app.task = {};
                        // notice({
                        //     title: '添加任务成功',
                        //     msg: '你可以点击该任务继续进行详细设置'
                        // }, 'notice', 'success', 5);
                    }
                }).catch(() => {
                    app.createTaskLoading = false;
                });
            },
            taskDone(taskCode, stageIndex, taskIndex, done) {
                let task = this.taskStages[stageIndex].tasks[taskIndex];
                if (task.hasUnDone) {
                    return false;
                }
                taskDone(taskCode, done).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    task.done = done;
                });
            },
            showInputStrageName() {
                this.showCreateStage = !this.showCreateStage;
                this.$nextTick(() => {
                    this.$refs.inputStageName.focus();
                });
            },
            doStage(action) {
                let app = this;
                let actionKeys = action.key.split('_');
                const stageCode = actionKeys[actionKeys.length - 2];
                const stageIndex = actionKeys[actionKeys.length - 1];
                const actionKey = actionKeys[0];
                switch (actionKey) {
                    case 'editStage':
                        this.stageModal.stageCode = stageCode;
                        this.stageModal.stageIndex = stageIndex;
                        this.$nextTick(() => {
                            this.stageModal.form.setFieldsValue({
                                name: this.taskStages[stageIndex].name,
                            });
                            this.$refs.inputStageTitle.focus();
                        });
                        this.stageModal.modalStatus = true;
                        break;
                    case 'recycleBatch':
                        //您确定要把列表下的所有任务移到回收站吗？
                        this.$confirm({
                            title: '移到回收站',
                            content: `您确定要把列表下的所有任务移到回收站吗？`,
                            okText: '移到回收站',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                recycleBatch({stageCode: stageCode}).then(res => {
                                    const result = checkResponse(res);
                                    if (!result) {
                                        return false;
                                    }
                                    app.$set(app.taskStages[stageIndex], 'tasks', []);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case 'setEndTime':
                        this.set_type_endTime_modal = true;
                        break;
                    case 'setExecutor':
                        this.projectMemberModal.currentStageIndex = stageIndex;
                        this.projectMemberModal.modalStatus = true;
                        break;
                    case 'delStage':
                        if (this.taskStages[stageIndex].tasks.length > 0) {
                            this.$warning({
                                title: '删除列表',
                                content: `请先清空此列表上的任务，然后再删除这个列表`,
                                okText: '确定',
                            });
                            return false;
                        }
                        this.$confirm({
                            title: '删除列表',
                            content: `您确定要永远删除这个列表吗？`,
                            okText: '删除',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                delStage(stageCode);
                                app.taskStages.splice(stageIndex, 1);
                                return Promise.resolve();
                            }
                        });
                        break;
                }
            },
            creteStage() {
                if (!this.stageName) {
                    this.$message.warning('请输入列表名称', 2);
                    return false;
                }
                createState({name: this.stageName, projectCode: this.code}).then(res => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    const stage = res.data;
                    this.taskStages.push(stage);
                    this.stageName = '';
                    this.$nextTick(() => {
                        document.getElementById("board-scrum-stages").scrollLeft = 10000;
                    });
                });
            },
            editStage() {
                let stage = this.stageModal.form.getFieldsValue();
                if (!stage.name) {
                    this.$message.warning('请输入列表名称', 2);
                    return false;
                }
                editStage({name: stage.name, stageCode: this.stageModal.stageCode}).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.taskStages[this.stageModal.stageIndex].name = stage.name;
                    this.stageModal.modalStatus = false;
                });
            },
            setExecutor(member) {
                let stage = this.taskStages[this.projectMemberModal.currentStageIndex];
                let taskCodes = [];
                stage.tasks.forEach((v) => {
                    if (v.canRead) {
                        taskCodes.push(v.code);
                    }
                });
                if (taskCodes) {
                    batchAssignTask({taskCodes: JSON.stringify(taskCodes), executorCode: member.code}).then(res => {
                        this.projectMemberModal.modalStatus = false;
                        if (!checkResponse(res)) {
                            return false;
                        }
                        getTasks({stageCode: stage.code}).then((res) => {
                            let canNotReadCount = 0;
                            res.data.forEach((task) => {
                                if (!task.canRead) {
                                    canNotReadCount++;
                                }
                            });
                            stage.canNotReadCount = canNotReadCount;
                            stage.tasksLoading = false;
                            stage.tasks = res.data;
                        });
                    });
                }else{
                    this.projectMemberModal.modalStatus = false;
                }
            },
            showTaskPri(pri) {
                return {
                    'warning': pri == 1,
                    'error': pri == 2,
                }
            },
            showTimeLabel(time) {
                let str = 'label-primary';
                if (time == null) {
                    return str;
                }
                let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
                if (cha < 0) {
                    str = 'label-danger';
                } else if (cha == 0) {
                    str = 'label-warning';
                } else if (cha > 7) {
                    str = 'label-normal'
                }
                return str;
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
                // return moment(time).format('MM月DD日 HH:mm')
            },
            taskDetail(code, stageIndex) {
                this.$router.push(`${this.$route.path}/detail/${code}?from=${stageIndex}`);
            },
            stageMove(evt) {
                this.preCode = evt.draggedContext.element.code;
                this.nextCode = evt.relatedContext.element.code;

            },
            stageSort() {
                sort(this.preCode, this.nextCode, this.code);
            },
            taskSort(event) {
                const toStageCode = event.to.parentNode.parentNode.parentNode.getAttribute('id');
                let codes = '';
                for (let i = 0, len = event.to.children.length; i < len; i++) {
                    codes += ',' + event.to.children[i].getAttribute('id');
                }
                sortTask({stageCode: toStageCode, codes: codes.substr(1)});
            },
            handleResize(vertical, stageIndex) {
                if (vertical.barSize) {
                    this.taskStages[stageIndex].fixedCreator = true;
                }
            },

            visibleDraw(type) {
                if (type == 'member') {
                    this.configDraw.visible = false;
                    this.inviteMemberDraw.visible = !this.inviteMemberDraw.visible;

                } else {
                    this.inviteMemberDraw.visible = false;
                    this.configDraw.visible = !this.configDraw.visible;
                }
            },
            removeMember(member, index) {
                let app = this;
                this.$confirm({
                    title: `您确定要将「${member.name}」从项目中移除吗？`,
                    content: `移除后该成员将不能查看任何关于该项目的信息`,
                    okText: '移除',
                    okType: 'danger',
                    cancelText: '再想想',
                    onOk() {
                        removeMember(member.code, app.code).then((res) => {
                            if (!checkResponse(res)) {
                                return;
                            }
                            app.projectMembers.splice(index, 1);
                            notice({title: '移除成功'}, 'notice', 'success');
                        });
                        return Promise.resolve();
                    }
                });
            },
            inviteMember(item) {
                inviteMember(item.memberCode, this.projectCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                    }
                })
            },
            searchInviteMember: _.debounce(
                function () {
                    if (!this.inviteMemberDraw.keyword) {
                        this.projectMembers = JSON.parse(JSON.stringify(this.projectMembersCopy));
                    }
                    if (this.inviteMemberDraw.keyword.length <= 1) {
                        return false;
                    }
                    this.searching = true;
                    this.projectMembers = this.projectMembers.filter(item => item.name.indexOf(this.inviteMemberDraw.keyword) != -1);
                }, 500
            ),
            updateProject(data) {
                this.project = data;
            },
            collectProject() {
                const type = this.project.collected ? 'cancel' : 'collect';
                collect(this.project.code, type).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.project.collected = !this.project.collected;
                })
            },
        }
    }
</script>

<style lang="less">
    @import "../../../assets/css/components/task";

    .project-space-task {
        .tasks-loading {
            .ant-spin-blur {
                opacity: 0;
            }
        }
    }

    .info-drawer {
        top: 116px;
        width: 0 !important;

        .ant-drawer-mask {
            visibility: hidden;
        }

        .ant-drawer-content {
            background-color: #f7f7f7;
        }

        .ant-drawer-header {
            background-color: #f7f7f7;
            text-align: center;
        }

        .ant-drawer-body {
            padding: 12px 0;
        }

        .search-content {
            padding: 0 24px;
        }
    }

    .info-drawer {
        .member-list {
            padding-top: 12px;

            .ant-list-item-meta {
                align-items: center;
            }

            .member-list-item {
                padding: 12px 24px;

                &:hover {
                    background-color: #eee;
                    cursor: pointer;
                }
            }
        }
    }

    .info-drawer {
        .config-wrapper {
            position: relative;
            padding-bottom: 1px;

            .config-menus {
                padding: 0;
                list-style: none;

                .menu-item {
                    position: relative;
                    line-height: 30px;

                    &:hover {
                        background: #eeeeee;
                    }

                    &:first-child > a {
                        margin-top: -6px;
                    }

                    a {
                        display: block;
                        cursor: pointer;
                        padding: 5px 15px;
                        text-decoration: none;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #383838;
                        font-weight: 600;

                        .anticon {
                            width: 24px;
                            text-align: center;
                            font-size: 15px;
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
