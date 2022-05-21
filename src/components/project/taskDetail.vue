<template>
    <div class="task-detail" id="task-detail">
        <a-spin class="task-detail-spin" :spinning="loading">
            <div class="task-header" :class="{'disabled': task.deleted}">
                    <span class="head-title" v-if="!task.deleted">
                        <span v-if="task.parentTask">
                            <span class="muted">属于任务：</span>
                            <!--<a class="text-default" @click="init(task.pcode)">{{task.parentTask.name}}</a>-->
                             <a-breadcrumb separator=">" class="breadcrumb text-default">
                                <a-breadcrumb-item v-for="parent in  task.parentTasks" :key="parent.code">
                                    <a class="text-default" @click="init(parent.code)">{{parent.name}}</a>
                                </a-breadcrumb-item>
                            </a-breadcrumb>
                        </span>
                        <span v-else>{{task.projectName}} · {{task.stageName}}</span>
                    </span>
                <span class="head-title muted" v-else>
                        <a-icon type="delete"/>&nbsp;
                        <span>任务已在回收站中，不可修改</span>
                    </span>
                <span class="header-action text-right">
                        <template v-if="!task.deleted">
                            <a-tooltip :mouseEnterDelay="0.5">
                            <template slot="title">
                                <span>复制任务链接</span>
                            </template>
                             <a class="action-item muted" v-clipboard="taskLink" @success="copyLink"><a-icon
                                     type="link"/></a>
                         </a-tooltip>
                             <a-tooltip :mouseEnterDelay="0.5">
                                <template slot="title">
                                    <span>点个赞</span>
                                </template>
                                <a class="action-item muted" :class="{'active': task.liked}" @click="like(!task.liked)">
                                    <a-icon type="like"/>
                                    <span v-show="task.like">{{task.like}}</span>
                                </a>
                             </a-tooltip>
                             <a-dropdown :trigger="['click']" placement="bottomCenter" v-model="visibleTaskMenu">
                              <a-tooltip :mouseEnterDelay="0.5">
                                 <template slot="title">
                                    <span>打开菜单</span>
                                 </template>
                                  <a class="action-item muted"><a-icon type="ellipsis"/></a>
                              </a-tooltip>
                                <a-menu @click="doTask" class="field-right-menu"
                                        slot="overlay">
                                    <a-menu-item key="copy">
                                           <a-icon type="copy"/>
                                            <span>复制任务 *</span>
                                    </a-menu-item>
                                    <a-menu-item key="move">
                                          <a-icon type="snippets"/>
                                            <span>移动任务 *</span>
                                    </a-menu-item>
                                    <a-menu-item key="star">
                                           <a-icon type="star"></a-icon>
                                            <span v-if="task.stared">取消收藏</span>
                                            <span v-else>收藏任务</span>
                                    </a-menu-item>
                                    <a-menu-item key="recycle">
                                           <a-icon type="delete"></a-icon>
                                            <span>移到回收站</span>
                                    </a-menu-item>
                                    <a-menu-item key="open">
                                           <a-icon type="book"/>
                                            <span>以新标签页打开</span>
                                    </a-menu-item>
                                     <a-menu-divider/>
                                    <a-menu-item key="private">
                                           <a-icon :type="task.private ? 'lock' : 'unlock'"/>
                                            <span>隐私模式</span>
                                            <a class="menu-action text-primary">
                                                <span v-if="task.private">已开启</span>
                                                <span v-else>已关闭</span>
                                            </a>
                                            <div class="menu-desc muted">
                                                <span v-if="task.private">仅参与者可见</span>
                                                <span v-else>所有成员可见</span>
                                            </div>
                                    </a-menu-item>
                                </a-menu>
                        </a-dropdown>
                        </template>
                        <template v-else>
                            <a class="action-item muted" @click="recoveryTask">
                                <a-icon type="undo"/> <span>恢复内容</span>
                            </a>
                            <a class="action-item muted" @click="deleteTask">
                                <a-icon type="delete"/> <span>彻底删除</span>
                            </a>
                        </template>
                         <a-tooltip :mouseEnterDelay="0.5">
                            <template slot="title">
                                <span>关闭面板</span>
                            </template>
                         <a class="action-item muted" @click="detailClose"><a-icon type="close"/></a>
                     </a-tooltip>
                    </span>
            </div>
            <div class="task-wrap">
                <div class="task-content">
                    <div class="content-left">
                        <vue-scroll :ops="scrollOps">
                            <div class="task-title" :class="{'disabled': task.deleted}">
                                <a-input ref="inputTitle" auto-focus @blur="doName" v-model="task.name" size="large"
                                         v-show="showEditName"/>
                                <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted">
                                    <template slot="title">
                                        <span>点击即可编辑</span>
                                    </template>
                                    <div class="title-text" @click="editTitle" v-show="!showEditName">
                                        {{task.name}}
                                    </div>
                                </a-tooltip>
                                <div v-else class="title-text" v-show="!showEditName">
                                    {{task.name}}
                                </div>
                            </div>
                            <div class="task-basic-attrs-view muted">
                                <div class="field-list" :class="{'disabled': task.deleted}">
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="check-square"/>
                                                <span class="field-name">完成状态</span>
                                            </div>
                                            <div class="field-right">
                                                <a-dropdown :trigger="['click']"
                                                            :disabled="!!task.deleted || !!task.hasUnDone"
                                                            :class="{'disabled': task.hasUnDone}">
                                                    <a-tooltip placement="top">
                                                        <template slot="title">
                                                            <span v-if="task.hasUnDone" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                                                        </template>
                                                        <span>
                                                        <!--<a-icon type="check-square"/>-->
                                                        <a-tag v-if="task.done" color="green">已完成</a-tag>
                                                        <span v-show="!task.done">未完成</span>
                                                    </span>
                                                    </a-tooltip>
                                                    <a-menu class="field-right-menu" slot="overlay"
                                                            :selectable="false"
                                                            @click="taskDone(task.code,!task.done)">
                                                        <a-menu-item key="done">
                                                            <div class="menu-item-content">
                                                                <a-tag color="green">已完成</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="task.done"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="undone">
                                                            <div class="menu-item-content">
                                                                <a-tag color="grey">未完成</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="!task.done"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="deployment-unit"/>
                                                <span class="field-name">执行状态</span>
                                            </div>
                                            <div class="field-right">
                                                <a-dropdown :trigger="['click']"
                                                            :disabled="!!task.deleted">
                                                    <span>{{task.statusText}}</span>
                                                    <a-menu class="field-right-menu" slot="overlay"
                                                            :selectable="false"
                                                            @click="taskStatusChange">
                                                        <a-menu-item :key="status.id" v-for="(status, index) in taskStatusList">
                                                            <div class="menu-item-content">
                                                                <span color="green">{{status.name}}</span>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="task.status == status.id"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="user"/>
                                                <span class="field-name">执行者</span>
                                            </div>
                                            <div class="field-right">
                                                <a-dropdown
                                                        :trigger="['click']"
                                                        v-model="visibleTaskMemberMenu"
                                                        :disabled="!!task.deleted"
                                                        placement="bottomCenter"
                                                >
                                                    <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted">
                                                        <template slot="title">
                                                            <span>点击设置执行者</span>
                                                        </template>
                                                        <div class="field-flex">
                                                            <template v-if="task.executor">
                                                                <a-avatar :src="task.executor.avatar" icon="user"
                                                                          size="small"/>
                                                                <a class="muted name">{{task.executor.name}}</a>
                                                            </template>
                                                            <template v-if="!task.executor">
                                                                <a-avatar icon="user" size="small"/>
                                                                <a class="muted name">待认领</a>
                                                            </template>
                                                        </div>
                                                    </a-tooltip>
                                                    <div class="field-flex" v-else>
                                                        <template v-if="task.executor">
                                                            <a-avatar :src="task.executor.avatar" icon="user"
                                                                      size="small"/>
                                                            <a class="muted name">{{task.executor.name}}</a>
                                                        </template>
                                                        <template v-if="!task.executor">
                                                            <a-avatar icon="user" size="small"/>
                                                            <a class="muted name">待认领</a>
                                                        </template>
                                                    </div>
                                                    <div slot="overlay">
                                                        <task-member-menu
                                                                v-if="visibleTaskMemberMenu"
                                                                :projectCode="projectCodeCurrent"
                                                                :taskCode="code"
                                                                @close="init(false)"
                                                                @inviteProjectMember="
                                                            showInviteMember = true,
                                                            visibleTaskMemberMenu = false"
                                                        ></task-member-menu>
                                                    </div>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="calendar"/>
                                                <span class="field-name">时间</span>
                                            </div>
                                            <div class="field-right field-date">
                                                <template v-if="task.openBeginTime">
                                                    <a-dropdown :trigger="['click']" v-model="showBeginTime"
                                                                :disabled="!!task.deleted">
                                                        <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted">
                                                            <template slot="title">
                                                                <span>点击设置开始时间</span>
                                                            </template>
                                                            <div class="field-flex">
                                                                <a class="muted name" style="margin: 0">
                                                                    <template v-if="!task.setBeginTime">设置开始时间
                                                                    </template>
                                                                    <template v-else>{{task.begin_time_format}}
                                                                    </template>
                                                                </a>
                                                            </div>
                                                        </a-tooltip>
                                                        <div class="field-flex" v-else>
                                                            <a class="muted name" style="margin: 0">
                                                                <template v-if="!task.setBeginTime">设置开始时间</template>
                                                                <template v-else>{{task.begin_time_format}}</template>
                                                            </a>
                                                        </div>
                                                        <div slot="overlay">
                                                            <a-date-picker
                                                                    v-model="task.begin_time"
                                                                    size="small"
                                                                    format="MM月DD日 HH:mm"
                                                                    showTime
                                                                    allowClear
                                                                    :showToday="false"
                                                                    :open="showBeginTime"
                                                                    @ok="doBeginTime(true)"
                                                            >
                                                                <template slot="renderExtraFooter">
                                                                    <a style="position: absolute;" size="small"
                                                                       @click="doBeginTime(false)">清除</a>
                                                                </template>
                                                            </a-date-picker>
                                                        </div>
                                                    </a-dropdown>
                                                    <span class="m-l-sm m-r-sm">-</span>
                                                </template>
                                                <a-dropdown :trigger="['click']" v-model="showEndTime"
                                                            :disabled="!!task.deleted">
                                                    <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted">
                                                        <template slot="title">
                                                            <span>点击设置截止时间</span>
                                                        </template>
                                                        <div class="field-flex">
                                                            <a class="muted name" style="margin: 0">
                                                                <template v-if="!task.setEndTime">设置截止时间</template>
                                                                <template v-else>{{task.end_time_format}}</template>
                                                            </a>
                                                        </div>
                                                    </a-tooltip>
                                                    <div class="field-flex" v-else>
                                                        <a class="muted name" style="margin: 0">
                                                            <template v-if="!task.setEndTime">设置截止时间</template>
                                                            <template v-else>{{task.end_time_format}}</template>
                                                        </a>
                                                    </div>
                                                    <div slot="overlay">
                                                        <a-date-picker
                                                                v-model="task.end_time"
                                                                size="small"
                                                                format="MM月DD日 HH:mm"
                                                                showTime
                                                                allowClear
                                                                :showToday="false"
                                                                :open="showEndTime"
                                                                @ok="doEndTime(true)"
                                                        >
                                                            <template slot="renderExtraFooter">
                                                                <a style="position: absolute;" size="small"
                                                                   @click="doEndTime(false)">清除</a>
                                                            </template>
                                                        </a-date-picker>
                                                    </div>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount pink-bg">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="file-text"/>
                                                <span class="field-name">备注</span>
                                            </div>
                                            <div class="field-right width-block">
                                                <div class="task-description" :class="{'disabled': task.deleted}"
                                                     v-show="!showTaskDescriptionEdit"
                                                     @click="showTaskDesc">
                                                    <div class="description-txt img-preview-content" v-show="task.description"
                                                         v-html="task.description"></div>
                                                    <span v-show="!task.description">添加备注</span>
                                                </div>
                                                <div class="m-t-sm" v-if="hasMoreDesc">
                                                    <a v-show="!showMoreDesc"
                                                       @click="checkShowMoreDesc(true)">显示更多</a>
                                                    <a v-show="showMoreDesc"
                                                       @click="checkShowMoreDesc(false)">收起备注</a>
                                                </div>
                                                <div v-show="showTaskDescriptionEdit">
                                                    <editor ref="vueWangeditor"
                                                            id="editor"
                                                            :uploadImgServer="editorConfig.uploadImgServer"
                                                            :uploadImgHeaders="editorConfig.uploadImgHeaders"
                                                            :menus="editorConfig.menus"
                                                    ></editor>
                                                    <div class="action-btn pull-right">
                                                        <a type="text" class="cancel-text muted"
                                                           @click="showTaskDescriptionEdit = false,initContent(false)">
                                                            取消
                                                        </a>
                                                        <a-button type="primary" htmlType='submit'
                                                                  class="middle-btn"
                                                                  @click="doContent">保存
                                                        </a-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="bulb"/>
                                                <span class="field-name">优先级</span>
                                            </div>
                                            <div class="field-right">
                                                <a-dropdown :trigger="['click']" :disabled="!!task.deleted">
                                                <span>
                                                    <a-tag :color="priColor(task.pri)">{{task.priText}}</a-tag>
                                                </span>
                                                    <a-menu class="field-right-menu" slot="overlay" @click="doPri"
                                                            :selectable="false">
                                                        <a-menu-item :key="0">
                                                            <div class="menu-item-content">
                                                                <a-tag :color="priColor(0)">普通</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="task.pri == 0"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item :key="1">
                                                            <div class="menu-item-content">
                                                                <a-tag :color="priColor(1)">紧急</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="task.pri == 1"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item :key="2">
                                                            <div class="menu-item-content">
                                                                <a-tag :color="priColor(2)">非常紧急</a-tag>
                                                                <a-icon type="check" class="check muted"
                                                                        v-show="task.pri == 2"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount task-tag">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="tag"/>
                                                <span class="field-name">标签</span>
                                            </div>
                                            <div class="field-right">
                                                <div class="inline-block">
                                                    <a-tag :color="tag.tag.color" v-for="(tag,index) in task.tags"
                                                           :key="index">
                                                        {{tag.tag.name}}
                                                        <a-icon type="close" @click="removeTag(tag.tag,index)"/>
                                                    </a-tag>
                                                </div>
                                                <a-dropdown
                                                        :trigger="['click']"
                                                        v-model="visibleTaskTagMenu"
                                                        :disabled="!!task.deleted"
                                                        placement="bottomCenter"
                                                >
                                                    <a-tooltip :mouseEnterDelay="0.5" v-if="!task.deleted">
                                                        <template slot="title">
                                                            <span>添加标签</span>
                                                        </template>
                                                        <div class="inline-block">
                                                            <a-icon class="member-item invite" type="plus-circle"
                                                                    theme="twoTone"/>
                                                        </div>
                                                    </a-tooltip>
                                                    <div class="inline-block">
                                                        <a-icon class="member-item invite" type="plus-circle"
                                                                theme="twoTone"/>
                                                    </div>
                                                    <div slot="overlay">
                                                        <task-tag-menu
                                                                v-if="visibleTaskTagMenu"
                                                                :projectCode="projectCodeCurrent"
                                                                :taskCode="code"
                                                                @change="taskTagChange"
                                                                @update="taskTagUpdate"
                                                                @delete="taskTagDelete"
                                                        ></task-tag-menu>
                                                    </div>
                                                </a-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="bars"/>
                                                <span class="field-name">子任务 <span v-show="childTaskList.length"> · {{childTaskDoneNum}}/{{childTaskList.length}}</span></span>
                                            </div>
                                            <div class="field-right width-block">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="block-field width-block">
                                                <div class="task-child">
                                                    <div class="task-list" v-show="childTaskList.length">
                                                        <div v-for="done in [0,1]" :key="done">
                                                            <div
                                                                    v-for="(childTask, index) in childTaskList"
                                                                    :key="childTask.code">
                                                                <div class="list-item task"
                                                                     v-if="childTask.done == done"
                                                                >
                                                                    <a-tooltip placement="top">
                                                                        <template slot="title">
                                                                            <span v-if="childTask.parentDone"
                                                                                  style="font-size: 12px;">父任务已完成，无法重做子任务</span>
                                                                            <span v-else-if="childTask.hasUnDone"
                                                                                  style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                                                                        </template>
                                                                        <div class="check-box-wrapper task-item"
                                                                             @click.stop="()=>{if(task.deleted || childTask.parentDone || childTask.hasUnDone) return false;taskDone(childTask.code,!childTask.done,index,'child')}">
                                                                            <a-icon class="check-box"
                                                                                    :class="{'disabled': task.deleted || childTask.parentDone || childTask.hasUnDone}"
                                                                                    :type="childTask.done ? 'check-square' : 'border'"
                                                                                    :style="{fontSize:'16px'}"/>
                                                                        </div>
                                                                        <!--<a class="task-item check-box"
                                                                           :class="{'disabled': task.deleted || childTask.parentDone || childTask.hasUnDone}"
                                                                           @click="()=>{if(task.deleted || childTask.parentDone || childTask.hasUnDone) return false;taskDone(childTask.code,!childTask.done,index,'child')}">
                                                                            <a-icon type="check"
                                                                                    v-show="childTask.done"/>
                                                                        </a>-->
                                                                    </a-tooltip>
                                                                    <a-dropdown :trigger="['click']"
                                                                                v-model="childTask.visibleChildTaskMemberMenu"
                                                                                :disabled="!!task.deleted"
                                                                                placement="bottomCenter"

                                                                    >
                                                                        <a-tooltip :mouseEnterDelay="0.5">
                                                                            <template slot="title">
                                                                                <span v-if="childTask.executor">{{childTask.executor.name}}</span>
                                                                                <span v-else>待认领</span>
                                                                            </template>
                                                                            <a-avatar
                                                                                    v-if="childTask.executor"
                                                                                    class="task-item"
                                                                                    :class="{'disabled': task.deleted}"

                                                                                    size="small"
                                                                                    icon="user"
                                                                                    :src="childTask.executor.avatar"
                                                                            ></a-avatar>
                                                                            <a-avatar
                                                                                    v-else
                                                                                    class="task-item"
                                                                                    :class="{'disabled': task.deleted}"

                                                                                    size="small"
                                                                                    icon="user"
                                                                            ></a-avatar>
                                                                        </a-tooltip>
                                                                        <div slot="overlay">
                                                                            <task-member-menu
                                                                                    v-if="childTask.visibleChildTaskMemberMenu"
                                                                                    :projectCode="projectCodeCurrent"
                                                                                    :taskCode="childTask.code"
                                                                                    :isCommit="true"
                                                                                    @close="childTask.visibleChildTaskMemberMenu = false;getChildTasks();"
                                                                                    @inviteProjectMember="
                                                                                    showInviteMember = true,
                                                                                    childTask.visibleChildTaskMemberMenu = false"
                                                                            ></task-member-menu>
                                                                        </div>
                                                                    </a-dropdown>
                                                                 <!--   <a-tooltip :mouseEnterDelay="0.5">
                                                                        <template slot="title">
                                                                            <span v-if="childTask.executor">{{childTask.executor.name}}</span>
                                                                            <span v-else>待认领</span>
                                                                        </template>
                                                                        <a-avatar
                                                                                v-if="childTask.executor"
                                                                                class="task-item"
                                                                                :class="{'disabled': task.deleted}"

                                                                                size="small"
                                                                                icon="user"
                                                                                :src="childTask.executor.avatar"
                                                                        ></a-avatar>
                                                                        <a-avatar
                                                                                v-else
                                                                                class="task-item"
                                                                                :class="{'disabled': task.deleted}"

                                                                                size="small"
                                                                                icon="user"
                                                                        ></a-avatar>
                                                                    </a-tooltip>-->
                                                                    <div class="task-item task-title"
                                                                         @click.stop="init(childTask.code)">
                                                                        <div class="title-text"
                                                                             :class="{'done': childTask.done}"
                                                                        >
                                                                            {{childTask.name}}
                                                                        </div>
                                                                    </div>
                                                                    <a class="muted" @click.stop="init(childTask.code)">
                                                                        <a-icon class="task-item" type="right"/>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="task-list" v-show="showChildTask">
                                                        <div class="add-task">
                                                            <div class="list-item task">
                                                                <span class="task-item check-box"></span>

                                                                <a-dropdown :trigger="['click']"
                                                                            v-model="visibleChildTaskMemberMenu"
                                                                            :disabled="!!task.deleted"
                                                                            placement="bottomCenter"

                                                                >
                                                                    <a-tooltip :mouseEnterDelay="0.5">
                                                                        <template slot="title">
                                                                            <span v-if="childExecutor">{{childExecutor.name}}</span>
                                                                            <span v-else>待认领</span>
                                                                        </template>
                                                                        <div class="field-flex">
                                                                            <template v-if="childExecutor">
                                                                                <a-avatar class="task-item"
                                                                                          :src="childExecutor.avatar"
                                                                                          icon="user"
                                                                                          size="small"/>
                                                                            </template>
                                                                            <template v-if="!childExecutor">
                                                                                <a-avatar class="task-item"

                                                                                          icon="user"
                                                                                          size="small"/>
                                                                            </template>
                                                                        </div>
                                                                    </a-tooltip>
                                                                    <div slot="overlay">
                                                                        <task-member-menu
                                                                                v-if="visibleChildTaskMemberMenu"
                                                                                :projectCode="projectCodeCurrent"
                                                                                :taskCode="childExecutor ? code : ''"
                                                                                :isCommit="false"
                                                                                @close="updateChildExecutor"
                                                                                @inviteProjectMember="
                                                            showInviteChildTaskMember = true,
                                                            visibleChildTaskMemberMenu = false"
                                                                        ></task-member-menu>
                                                                    </div>
                                                                </a-dropdown>
                                                                <div class="task-item task-input">
                                                                    <a-input v-model="childTaskName"
                                                                             @pressEnter="createTask"/>
                                                                </div>
                                                            </div>
                                                            <div class="action-btn text-right">
                                                                <a type="text" class="cancel-text muted"
                                                                   @click="showChildTask = false">取消</a>
                                                                <a-button type="primary" htmlType='submit'
                                                                          class="middle-btn"
                                                                          @click="createTask">保存
                                                                </a-button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a-tooltip placement="top">
                                                        <template slot="title">
                                                            <span v-if="task.done" style="font-size: 12px;">父任务已完成，无法添加新的子任务</span>
                                                        </template>
                                                        <a class="add-handler"
                                                           :class="{'disabled': task.done}"
                                                           v-show="!showChildTask"
                                                           @click="()=>{if (task.deleted || task.done) return false; showChildTask = true}">
                                                            <a-icon type="plus" style="margin-right: 6px;"/>
                                                            添加子任务
                                                        </a>
                                                    </a-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left" style="width: 100%">
                                                <a-icon type="clock-circle"/>
                                                <span class="field-name">工时
                                                    <span v-if="workTimeList.length"> · 实际工时 {{workTimeTotal}} 小时，工时记录 {{workTimeList.length}} 条，预估工时 {{task.work_time}} 小时   <a
                                                            class="muted m-l-sm" @click="doPlainWorkTime">
                                                                    <a-icon class="task-item" type="edit"/>
                                                                </a>
                                                    </span>
                                                    <span v-else>
                                                         <span v-if="task.work_time"> · 预估工时 {{task.work_time}} 小时</span>
                                                         <a-tooltip>
                                                            <template slot="title">
                                                                <span>设置预估工时</span>
                                                            </template>
                                                           <a class="muted m-l-sm" @click="doPlainWorkTime">
                                                               <a-icon class="task-item" type="edit"/>
                                                           </a>
                                                         </a-tooltip>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="block-field width-block">
                                                <div class="task-child">
                                                    <div class="task-list" v-show="workTimeList.length">
                                                        <div
                                                                v-for="(workTime, index) in workTimeList"
                                                                :key="workTime.code">
                                                            <div class="list-item task m-l-xs">
                                                                <div class="task-item task-title hover-none">
                                                                    <div class="title-text"
                                                                    >
                                                                        <a-tooltip :mouseEnterDelay="0.5">
                                                                            <template slot="title">
                                                                                <span v-if="workTime.member">{{workTime.member.name}}</span>
                                                                                <span v-else>待认领</span>
                                                                            </template>
                                                                            <a-avatar
                                                                                    class="task-item"
                                                                                    size="small"
                                                                                    icon="user"
                                                                                    :src="workTime.member.avatar"
                                                                            ></a-avatar>
                                                                        </a-tooltip>
                                                                        {{workTime.member.name}}
                                                                        {{moment(workTime.begin_time).format('MM月DD日 HH:mm')}}开始 工时为
                                                                        {{workTime.num}} 小时
                                                                        <div class="muted"
                                                                             v-show="workTime.content"
                                                                             style="padding-left: 40px;margin-top: 6px;">
                                                                            {{workTime.content}}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <a class="muted" @click="doWorkTime(workTime)">
                                                                    <a-icon class="task-item" type="edit"/>
                                                                </a>
                                                                <a class="muted"
                                                                   @click="deleteWorkTime(workTime, index)">
                                                                    <a-icon class="task-item" type="delete"/>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a-tooltip placement="top">
                                                        <a class="add-handler" @click="doWorkTime(false)">
                                                            <a-icon type="plus" style="margin-right: 6px;"/>
                                                            添加工时
                                                        </a>
                                                    </a-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="paper-clip"/>
                                                <span class="field-name">关联文件</span>
                                            </div>
                                            <div class="field-right width-block">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="block-field width-block">
                                                <div class="task-child">
                                                    <a class="add-handler" id="upload-file">
                                                        <a-icon type="plus" style="margin-right: 6px;"/>
                                                        上传文件
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="component-mount" v-show="taskSourceList.length > 0">
                                        <div class="field">
                                            <div class="block-field width-block">
                                                <div class="file-list">
                                                    <div class="m-xs m-t-none">关联的文件</div>
                                                    <a-list>
                                                        <a-list-item :key="index"
                                                                     v-for="(item, index) in taskSourceList">
                                                            <a-list-item-meta>
                                                                <a-avatar size="small" slot="avatar" shape="square"
                                                                          icon="link"
                                                                          :src="item.sourceDetail.file_url"/>
                                                                <div slot="title">
                                                                    <a class="muted" target="_blank"
                                                                       :href="item.sourceDetail.file_url">{{ item.title
                                                                        }}</a>
                                                                </div>
                                                                <div slot="description">
                                                                    <!--{{item.create_time}}-->
                                                                </div>
                                                            </a-list-item-meta>
                                                            <a class="muted" slot="actions">
                                                                <span>{{item.sourceDetail.projectName}}</span>
                                                            </a>
                                                            <a class="muted" slot="actions">
                                                                <a-dropdown :trigger="['click']"
                                                                            placement="bottomCenter">
                                                                    <!-- <a-tooltip :mouseEnterDelay="0.5">
                                                                         <template slot="title">
                                                                             <span>更多操作</span>
                                                                         </template>-->
                                                                    <a class="action-item muted">
                                                                        <a-icon type="down"/>
                                                                    </a>
                                                                    <!--</a-tooltip>-->
                                                                    <a-menu v-clipboard="item.sourceDetail.file_url"
                                                                            @click="doSource($event,item)"
                                                                            class="field-right-menu"
                                                                            slot="overlay">
                                                                        <a-menu-item key="copy">
                                                                            <a-icon type="link"/>
                                                                            <span>复制链接</span>
                                                                        </a-menu-item>
                                                                        <a-menu-item key="unlink">
                                                                            <a-icon type="disconnect"/>
                                                                            <span>取消关联</span>
                                                                        </a-menu-item>
                                                                    </a-menu>
                                                                </a-dropdown>
                                                            </a>
                                                        </a-list-item>
                                                    </a-list>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </vue-scroll>
                    </div>
                    <div class="content-right">
                        <div class="header">
                            <div class="title">
                                参与者 · {{taskMemberList.length}}
                            </div>
                            <div class="member-list">
                                <a-tooltip
                                        :mouseEnterDelay="0.5"
                                        v-for="member in taskMemberList"
                                        :key="member.code"
                                >
                                    <template slot="title">
                                        <span>{{member.name}} <span v-if="member.is_owner"> · 创建者</span></span>
                                    </template>
                                    <a-avatar
                                            class="member-item"
                                            icon="user"
                                            size="small"
                                            :src="member.avatar"
                                            @click="routerLink('/members/profile/' + member.membar_account_code + '?key=3')"
                                    />
                                </a-tooltip>
                                <a-dropdown :trigger="['click']" placement="bottomCenter"
                                            v-model="visibleProjectMemberMenu">
                                    <a-tooltip :mouseEnterDelay="0.5">
                                        <template slot="title">
                                            <span>点击添加参与者</span>
                                        </template>
                                        <a-icon class="member-item invite" type="plus-circle" theme="twoTone"
                                                style="font-size: 24px;"/>
                                    </a-tooltip>
                                    <div slot="overlay">
                                        <project-member-menu
                                                v-if="visibleProjectMemberMenu"
                                                :taskCode="code"
                                                :projectCode="projectCodeCurrent"
                                                @close="init(false)"
                                                @inviteProjectMember="
                                                            showInviteMember = true,
                                                            visibleProjectMemberMenu = false"
                                        ></project-member-menu>
                                    </div>
                                </a-dropdown>
                            </div>
                        </div>
                        <div class="log-wrap">
                            <div class="header">
                                <a-dropdown :trigger="['click']">
                                    <a class="text-default">
                                        所有动态
                                        <a-icon type="down"/>
                                    </a>
                                    <a-menu v-model="taskLogType" class="field-right-menu" slot="overlay"
                                            selectable>
                                        <a-menu-item key="all">
                                            <div class="menu-item-content">
                                                <span>所有动态</span>
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item key="comment">
                                            <div class="menu-item-content">
                                                <span>仅评论</span>
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item key="log">
                                            <div class="menu-item-content">
                                                <span>仅动态</span>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </div>
                            <vue-scroll>
                                <div class="log-list muted">
                                    <a class="show-more muted" v-show="checkShowMoreLog"
                                       @click="getMoreTaskLog">
                                        <a-icon type="ellipsis"/>
                                        显示较早的 {{taskLogTotal - taskLogList.length}} 条动态
                                    </a>
                                    <div :class="{'log-comment': log.is_comment,'list-item': !log.is_comment}"
                                         v-for="log in taskLogList" :key="log.code">
                                        <template v-if="!log.is_comment">
                                            <a-icon class="log-item" :type="log.icon"/>
                                            <div class="log-item log-txt">
                                                <div>{{log.member.name}} <span v-html="log.remark"></span></div>
                                                <div v-if="log.content" class="log-content img-preview-content"
                                                     v-html="log.content"></div>
                                            </div>
                                        </template>
                                        <template v-if="log.is_comment">
                                            <div class="log-txt text-default" style="width:100%; display: flex;justify-content: space-between">
                                               <div style="display: flex;align-items: center">
                                                   <a-avatar :size="24" :src="log.member.avatar" class="m-r-sm" style="margin-left: -5px"/>
                                                   <div>{{log.member.name}}</div>
                                               </div>
                                                <a-tooltip :mouseEnterDelay="0.5">
                                                    <template slot="title">
                                                        <span>{{log.create_time}}</span>
                                                    </template>
                                                    <span class="muted">{{log.create_time | formatLogTime}}</span>
                                                </a-tooltip>
                                            </div>
                                            <div class="log-txt text-default" style="padding: 0 0 0 30px;">
                                                <div class="m-t-xs" v-html="checkLink(log.content)" ></div>
                                            </div>
                                        </template>
                                        <a-tooltip v-if="!log.is_comment" :mouseEnterDelay="0.5">
                                            <template slot="title">
                                                <span>{{log.create_time}}</span>
                                            </template>
                                            <span>{{log.create_time | formatLogTime}}</span>
                                        </a-tooltip>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                        <div class="footer" id="footer">
                            <a-popover trigger="click" placement="top" :visible="showMentions" arrowPointAtCenter :getPopupContainer="getPopup">
                                <template slot="content">
                                    <div class="mentions-content" style="width: 200px;">
                                        <div class="mentions-wrapper" v-for="member in taskMemberList" :key="member.id" @click="selectMentionMember(member)">
                                            <a-avatar :src="member.avatar" icon="user" :size="28"/>
                                            <span class="muted name m-l-xs">{{member.name}}</span>
                                        </div>
                                    </div>
                                </template>
