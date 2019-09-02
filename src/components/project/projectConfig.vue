<template>
    <a-tabs tabPosition="left" defaultActiveKey="1" :animated="false" v-model="tabKey">
        <a-tab-pane key="1">
                    <span slot="tab">
                        <a-icon type="heat-map"/>
                        概览
                    </span>
            <div class="config-content">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目封面</p>
                        <div class="cover-item">
                            <template v-if="project.cover">
                                <img class="avatar" :src="project.cover"/>
                            </template>
                            <span class="no-avatar" v-show="!project.cover"></span>
                            <a-upload
                                    name="cover"
                                    class="cover-uploader"
                                    :showUploadList="false"
                                    :headers="headers"
                                    :action="uploadAction"
                                    :beforeUpload="beforeUpload"
                                    @change="handleChange"
                            >
                                <a-button size="large" class="upload">上传新封面</a-button>
                                <p class="upload-tips muted">最佳图片比例为300*150</p>
                            </a-upload>
                        </div>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目名称</p>
                        <a-input size="large" v-model="project.name"></a-input>
                    </div>
                    <div class="infos">
                        <p class="item-title">项目进度 (%)</p>
                        <a-input-number
                                size="large"
                                :min="0"
                                :max="100"
                                v-model="project.schedule"></a-input-number>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目简介</p>
                        <a-input type="textarea" :rows="3" size="large" placeholder="介绍一下这个项目"
                                 v-model="project.description"></a-input>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目公开性</p>
                        <a-select
                                size="large"
                                v-model="project.private"
                        >
                            <a-select-option :key="0">
                                公开项目（所有人都可通过链接访问，仅项目成员可编辑）
                            </a-select-option>
                            <a-select-option :key="1">
                                私有项目（仅项目成员可查看和编辑）
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目拥有者</p>
                        <div class="m-t">
                            <a-avatar :src="project.owner_avatar"></a-avatar>
                            <span class="m-l">{{project.owner_name}}</span>
                            <!--<a-button class="middle-btn pull-right" size="large">
                                移交
                            </a-button>-->
                        </div>
                    </div>
                </div>
                <a-divider/>
                <div class="content-item">
                    <div class="infos">
                        <a-button type="primary" class="middle-btn pull-right" size="large"
                                  @click="saveProject">
                            保存
                        </a-button>
                    </div>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="2" forceRender>
             <span slot="tab">
                 <a-icon type="eye"/>
                 项目偏好
             </span>
            <div class="config-content task-config">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">看板风格</p>
                        <div class="item-tips muted">切换任务看板的主题风格，内置两种风格。</div>
                        <a-radio-group @change="saveProject" v-model="project.task_board_theme">
                            <a-radio style="display: block;height: 30px;line-height: 30px" value="default">默认</a-radio>
                            <a-radio style="display: block;height: 30px;line-height: 30px" value="simple">简约</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">自动更新项目进度</p>
                        <div class="item-tips muted">根据当前任务的完成情况自动计算项目进度。</div>
                    </div>
                    <a-switch v-model="project.auto_update_schedule" @change="saveProject"/>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="3">
                    <span slot="tab">
                        <a-icon type="check-square"/>
                        任务设置
                    </span>
            <div class="config-content task-config">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目ID</p>
                        <div class="item-tips muted">设置项目编号，编号将作为 ID 前缀，用以区别项目。支持 2-6 位字母。</div>
                        <a-input class="prefix-input" size="large" placeholder="如 Pear Project 可以设置为 EP"
                                 v-model="project.prefix"
                                 :disabled="!project.open_prefix"></a-input>
                        <a-button size="large" class="middle-btn" type="primary"
                                  :disabled="!project.open_prefix" @click="saveProject">保存
                        </a-button>
                    </div>
                    <a-switch v-model="project.open_prefix" @change="saveProject"/>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">任务开始时间</p>
                        <div class="item-tips muted">为任务设置开始时间，更科学地规划工作。</div>
                    </div>
                    <a-switch v-model="project.open_begin_time" @change="saveProject"/>
                </div>
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">新任务默认开启隐私模式</p>
                        <div class="item-tips muted">对本项目内的新任务默认开启隐私模式，创建成功后仅参与者可见</div>
                    </div>
                    <a-switch v-model="project.open_task_private" @change="saveProject"/>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="4" forceRender>
             <span slot="tab">
                <a-icon type="deployment-unit"/>
                 任务流转
             </span>
            <div class="config-content">
                <div class="content-item task-workflow">
                    <div class="infos" style="padding-right: 0">
                        <div v-show="!doTaskWorkflowView">
                            <p>
                                <a-button type="primary" icon="plus" @click="doTaskWorkflow(null)">创建规则</a-button>
                            </p>
                            <a-list
                                    class="task-workflow-list"
                                    itemLayout="horizontal"
                                    :dataSource="taskWorkflowList"
                            >
                                <a-list-item slot="renderItem" slot-scope="item">
                                <span slot="actions">
                                     <a-tooltip placement="top"
                                                title="编辑">
                                        <a class="muted m-r-sm" @click="doTaskWorkflow(item)"><a-icon
                                                                                               type="edit"></a-icon></a>
                                    </a-tooltip>
                                     <a-tooltip placement="top"
                                                title="删除">
                                         <a class="muted" @click="delTaskWorkflow(item.code)">
                                             <a-icon type="delete"></a-icon>
                                         </a>
                                    </a-tooltip>
                                </span>
                                    <a-list-item-meta
                                    >
                                        <span slot="title">{{item.name}}</span>
                                    </a-list-item-meta>
                                </a-list-item>
                            </a-list>
                        </div>
                        <div v-show="doTaskWorkflowView">
                            <div class="header">
                                <p>
                                    <a-button size="large" class="middle-btn m-r-sm" @click="saveTaskWorkflow(false)">
                                        取消
                                    </a-button>
                                    <a-button size="large" class="middle-btn" type="primary"
                                              @click="saveTaskWorkflow(true)" :disabled="!canSaveTaskWorkflow">保存
                                    </a-button>
                                </p>
                            </div>
                            <div class="workflow-content">
                                <template v-if="!loadingWorkflowRule">
                                    <div class="workflow-rule-item">
                                        <p>
                                            规则名称
                                        </p>
                                        <a-input size="large" v-model="currentTaskWorkflowRule.taskWorkflowName"></a-input>
                                    </div>
                                    <div class="workflow-rule-item">
                                        <p>选择任务列表</p>
                                        <a-select size="large" v-model="currentTaskWorkflowRule.firstObj"
                                                  @change="(value)=>workflowRuleChange(value,'firstObj')">
                                            <a-select-option v-for="(taskStage, index) in taskStages"
                                                             :value="taskStage.code" :key="taskStage.code">
                                                {{taskStage.name}}
                                            </a-select-option>
                                        </a-select>
                                    </div>

                                    <template v-if="currentTaskWorkflowRule.firstObj">
                                        <div class="workflow-rule-item">
                                            <p>选择条件</p>
                                            <a-select size="large" v-model="currentTaskWorkflowRule.firstAction.action"
                                                      @change="(value)=>workflowRuleChange(value,'firstAction.action')">
                                                <a-select-option v-for="(rule, index) in taskWorkflowRuleActions"
                                                                 :value="rule.id" :key="rule.id">{{rule.name}}
                                                </a-select-option>
                                            </a-select>
                                        </div>

                                        <template v-if="currentTaskWorkflowRule.firstAction.action != -1">
                                            <template v-if="currentTaskWorkflowRule.firstAction.action == 3">
                                                <div class="workflow-rule-item">
                                                    <p>选择执行者</p>
                                                    <a-select size="large" v-model="currentTaskWorkflowRule.firstAction.value"
                                                              @change="(value)=>workflowRuleChange(value,'firstAction.value')">
                                                        <a-select-option v-for="(member, index) in projectMembers"
                                                                         :value="member.code" :key="member.code">
                                                            {{member.name}}
                                                        </a-select-option>
                                                    </a-select>
                                                </div>
                                            </template>

                                            <div class="workflow-rule-item">
                                                <p>选择结果</p>
                                                <a-select size="large" v-model="currentTaskWorkflowRule.firstResult.action"
                                                          @change="(value)=>workflowRuleChange(value,'firstResult.action')">
                                                    <a-select-option v-for="(type, index) in taskWorkflowRuleTypes"
                                                                     :value="type.id" :key="type.id">{{type.name}}
                                                    </a-select-option>
                                                </a-select>
                                            </div>

                                            <template v-if="currentTaskWorkflowRule.firstResult.action === 0">
                                                <div class="workflow-rule-item">
                                                    <p>流转任务列表</p>
                                                    <a-select size="large" v-model="currentTaskWorkflowRule.firstResult.value"
                                                              @change="(value)=>workflowRuleChange(value,'firstResult.value')">
                                                        <a-select-option v-for="(taskStage, index) in taskStages"
                                                                         :value="taskStage.code" :key="taskStage.code">
                                                            {{taskStage.name}}
                                                        </a-select-option>
                                                    </a-select>
                                                </div>
                                                <template v-if="currentTaskWorkflowRule.firstResult.value">
                                                    <div class="workflow-rule-item">
                                                        <p>选择执行者</p>
                                                        <a-select size="large" v-model="currentTaskWorkflowRule.lastResult.value"
                                                                  @change="(value)=>workflowRuleChange(value,'lastResult.value')">
                                                            <a-select-option v-for="(member, index) in projectMembers"
                                                                             :value="member.code" :key="member.code">
                                                                {{member.name}}
                                                            </a-select-option>
                                                        </a-select>
                                                    </div>
                                                </template>
                                                <template>
                                                    <div class="workflow-rule-item">
                                                        <p>修改任务状态</p>
                                                        <a-select size="large" v-model="currentTaskWorkflowRule.state.value"
                                                                  @change="(value)=>workflowRuleChange(value,'state.value')">
                                                            <a-select-option v-for="(state, index) in taskStates"
                                                                             :value="state.id" :key="state.id">
                                                                {{state.name}}
                                                            </a-select-option>
                                                        </a-select>
                                                    </div>
                                                </template>
                                            </template>
                                            <template v-if="currentTaskWorkflowRule.firstResult.action === 3">
                                                <div class="workflow-rule-item">
                                                    <p>选择执行者</p>
                                                    <a-select size="large" v-model="currentTaskWorkflowRule.firstResult.value"
                                                              @change="(value)=>workflowRuleChange(value,'firstAction.action')">
                                                        <a-select-option v-for="(member, index) in projectMembers"
                                                                         :value="member.code" :key="member.code">
                                                            {{member.name}}
                                                        </a-select-option>
                                                    </a-select>
                                                </div>

                                                <template v-if="currentTaskWorkflowRule.firstResult.value">
                                                    <div class="workflow-rule-item">
                                                        <p>流转任务列表</p>
                                                        <a-select size="large" v-model="currentTaskWorkflowRule.lastResult.value"
                                                                  @change="(value)=>workflowRuleChange(value,'lastResult.value')">
                                                            <a-select-option v-for="(taskStage, index) in taskStages"
                                                                             :value="taskStage.code" :key="taskStage.code">
                                                                {{taskStage.name}}
                                                            </a-select-option>
                                                        </a-select>
                                                    </div>
                                                </template>
                                                <template>
                                                    <div class="workflow-rule-item">
                                                        <p>修改任务状态</p>
                                                        <a-select size="large" v-model="currentTaskWorkflowRule.state.value"
                                                                  @change="(value)=>workflowRuleChange(value,'state.value')">
                                                            <a-select-option v-for="(state, index) in taskStates"
                                                                             :value="state.id" :key="state.id">
                                                                {{state.name}}
                                                            </a-select-option>
                                                        </a-select>
                                                    </div>
                                                </template>
                                            </template>
                                        </template>

                                    </template>
                                </template>
                                <div class="text-center">
                                    <a-spin :spinning="loadingWorkflowRule"></a-spin>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="5">
                    <span slot="tab">
                        <a-icon type="ellipsis"/>
                        更多
                    </span>
            <div class="config-content more-config">
                <div class="content-item">
                    <div class="infos">
                        <p class="item-title">项目操作</p>
                        <div class="item-tips muted">您可以执行以下操作</div>
                        <a-button size="large" class="middle-btn" @click="archiveProject">
                            <span v-if="project.archive">取消归档</span>
                            <span v-if="!project.archive">归档项目</span>
                        </a-button>
                        <a-button size="large" class="middle-btn" @click="quitProject">退出</a-button>
                        <a-button size="large" class="middle-btn" type="danger" @click="delProject">
                            <span v-if="project.deleted">恢复项目</span>
                            <span v-if="!project.deleted">移至回收站</span>
                        </a-button>
                    </div>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script>
    import {read as getProject, doData, archive, recycle, recoveryArchive, recovery, quit} from "../../api/project";
    import {
        _getTaskWorkflowRules,
        list as getTaskWorkflowList,
        save as saveTaskWorkflow,
        edit as EditTaskWorkflow,
        del as delTaskWorkflow
    } from "../../api/taskWorkflow";
    import {_getAll as getTaskStages} from "../../api/taskStages";
    import {list as getProjectMembers} from "../../api/projectMember";

    import {notice} from "../../assets/js/notice";
    import {checkResponse, getApiUrl, getAuthorization, getBase64} from "../../assets/js/utils";

    export default {
        name: "projectConfig",
        props: {
            code: {
                type: [String],
                default() {
                    return ''
                }
            },
        },
        data() {
            return {
                /*项目设置*/
                loading: false,
                tabKey: '1',
                project: {},
                taskWorkflowList: [],
                doTaskWorkflowView: false,
                loadingWorkflowRule: false,
                taskWorkflow: null,
                taskWorkflowRuleList: [],
                currentTaskWorkflowRule: {
                    taskWorkflowName: '',
                    firstObj: '',//哪个列表任务
                    firstAction: {//做什么
                        action: -1,
                        value: ''
                    },
                    firstResult: {//就
                        action: -1,
                        value: ''
                    },
                    lastResult: {//最后
                        action: -1,
                        value: ''
                    },
                    state: {//任务状态
                        action: -1,
                        value: -1
                    },
                },
                taskWorkflowRuleActions: [
                    {id: -1, name: "请选择"},
                    {id: 0, name: "增加任务、被移动"},
                    {id: 1, name: "被完成"},
                    {id: 2, name: "被重做"},
                    {id: 3, name: "设置执行人"},
                    // {id: 4, name: "截止时间"},
                    // {id: 5, name: "优先级"},
                ],
                taskWorkflowRuleTypes: [
                    {id: -1, name: "请选择"},
                    {id: 0, name: "自动流转到"},
                    {id: 3, name: "默认指派给"},
                ],
                taskStates: [
                    {id: -1, name: "不做修改"},
                    {id: 1, name: "已完成"},
                    {id: 2, name: "未完成"},
                ],
                projectMembers: [],
                taskStages: [],
                uploadLoading: false,
                uploadAction: getApiUrl('project/project/uploadCover'),
            }
        },
        computed: {
            headers() {
                return getAuthorization();
            },
            canSaveTaskWorkflow() {
                return this.currentTaskWorkflowRule.taskWorkflowName.trim() && this.currentTaskWorkflowRule.firstObj && this.currentTaskWorkflowRule.firstAction.action != -1 && this.currentTaskWorkflowRule.firstResult.action != -1 && this.currentTaskWorkflowRule.firstResult.value;
            }
        },
        watch: {
            code() {
                this.getProject();
            }
        },
        created() {
            this.getProject();
            this.getTaskWorkflowList();
        },
        methods: {
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                    this.project.open_prefix = !!res.data.open_prefix;
                    this.project.open_begin_time = !!res.data.open_begin_time;
                    this.project.open_task_private = !!res.data.open_task_private;
                });
            },
            getTaskWorkflowList() {
                getTaskWorkflowList({projectCode: this.code}).then(res => {
                    this.taskWorkflowList = res.data;
                });
            },
            saveProject() {
                const project = this.project;
                doData({
                    projectCode: project.code,
                    name: project.name,
                    description: project.description,
                    cover: project.cover,
                    private: project.private,
                    prefix: project.prefix,
                    task_board_theme: project.task_board_theme,
                    open_prefix: Number(project.open_prefix),
                    open_begin_time: Number(project.open_begin_time),
                    open_task_private: Number(project.open_task_private),
                    schedule: Number(project.schedule),
                    auto_update_schedule: Number(project.auto_update_schedule),
                }).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.$emit('update', this.project);
                    notice({
                        title: '保存成功',
                    }, 'notice', 'success');
                })
            },
            archiveProject() {
                let app = this;
                if (!app.project.archive) {
                    this.$confirm({
                        title: '归档项目',
                        content: `一旦将项目「${this.project.name}」归档，本项目和所含信息将会被移到「归档项目」内，其中的内容依然会被统计和搜索收录，归档项目可以随时恢复并继续使用。`,
                        okText: '归档',
                        okType: 'danger',
                        cancelText: `再想想`,
                        onOk() {
                            archive(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/archive');
                            });
                            return Promise.resolve();
                        }
                    });
                } else {
                    this.$confirm({
                        title: '取消归档项目？',
                        content: `取消归档「${this.project.name}」后就可以正常使用了`,
                        okText: '取消归档',
                        okType: 'primary',
                        cancelText: '再想想',
                        onOk() {
                            recoveryArchive(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/list/my');
                            });
                            return Promise.resolve();
                        }
                    });
                }
            },
            delProject() {
                let app = this;
                if (!app.project.deleted) {
                    this.$confirm({
                        title: '确定放入回收站？',
                        content: `一旦将项目「${this.project.name}」放入回收站，所有与项目有关的信息将会被放入回收站`,
                        okText: '放入回收站',
                        okType: 'danger',
                        cancelText: '再想想',
                        onOk() {
                            recycle(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/recycle');
                            });
                            return Promise.resolve();
                        }
                    });
                } else {
                    this.$confirm({
                        title: '确定恢复项目？',
                        content: `恢复「${this.project.name}」后就可以正常使用了`,
                        okText: '恢复项目',
                        okType: 'primary',
                        cancelText: '再想想',
                        onOk() {
                            recovery(app.code).then((res) => {
                                if (!checkResponse(res)) {
                                    return;
                                }
                                app.$router.replace('/project/list/my');
                            });
                            return Promise.resolve();
                        }
                    });
                }
            },
            quitProject() {
                let app = this;
                this.$confirm({
                    title: '退出项目',
                    content: `一旦你退出了该项目，你将不能查看任何关于该项目的信息。退出项目后，如果想重新加入，请联系项目管理员。`,
                    okText: '确定退出',
                    okType: 'primary',
                    cancelText: '再想想',
                    onOk() {
                        quit(app.code).then((res) => {
                            if (!checkResponse(res)) {
                                return;
                            }
                            app.$router.replace('/project/list/my');

                        });
                        return Promise.resolve();
                    }
                });
            },
            doTaskWorkflow(taskWorkflow = null) {
                this.getTaskStages();
                this.getProjectMembers();
                this.taskWorkflow = taskWorkflow;
                if (taskWorkflow) {
                    this.loadingWorkflowRule = true;
                    this.currentTaskWorkflowRule.taskWorkflowName = taskWorkflow.name;
                    this.getTaskWorkflowRules(taskWorkflow.code);
                }else{
                    this.currentTaskWorkflowRule = {
                        taskWorkflowName: '',
                        firstObj: '',//哪个列表任务
                        firstAction: {//做什么
                            action: -1,
                            value: ''
                        },
                        firstResult: {//就
                            action: -1,
                            value: ''
                        },
                        lastResult: {//最后
                            action: -1,
                            value: ''
                        },
                        state: {//任务状态
                            action: -1,
                            value: -1
                        },
                        taskStates: [
                            {id: -1, name: "不做修改"},
                            {id: 1, name: "已完成"},
                            {id: 2, name: "未完成"},
                        ],
                    };
                }
                this.doTaskWorkflowView = true;
            },
            saveTaskWorkflow(save = false) {
                if (this.currentTaskWorkflowRule.firstResult.action) {
                    this.currentTaskWorkflowRule.lastResult.action = 0;
                } else {
                    this.currentTaskWorkflowRule.lastResult.action = 3;
                }
                let submitData = {
                    taskWorkflowName: this.currentTaskWorkflowRule.taskWorkflowName,
                    taskWorkflowRules: JSON.stringify(this.currentTaskWorkflowRule)
                };
                if (save) {
                    // save
                    if (this.taskWorkflow) {
                        submitData.taskWorkflowCode = this.taskWorkflow.code;
                        EditTaskWorkflow(submitData).then(res => {
                            this.getTaskWorkflowList();

                        });
                    } else {
                        submitData.projectCode = this.code;
                        saveTaskWorkflow(submitData).then(res => {
                            this.getTaskWorkflowList();
                        });
                    }

                }
                this.doTaskWorkflowView = false;
            },
            getTaskStages() {
                getTaskStages({projectCode: this.code}).then(res => {
                    let list = [{
                        code: '',
                        name: '不选择'
                    }];
                    res.data.forEach(v => {
                        list.push(v);
                    });
                    this.taskStages = list;
                })
            },
            getTaskWorkflowRules(taskWorkflowCode) {
                _getTaskWorkflowRules({taskWorkflowCode: taskWorkflowCode}).then(res => {
                    this.loadingWorkflowRule = false;
                    const rules = res.data;
                    this.taskWorkflowRuleList = rules;
                    if (rules) {
                        this.currentTaskWorkflowRule.firstObj = rules[0].object_code;
                        this.currentTaskWorkflowRule.firstAction.action = rules[1].action;
                        this.currentTaskWorkflowRule.firstAction.value = rules[1].object_code;

                        this.currentTaskWorkflowRule.firstResult.action = rules[2].action;
                        this.currentTaskWorkflowRule.firstResult.value = rules[2].object_code;

                        if (rules.length >= 4) {
                            if (!rules[3].object_code) {
                                this.currentTaskWorkflowRule.state.action = rules[3].action;
                                this.currentTaskWorkflowRule.state.value = rules[3].action;
                            }else{
                                this.currentTaskWorkflowRule.lastResult.action = rules[3].action;
                                this.currentTaskWorkflowRule.lastResult.value = rules[3].object_code;
                            }
                            if (rules.length >= 5) {
                                if (!rules[4].object_code) {
                                    this.currentTaskWorkflowRule.state.action = rules[4].action;
                                    this.currentTaskWorkflowRule.state.value = rules[4].action;
                                }else{
                                    this.currentTaskWorkflowRule.lastResult.action = rules[4].action;
                                    this.currentTaskWorkflowRule.lastResult.value = rules[4].object_code;
                                }
                            }
                        }
                    }
                })
            },
            delTaskWorkflow(code) {
                let app = this;
                this.$confirm({
                    title: '删除规则?',
                    content: '您确定要删除该规则吗？',
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '再想想',
                    onOk() {
                        delTaskWorkflow({taskWorkflowCode: code}).then(res => {
                            if (checkResponse(res)) {
                                app.getTaskWorkflowList();
                            }
                        });
                        return Promise.resolve();
                    }
                });
            },
            getProjectMembers() {
                getProjectMembers({projectCode: this.code, pageSize: 100}).then((res) => {
                    let list = [{
                        code: '',
                        name: '不选择'
                    }];
                    res.data.list.forEach(v => {
                        list.push(v);
                    });
                    this.projectMembers = list;
                });
            },
            workflowRuleChange(value, name) {
                console.log(value);
                console.log(name);
                if (name == 'firstAction.action') {
                    this.currentTaskWorkflowRule.firstAction.value = '';
                }
                if (name == 'firstResult.value') {
                    this.currentTaskWorkflowRule.lastResult.value = '';
                }
                if (name == 'firstResult.action') {
                    this.currentTaskWorkflowRule.firstResult.value = '';
                    this.currentTaskWorkflowRule.lastResult.value = '';
                }
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, () => {
                        this.project.cover = info.file.response.data.url;
                        this.uploadLoading = false;
                        notice({
                            title: '封面上传成功',
                        }, 'notice', 'success');
                    })
                }
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片不能超过2MB!')
                }
                return isLt2M
            },
        }
    }