<!--                                <span slot="title">Title</span>-->
                                <a-textarea @focus="commenting = true" @blur="commenting = false" ref="commentText" v-model="comment" :rows="1" placeholder="@提及任务成员，Ctrl+Enter发表评论"
                                            style="margin-right: 24px;"/>
                            </a-popover>
                            <a-button class="middle-btn" type="primary" @click="createComment">评论</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
        <invite-project-member v-model="showInviteMember" :project-code="projectCodeCurrent"
                               v-if="showInviteMember"></invite-project-member>
        <a-modal
                class="work-time-modal"
                v-model="workTimeDo.modalStatus"
                :title="workTimeDo.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                @ok="workTimeHandleSubmit"
                :confirmLoading="workTimeDo.confirmLoading"
        >
            <a-form
                    layout="vertical"
                    @submit.prevent="workTimeHandleSubmit"
                    :form="workTimeDo.form">
                <div>
                    <div style="font-size: 15px;">登记任务</div>
                    <div>{{task.name}}</div>
                    <a-divider class="m-t-xs m-b-md"></a-divider>
                </div>
                <div class="work-time-stats">
                    <div class="work-time-item">
                        <div class="muted title">预估工时</div>
                        <span class="work-time-num">{{task.work_time}}</span>
                        <span>小时</span>
                    </div>
                    <div class="work-time-item">
                        <div class="muted title">剩余工时</div>
                        <span class="work-time-num">
                            <template v-if="task.work_time - workTimeTotal < 0">0</template>
                            <template v-else>{{task.work_time - workTimeTotal}}</template>
                        </span>
                        <span>小时</span>
                    </div>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label="开始时间"
                        >
                            <a-date-picker
                                    showTime
                                    format="YYYY年MM月DD日 HH:mm"
                                    allowClear
                                    placeholder="请选择日期"
                                    v-decorator="[
                                'begin_time',
                                {rules: [{ required: true, message: '请选择日期' }], validateTrigger: 'change',initialValue: moment()}
                            ]"
                            >
                            </a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label="消耗时间"
                        >
                            <a-input
                                    type="text"
                                    placeholder="请输入数字"
                                    addonAfter="小时"
                                    v-decorator="[
                                'num',
                                {rules: [{ required: true, message: '请输入消耗时间' }], validateTrigger: 'change'}
                            ]"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label="工作内容"
                        >
                            <a-textarea
                                    :rows="4"
                                    type="text"
                                    placeholder="在这期间做了什么"
                                    v-decorator="[
                                'content',
                            ]"
                            >
                            </a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
        <a-modal
                v-model="plainWorkTime.modalStatus"
                :title="plainWorkTime.modalTitle"
                :bodyStyle="{paddingBottom:'1px'}"
                @ok="workTimePlainHandleSubmit"
                :confirmLoading="plainWorkTime.confirmLoading"
        >
            <a-form
                    layout="vertical"
                    @submit.prevent="workTimePlainHandleSubmit"
                    :form="plainWorkTime.form">
                <a-form-item
                        label=""
                >
                    <a-input
                            type="text"
                            placeholder="请输入数字"
                            addonAfter="小时"
                            v-decorator="[
                                'work_time',
                                {rules: [{ required: true, message: '请输入预估工时' }], validateTrigger: 'change'}
                            ]"
                    >
                    </a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import $ from 'jquery'
    import moment from 'moment';
    import {COMMON} from '../../const/common'
    import editor from '@/components/editor'
    import {createComment, del, edit, logs, read, recovery, recycle, star, taskDone} from "@/api/task";
    import {del as delSourceLink} from "@/api/sourceLink";
    import {list as getTaskMembers} from "@/api/taskMember";
    import taskMemberMenu from "@/components/project/taskMemberMenu"
    import taskTagMenu from "@/components/project/taskTagMenu"
    import projectMemberMenu from "@/components/project/projectMemberMenu"
    import inviteProjectMember from '@/components/project/inviteProjectMember'
    import {getStore} from "@/assets/js/storage";
    import {getApiUrl} from "@/assets/js/utils";
    import {save as createTask, list as getTasks, like as doLike} from "@/api/task";
    import {notice} from "@/assets/js/notice";
    import {relativelyTaskTime, relativelyTime} from "@/assets/js/dateTime";
    import {checkResponse} from "../../assets/js/utils";
    import {
        _taskWorkTimeList, delTaskWorkTime,
        editTaskWorkTime,
        saveTaskWorkTime,
        setPrivate,
        setTag,
        taskSources
    } from "../../api/task";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    import {detail} from "../../api/departmentMember";

    let tokenList = getStore('tokenList', true);
    let authorization = '';
    if (tokenList) {
        let accessToken = tokenList.accessToken;
        let tokenType = tokenList.tokenType;
        authorization = `${tokenType} ${accessToken}`;
    }
    export default {
        name: "task-detail",
        components: {
            ATextarea,
            editor,
            taskMemberMenu,
            taskTagMenu,
            projectMemberMenu,
            inviteProjectMember
        },
        props: {
            taskCode: {
                type: [String],
                default() {
                    return ''
                }
            },
            width: {
                type: [String, Number],
                default() {
                    return '1360'
                }
            }
        },
        data() {
            return {
                moment,
                loading: false,
                code: this.taskCode,
                projectCodeCurrent: '',
                task: {},
                taskStatusList: COMMON.TASK_STATUS,
                taskLogList: [],
                taskLogTotal: 0,
                taskMemberList: [],
                workTimeList: [],
                workTimeTotal: [],

                /*任务菜单*/
                visibleTaskMenu: false,

                /*成员菜单*/
                visibleTaskMemberMenu: false,
                /*任务标签*/
                visibleTaskTagMenu: false,
                visibleProjectMemberMenu: false,
                showInviteMember: false,

                /*任务标题*/
                taskName: '',

                /*日期*/
                showEditName: false,
                showBeginTime: false,
                showEndTime: false,

                /*备注*/
                showTaskDescriptionEdit: false,
                showMoreDesc: false,
                hasMoreDesc: false,
                editorConfig: {
                    uploadImgServer: getApiUrl('project/index/uploadImg'),
                    uploadImgHeaders: {
                        Authorization: authorization
                    },
                    menus: [
                        'head',	// 标题
                        'bold',	// 粗体
                        'italic',	// 斜体
                        'justify',	// 居中
                        'image',	// 图片
                        'link',	// 链接
                        'list',	// 无序列表
                        'quote',	// 引用
                        'table',	// 表格
                        '|',
                        'fullscreen'	// 全屏
                    ],
                },

                departmentMemberInfo: null,

                /*子任务*/
                childTaskList: [],
                showChildTask: false,
                childTaskName: '',
                childExecutor: null,
                visibleChildTaskMemberMenu: false,
                showInviteChildTaskMember: false,

                /*资源*/
                taskSourceList: [],

                /*任务动态*/
                taskLogType: ['all'],
                showMoreTaskLog: 0,
                hasMoreTaskLog: false,
                hideShowMore: false,

                /*评论*/
                comment: '',
                commenting: false,

                /*工时*/
                workTimeDo: {
                    form: this.$form.createForm(this),
                    info: null,
                    modalTitle: '登记工时记录',
                    modalStatus: false,
                    confirmLoading: false,
                },
                plainWorkTime: {
                    form: this.$form.createForm(this),
                    modalTitle: '设置预估工时',
                    modalStatus: false,
                    confirmLoading: false,
                },
                //显示评论提及
                showMentions: false,
                mentionsList: []
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
                uploader: state => state.common.uploader,
                socketAction: state => state.socketAction,
            }),
            childTaskDoneNum() {
                const list = this.childTaskList.filter(item => item.done == 1);
                return list.length;
            },
            checkShowMoreLog() {
                if (!this.hideShowMore) {
                    if (this.taskLogTotal > 5) {
                        return true;
                    }
                }
                return false;
            },
            taskLink() {
                return window.location.href;
            },
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
                // if (from.name == 'taskdetail') {
                //     this.init();
                // }
            },
            showInviteMember(val) {
                if (!val) {
                    this.getTaskMembers();
                }
            },
            taskLogType() {
                this.getTaskLog();
            },
            socketAction(val) {
                if (val.action === 'organization:task') {
                    const data = val.data.data;
                    if (data.taskCode == this.code) {
                        this.init(null, false);
                    }
                }
            },
            uploader: {
                handler(newVal, oldVal) {
                    //监听是否有上传文件行为
                    console.log(newVal);
                    console.log(newVal.fileList);
                    const files = newVal.fileList;
                    const index = files.findIndex(item => item.projectName == this.task.projectName);
                    if (index !== -1) {
                        this.taskSources();
                        this.getTaskLog();
                    }
                },
                deep: true
            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.$nextTick(()=>{
              this.changeModalHeight();
            })
            window.onresize = () => {
                return (() => {
                    this.changeModalHeight();
                })()
            };
            document.onkeydown = (event) => {
                console.log(event);
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (13 == e.keyCode && e.ctrlKey) {
                    //处理的部分
                    this.createComment();
                }
                if ('@' == e.key && this.commenting) {
                    this.showMentions = true;
                }else{
                    this.showMentions = false;
                }
            };
            setTimeout(() => {
                this.uploader.assignBrowse(document.getElementById('upload-file'));
            }, 500)
        },
        filters: {
            formatLogTime(value) {
                return relativelyTime(value)
            }
        },
        methods: {
            init(code = null, loading = true) {
                if (code) {
                    this.code = code;//子任务
                }
                if (loading) {
                    this.loading = true;
                }
                this.clearMemberMenu();
                this.getTask();
                this.getChildTasks();
                this.getTaskMembers();
                this.getTaskWorkTimeList();
            },
            detailClose() {
                this.$emit('close', this.task);
                // this.$router.push(`/project/space/task/${this.task.project_code}`);
            },
            clearMemberMenu() {
                this.visibleTaskTagMenu = false;
                this.visibleTaskMemberMenu = false;
                this.visibleProjectMemberMenu = false;
                // this.showChildTask = false;
            },
            getTask() {
                this.$store.commit('viewRefresh');
                this.clearMemberMenu();
                read(this.code).then((res) => {
                    this.getTaskLog();
                    this.taskSources();
                    this.taskName = res.data.name;
                    this.task = res.data;
                    this.projectCodeCurrent = res.data.project_code;
                    if (!this.task.end_time) {
                        this.task.setEndTime = false;
                        this.task.end_time = moment(moment().format('YYYY-MM-DD') + ' 18:00');
                    } else {
                        this.task.setEndTime = true;
                        this.task.end_time = moment(this.task.end_time);
                    }
                    this.task.end_time_format = relativelyTaskTime(this.task.end_time, true);
                    if (!this.task.begin_time) {
                        this.task.setBeginTime = false;
                        this.task.begin_time = moment(moment().format('YYYY-MM-DD') + ' 18:00');
                    } else {
                        this.task.setBeginTime = true;
                        this.task.begin_time = moment(this.task.begin_time);
                    }
                    this.task.begin_time_format = relativelyTaskTime(this.task.begin_time, true);
                    this.initContent(this.task.description);
                    if (this.task.executor && !this.childExecutor) {
                        this.childExecutor = this.task.executor;
                    }
                    this.loading = false;
                    this.$store.dispatch('setTempData', {
                        projectCode: this.projectCodeCurrent,
                        taskCode: this.code,
                        projectName: res.data.projectName
                    })
                });
            },
            getTaskLog() {
                logs({
                    taskCode: this.code,
                    all: this.showMoreTaskLog,
                    pageSize: 5,
                    comment: this.taskLogType[0] == 'comment' ? 1 : 0
                }).then((res) => {
                    this.taskLogList = res.data.list;
                    this.taskLogTotal = res.data.total;
                    if (res.data.total > 5) {
                        this.hasMoreTaskLog = true;
                        // this.showMoreTaskLog = 1;
                    }
                    this.$nextTick(()=>{
                        $(".img-preview-content").find('img').click((e) =>{
                            window.open($(e.target).attr("src"));
                        })
                    })
                })
            },
            taskSources() {
                taskSources({taskCode: this.code,}).then((res) => {
                    this.taskSourceList = res.data;
                })
            },
            getMoreTaskLog() {
                this.showMoreTaskLog = 1;
                this.hideShowMore = true;
                this.getTaskLog();
            },
            getTaskWorkTimeList() {
                _taskWorkTimeList({taskCode: this.code}).then(res => {
                    this.workTimeList = res.data;
                    let total = 0;
                    if (res.data) {
                        res.data.forEach(v => {
                            total += Number(v.num);
                        });
                        this.workTimeTotal = total;
                    }
                })
            },
            getTaskMembers() {
                this.clearMemberMenu();
                getTaskMembers({taskCode: this.code, pageSize: 100}).then((res) => {
                    this.taskMemberList = res.data.list;
                    this.loading = false;
                })
            },
            doTask(action) {
                let app = this;
                const actionKey = action.key;
                switch (actionKey) {
                    case 'recycle':
                        this.$confirm({
                            title: '移到回收站',
                            content: `您确定要把该任务移到回收站吗？`,
                            okText: '确定',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                recycle(app.code).then((res) => {
                                    const result = checkResponse(res);
                                    if (!result) {
                                        return false;
                                    }
                                    app.task.deleted = 1;
                                    app.getTaskLog();
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case 'star':
                        this.task.stared ? this.task.stared = 0 : this.task.stared = 1;
                        star(app.code, this.task.stared);
                        return true;
                    case 'open':
                        var url = window.location.href;
                        if (url.indexOf('?') !== -1) {
                            url += '&full-screen';
                        }else{
                            url += '?full-screen';
                        }
                        window.open(url);
                        break;
                    case 'private':
                        setPrivate(app.code, Number(!this.task.private)).then(res => {
                            const result = checkResponse(res);
                            if (!result) {
                                return false;
                            }
                            this.task.private = Number(!this.task.private);
                        });
                        return true;
                }
                this.visibleTaskMenu = false;
            },
            editTitle() {
                this.showEditName = true;
                this.$nextTick(() => {
                    this.$refs.inputTitle.focus();
                });
            },
            doSource(action, source) {
                let app = this;
                const actionKey = action.key;
                switch (actionKey) {
                    case 'unlink':
                        this.$confirm({
                            title: '取消关联',
                            content: `您确定永久删除这个关联？`,
                            okText: '确定',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                delSourceLink(source.code).then((res) => {
                                    const result = checkResponse(res);
                                    if (!result) {
                                        return false;
                                    }
                                    app.taskSources();
                                    app.getTaskLog();
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case 'copy':
                        notice({
                            title: '复制链接成功',
                            msg: '在地址栏粘贴并打开可下载该资源'
                        }, 'notice', 'success', 5);
                        return true;
                }
            },
            deleteTask() {
                let app = this;
                this.$confirm({
                    title: '彻底删除',
                    content: `彻底删除任务后，该任务及其子任务将会被永久被删除。`,
                    okText: '删除',
                    okType: 'danger',
                    cancelText: `再想想`,
                    onOk() {
                        del(app.code).then((res) => {
                            ``
                            app.detailClose();
                        });
                        return Promise.resolve();
                    }
                });
            },
            recoveryTask() {
                let app = this;
                this.$confirm({
                    title: '恢复内容',
                    content: `您确定要恢复该任务吗？`,
                    okText: '确定',
                    okType: 'primary',
                    cancelText: `再想想`,
                    onOk() {
                        recovery(app.code).then((res) => {
                            const result = checkResponse(res);
                            if (!result) {
                                return false;
                            }
                            app.getTaskLog();
                        });
                        app.task.deleted = 0;
                        return Promise.resolve();
                    }
                });
            },
            copyLink() {
                notice({
                    title: '复制链接成功',
                    msg: '你可以在其他标签页粘贴并快速打开任务页面'
                }, 'notice', 'success', 5);
            },
            like(like) {
                like = Number(like);
                doLike(this.code, like);
                if (like) {
                    this.task.like++;
                } else {
                    this.task.like--;
                }
                this.task.liked = like;
            },
            taskDone(taskCode, done, index, type = 'self') {
                done ? done = 1 : done = 0;
                taskDone(taskCode, done).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.getTaskLog();
                    if (type == 'self') {
                        //自身完成
                        this.task.done = done;
                        // this.init();
                    } else {
                        //完成子任务
                        this.childTaskList[index].done = done;
                        // this.init(this.childTaskList[index].pcode);
                    }
                    this.getTask();
                    this.getChildTasks();
                });
            },
            doBeginTime(setBeginTime = false, showBeginTime = false) {
                this.task.setBeginTime = setBeginTime;
                this.showBeginTime = showBeginTime;
                let beginTime = '';
                if (setBeginTime) {
                    beginTime = moment(this.task.begin_time).format('YYYY-MM-DD HH:mm');
                    this.task.begin_time_format = moment(this.task.begin_time).format('MM月DD日 HH:mm');
                } else {
                    beginTime = '';
                }
                this.editTask({begin_time: beginTime});

            },
            doEndTime(setEndTime = false, showEndTime = false) {
                this.task.setEndTime = setEndTime;
                this.showEndTime = showEndTime;
                let endTime = '';
                if (setEndTime) {
                    endTime = moment(this.task.end_time).format('YYYY-MM-DD HH:mm');
                    this.task.end_time_format = moment(this.task.end_time).format('MM月DD日 HH:mm');
                } else {
                    endTime = '';
                }
                this.editTask({end_time: endTime});

            },
            doPri(item) {
                this.editTask({pri: item.key});
            },
            doName() {
                this.showEditName = false;
                if (!this.task.name.trim() || this.task.name == this.taskName) {
                    this.task.name = this.taskName;
                    return false;
                }
                this.editTask({name: this.task.name});
            },
            taskStatusChange(item) {
                this.task.status = item.key;
                this.editTask({status: item.key});
            },
            editTask(data) {
                data.taskCode = this.code;
                edit(data).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.getTask();
                });
            },
            priColor(pri) {
                switch (pri) {
                    case 1:
                        return '#ff9900';
                    case 2:
                        return '#ed3f14';
                    default:
                        return 'green';

                }
            },
            showTaskDesc() {
                if (this.task.deleted) {
                    return false;
                }
                this.showTaskDescriptionEdit = true;
                this.initContent(this.task.description)
            },
            initContent(value) {
                if (value) {
                    this.$refs.vueWangeditor.setHtml(value)
                } else {
                    this.$refs.vueWangeditor.setHtml('')
                }
                this.$nextTick(() => {
                    this.checkShowMoreDesc(false, true);
                });
            },
            doContent() {
                let content = this.$refs.vueWangeditor.getHtml();
                const obj = {
                    taskCode: this.code,
                    description: content
                };
                edit(obj).then(() => {
                    this.task.description = content;
                    this.showTaskDescriptionEdit = false;
                    this.$nextTick(() => {
                        this.checkShowMoreDesc(false, true);
                    });
                    this.getTaskLog();
                });
            },
            createComment() {
                let comment = this.comment.trim();
                if (!comment) {
                    return false;
                }
                comment += ' ';
                const regx = /(@[^@]+) /g;
                const res = comment.match(regx);
                if (res) {
                    res.forEach((v) => {
                        let str = v.substring(1, v.length - 1);
                        if (this.mentionsList.findIndex(item => item == str) === -1) {
                            this.mentionsList.push(str);
                        }
                    });
                }
                createComment(this.code, this.comment, JSON.stringify(this.mentionsList)).then(() => {
                    this.comment = '';
                    this.mentionsList = [];
                    this.getTaskLog();
                });
            },
            checkShowMoreDesc(show = false, init = false) {
                let dom = $(".description-txt");
                if (!init) {
                    if (show) {
                        this.showMoreDesc = true;
                        dom.css("max-height", () => {
                            return '100%';
                        });
                    } else {
                        this.showMoreDesc = false;
                        dom.css("max-height", () => {
                            return '300px';
                        });
                    }
                }
                if (init) {
                    const height = dom.height();
                    if (height >= 300) {
                        this.hasMoreDesc = true;
                        return true;
                    } else {
                        this.hasMoreDesc = false;
                        return false;
                    }
                }
                return false;
            },
            createTask() {
                let obj = {pcode: this.code, name: this.childTaskName};
                if (this.childExecutor) {
                    obj.assign_to = this.childExecutor.code;
                }
                createTask(obj).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.childTaskName = '';
                    this.getChildTasks();
                    this.getTaskLog();
                });
            },
            getChildTasks() {
                getTasks({pcode: this.code, pageSize: 100, deleted: 0}).then((res) => {
                    let list = [];
                    res.data.list.forEach(v => {
                        v.visibleChildTaskMemberMenu = false;
                        list.push(v);
                    });
                    this.childTaskList = list;
                })
            },
            taskTagChange(tag) {
                const index = this.task.tags.findIndex(item => item.tag_code == tag.code);
                if (index !== -1) {
                    this.task.tags.splice(index, 1);
                } else {
                    this.task.tags.push({
                        tag_code: tag.code,
                        tag: tag
                    });
                }
            },
            taskTagUpdate(tag) {
                const index = this.task.tags.findIndex(item => item.tag_code == tag.code);
                if (index !== -1) {
                    this.task.tags[index].tag = tag;
                }
            },
            taskTagDelete(tag) {
                const index = this.task.tags.findIndex(item => item.tag_code == tag.code);
                if (index !== -1) {
                    this.task.tags.splice(index, 1);
                }
            },
            removeTag(tag, index) {
                setTag({taskCode: this.task.code, tagCode: tag.code}).then(() => {
                    this.task.tags.splice(index, 1);
                });
            },
            doPlainWorkTime() {
                let app = this;
                this.plainWorkTime.modalStatus = true;
                this.$nextTick(function () {
                    app.plainWorkTime.form.setFieldsValue({
                        work_time: app.task.work_time,
                    });
                })
            },
            doWorkTime(workTime = false) {
                let app = this;
                this.workTimeDo.modalStatus = true;
                if (workTime) {
                    this.workTimeDo.info = workTime;
                    this.$nextTick(function () {
                        app.workTimeDo.form.setFieldsValue({
                            num: workTime.num,
                            begin_time: moment(workTime.begin_time),
                            content: workTime.content,
                        });
                    })
                } else {
                    this.workTimeDo.form.resetFields();
                    this.workTimeDo.info = null;
                }
            },
            deleteWorkTime(workTime, index) {
                let app = this;
                this.$confirm({
                    title: '删除工时记录',
                    content: `确定要删除工时记录吗？`,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '再想想',
                    onOk() {
                        delTaskWorkTime({code: workTime.code}).then((res) => {
                            if (checkResponse(res)) {
                                app.workTimeList.splice(index, 1);
                                app.workTimeTotal -= workTime.num;
                            }
                        });
                        return Promise.resolve();
                    }
                });
            },
            workTimePlainHandleSubmit() {
                let app = this;
                this.plainWorkTime.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.editTask({work_time: values.work_time});
                            app.plainWorkTime.modalStatus = false;
                        }
                    }
                );
            },
            workTimeHandleSubmit() {
                let app = this;
                this.workTimeDo.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.workTimeDo.confirmLoading = true;
                            let data = {
                                beginTime: values.begin_time.format('YYYY-MM-DD HH:mm'),
                                num: values.num,
                                content: values.content,
                                taskCode: app.code,
                            };
                            if (app.workTimeDo.info) {
                                data.code = app.workTimeDo.info.code;
                                editTaskWorkTime(data).then(res => {
                                    app.workTimeDo.confirmLoading = false;
                                    if (checkResponse(res)) {
                                        app.workTimeDo.modalStatus = false;
                                        app.getTaskWorkTimeList();
                                    }
                                })
                            } else {
                                saveTaskWorkTime(data).then(res => {
                                    app.workTimeDo.confirmLoading = false;
                                    if (checkResponse(res)) {
                                        app.workTimeDo.modalStatus = false;
                                        app.getTaskWorkTimeList();
                                    }
                                });
                            }
                        }
                    }
                );
            },
            checkLink(text) {
                let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
                if(!reg.exec(text)){
                    return text
                }else{
                    text = text.replace(reg, "<a target='_blank' href='$1$2'>$1$2</a>");
                }
                return text;
            },
            updateChildExecutor(member) {
                this.visibleChildTaskMemberMenu = false;
                this.childExecutor = member;
            },
            getPopup() {
                return document.getElementById('footer');
            },
            getTaskMemberPopup() {
                return document.getElementById('task-detail');
            },
            departmentMemberDetail(code) {
                detail({code: code,organization: this.$store.state.currentOrganization.code}).then(res=>{
                    this.departmentMemberInfo = res.data;
                })
            },
            selectMentionMember(member) {
                this.showMentions = false;
                this.comment += member.name + ' ';
                this.$nextTick(() => {
                    this.$refs.commentText.focus();
                });
            },
            changeModalHeight() {
                const defaultWidth = this.width;
                let width = $(window).width() - 100;
                let height = $(window).height() - 150;
                let logHeight = $(window).height() - 315;
                if (defaultWidth === 'full-screen' || this.$route.query['full-screen'] !== undefined) {
                    //全屏显示
                    $(".task-detail-modal").css("width", $(window).width());
                    $(".task-detail").css("width", $(window).width());
                    $(".ant-modal").css("top", 0);
                    height += 85;
                    logHeight += 85;
                    $(".content-left").css("height", height + "px");
                    $(".log-wrap").css("height", logHeight + "px");
                } else {
                    if (width > defaultWidth) {
                        width = defaultWidth;
                    }
                    $(".task-detail").css("width", width);
                    $(".content-left").css("height", height + "px");
                    $(".log-wrap").css("height", logHeight + "px");
                }
            }
        }
    }
</script>


<style lang="less">
    @import "~ant-design-vue/lib/style/themes/default";

    .field-flex {
        display: flex;
        justify-content: flex-start;
    }

    .task-tag {
        .ant-tag {
            margin-bottom: 6px;
        }
    }

    .task-detail {
        background: #FFF;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        min-height: 1px;
        min-width: 1px;
        margin: auto;

        .task-detail-spin {
            width: 100%;
        }

        .task-header {
            padding: 20px 0;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            vertical-align: middle;


            .head-title {
                padding: 0 20px 0 20px;
                flex: 1 1;

                .breadcrumb {
                    display: inline;

                    a {
                        color: inherit;

                        &:hover {
                            color: #40a9ff;
                        }

                    }
                }
            }

            .header-action {
                font-size: 16px;
                padding: 0 20px;
                display: flex;
                max-height: 24px;

                .action-item {
                    margin-left: 10px;
                    padding: 4px;
                    transition: 218ms;
                    transition-property: background, color;
                    border-radius: 4px;
                    align-items: center;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    min-width: 32px;

                    span {
                        margin-left: 6px;
                        font-size: 14px;
                    }

                    &.active {
                        color: #3da8f5;
                    }

                    &:hover {
                        background: #ecf6fe;
                        color: #3da8f5;
                        border-radius: 4px;
                    }
                }
            }

            &.disabled {
                background: #f5f5f5;
            }
        }

        .task-wrap {
            .task-content {
                display: flex;
                justify-content: flex-start;

                .content-left {
                    border-right: 1px solid #e5e5e5;
                    min-width: 560px;
                    //width: 63%;
                    flex: 1;
                    /*width: 760px;*/

                    .task-title {
                        margin: 10px 40px 20px 20px;
                        cursor: text;

                        &.disabled {
                            cursor: not-allowed;

                            &:hover {
                                background: inherit;
                            }

                            .ant-input, .title-text {
                                &:hover, &:focus {
                                    background: inherit;
                                }
                            }
                        }

                        &:hover {
                            background: #f5f5f5;
                        }
                        &.hover-none{
                            background: initial;
                        }

                        .title-text {
                            line-height: 24px;
                        }

                        .ant-input, .title-text {
                            font-size: 20px;
                            padding: 8px;
                            border: none !important;
                            border-radius: 4px;

                            &:hover, &:focus {
                                background: #f5f5f5;
                                box-shadow: none !important;
                                border-right-width: 0 !important;
                                border: none !important;
                                border-radius: 4px;
                            }
                        }
                    }

                    .task-basic-attrs-view {
                        .field-list {
                            padding: 0 40px 0 32px;

                            &.disabled {
                                .field-right, a {
                                    cursor: not-allowed !important;
                                }
                            }

                            .component-mount {
                                .field {
                                    display: flex;
                                    justify-content: flex-start;
                                    margin: 12px 0;
                                    min-height: 36px;

                                    .field-left {
                                        align-self: flex-start;
                                        width: 132px;
                                        height: 36px;
                                        padding-right: 12px;
                                    }

                                    .field-right {
                                        cursor: pointer;
                                        max-width: calc(100% - 132px);

                                        .inline-block {
                                            display: inline-block;
                                        }

                                        &.field-date {
                                            display: flex;
                                        }

                                        &.width-block {
                                            width: 100%;

                                            .w-e-text {
                                                cursor: text;
                                            }
                                        }

                                        .name {
                                            margin: 0 8px;
                                        }
                                    }

                                    .block-field {
                                        width: 100%;
                                        border: 1px solid #e5e5e5;
                                        border-radius: 4px;
                                        padding: 2px 0;
                                        margin-bottom: 12px;
                                        display: flex;
                                        justify-content: flex-start;
                                        flex-direction: row;
                                    }

                                    .task-child {
                                        width: 100%;

                                        .task-list {
                                            padding: 8px 0;

                                            .list-item {
                                                padding: 4px 12px 4px 5px;
                                                display: flex;
                                                align-items: center;
                                                /*justify-content: space-between;*/

                                                .task-title, .task-input {
                                                    flex: 1 1;
                                                    margin: 0;
                                                }

                                                .title-text {
                                                    color: #333;
                                                    line-height: 14px;

                                                    &.done {
                                                        color: #a6a6a6;
                                                    }
                                                }

                                                .ant-input, .title-text {
                                                    font-size: 14px;

                                                    &:hover, &:focus {
                                                    }
                                                }

                                                .check-box-wrapper {
                                                    margin-top: 0;
                                                }

                                                .task-item {
                                                    cursor: pointer;
                                                    margin-right: 12px;

                                                    &.disabled {
                                                        cursor: not-allowed;
                                                    }

                                                    &.check-box {
                                                        .anticon-check {
                                                            visibility: visible;
                                                            top: 14px;
                                                            left: 18px;
                                                        }
                                                    }

                                                }
                                            }

                                            .action-btn {
                                                padding: 2px 12px 2px 16px;
                                            }
                                        }

                                        .add-handler {
                                            /*margin-bottom: 8px;*/
                                            padding-left: 16px;
                                            padding-right: 12px;
                                            display: flex;
                                            align-items: center;
                                            height: 36px;
                                        }
                                    }

                                    .file-list {
                                        width: 100%;
                                        padding: 8px;

                                        .ant-list-item {
                                            padding: 10px 12px;
                                            border-bottom: none;
                                            border-radius: 4px;
                                            margin-bottom: 2px;

                                            &:hover {
                                                background-color: #f5f5f5;
                                            }

                                            .ant-list-item-meta-title {
                                                margin-bottom: 0;
                                                line-height: 24px;
                                            }
                                        }
                                    }
                                }

                                .field-name {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    padding-left: 8px;
                                }

                                .task-description {
                                    &:hover {
                                        background: #f5f5f5;
                                        border-radius: 4px;
                                    }

                                    &.disabled {
                                        &:hover {
                                            background: inherit;
                                        }
                                    }

                                    padding: 8px;
                                    margin: -8px;

                                    .description-txt {
                                        max-height: 300px;
                                        overflow: hidden;
                                        word-break: break-all;
                                    }

                                    p {
                                        margin: 0;
                                    }
                                }
                            }
                        }
                    }

                    #editor {
                        .w-e-text {
                            min-height: 300px;
                            overflow-y: auto;
                        }
                        .w-e-text-container{
                            height: inherit !important;
                            min-height: 300px;
                        }
                    }
                }

                .content-right {
                    //width: 37%;
                    width: 410px;

                    .header {
                        padding: 15px 20px 20px 20px;
                    }

                    .member-list {
                        padding-top: 12px;
                        display: flex;
                        justify-content: flex-start;

                        .member-item {
                            margin-right: 10px;
                            cursor: pointer;

                            &.invite {
                                cursor: pointer;
                            }
                        }
                    }

                    .log-wrap {
                        border-top: 1px solid #e5e5e5;
                        border-bottom: 1px solid #e5e5e5;
                        padding-bottom: 60px;

                        .header {
                            width: 100%;
                        }

                        .log-list {
                            /*font-size: 12px;*/
                            padding: 0 20px 0 20px;

                            .show-more {
                                display: block;
                                margin-bottom: 20px;
                            }

                            .log-comment {
                                max-width: 405px;
                                align-items: end;
                                margin-bottom: 15px;
                            }

                            .list-item {
                                display: flex;
                                justify-content: flex-start;
                                align-items: baseline;
                                vertical-align: middle;
                                width: 100%;
                                .log-item {
                                    margin-right: 12px;
                                    margin-bottom: 24px;

                                    .anticon {
                                        font-size: 14px;
                                    }

                                    .log-content {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        border-left: 5px solid #ccc;
                                        padding-left: 12px;
                                        margin-top: 6px;
                                        word-break: break-all;

                                        img{
                                            cursor: pointer;
                                        }
                                    }
                                }

                                .log-txt {
                                    flex: 1 1;
                                }
                            }
                        }
                    }

                    .footer {
                        padding: 20px 20px 0 20px;
                        display: flex;
                    }
                }
            }
        }
    }

    .work-time-modal {
        .work-time-stats {
            display: flex;
            margin-bottom: 18px;

            .work-time-item {
                margin-right: 36px;

                .title {
                    font-size: 12px;
                }

                .work-time-num {
                    font-size: 22px;
                    font-weight: 500;
                    margin-right: 5px;
                    font-family: dinmedium;
                }
            }
        }
    }
    .footer{
        .ant-popover-inner-content{
            padding: 0;
            .mentions-content {
                width: 200px;
                padding: 12px 0;
                .mentions-wrapper {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding: 6px 12px;
                    &:hover{
                        cursor: pointer;
                        background: rgba(51, 143, 229, 0.1);
                    }
                }
            }
        }
    }
</style>