</script>

<style lang="less">
    .project-config-modal {
        .ant-modal-body {
            padding: 0;
        }

        .ant-modal-body, .ant-tabs, .ant-tabs-bar {
            min-height: 730px;
            min-width: 180px;

            .ant-tabs-tab {
                padding: 12px 24px;
            }
        }

        .ant-tabs-nav-wrap {
            padding-top: 10px;
        }

        .ant-tabs-left-content {
            padding-top: 18px;
            padding-right: 24px;
        }

        .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
            text-align: left;
        }

        .config-content {
            .content-item {
                display: flex;
                justify-content: space-between;
                flex: 1 1;
                margin-bottom: 24px;

                .infos {
                    width: 100%;
                    padding-right: 12px;

                    p {
                        margin-bottom: 6px;
                    }

                    .item-title {
                        font-size: 16px;
                    }

                    .item-tips {
                        margin-bottom: 12px;
                    }

                    .ant-select {
                        width: 100%;
                    }

                    .ant-input-number-lg {
                        width: 100%;
                    }

                    .cover-item {
                        display: flex;

                        img {
                            width: 300px;
                            height: 150px;
                        }

                        .cover-uploader {
                            display: block;
                            margin-left: 24px;

                            .upload-tips {
                                margin-top: 12px;
                            }
                        }
                    }
                }
            }

            &.task-config {
                .content-item {
                    padding-bottom: 24px;
                    padding-right: 16px;
                    border-bottom: 1px solid #e5e5e5;
                }

                .prefix-input {
                    width: 50%;
                    margin-right: 24px;
                }
            }

            .task-workflow {
                .workflow-content {
                    margin-top: 12px;

                    .workflow-rule-item {
                        margin-bottom: 16px;

                        p {
                            color: rgba(0, 0, 0, 0.45);
                        }
                    }
                }
            }

            &.more-config {
                .ant-btn {
                    margin-right: 12px;
                }
            }
        }
    }
</style>
