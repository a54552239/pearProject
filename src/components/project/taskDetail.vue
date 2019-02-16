<template>
    <div class="task-detail">
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
                                                <span class="field-name">状态</span>
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
                                            <div class="field-right">
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
                                    <div class="component-mount">
                                        <div class="field">
                                            <div class="field-left">
                                                <a-icon type="file-text"/>
                                                <span class="field-name">备注</span>
                                            </div>
                                            <div class="field-right width-block">
                                                <div class="task-description" :class="{'disabled': task.deleted}"
                                                     v-show="!showTaskDescriptionEdit"
                                                     @click="showTaskDesc">
                                                    <div class="description-txt" v-show="task.description"
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
                                                           :key="index">{{tag.tag.name}}
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
                                                                        <a class="task-item check-box"
                                                                           :class="{'disabled': task.deleted || childTask.parentDone || childTask.hasUnDone}"
                                                                           @click="()=>{if(task.deleted || childTask.parentDone || childTask.hasUnDone) return false;taskDone(childTask.code,!childTask.done,index,'child')}">
                                                                            <a-icon type="check"
                                                                                    v-show="childTask.done"/>
                                                                        </a>
                                                                    </a-tooltip>
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
                                                    <a class="add-handler" id="upload-file"
                                                       v-show="!showChildTask">
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
                                                                    <span>{{ item.title }}</span>
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
                                                                    <a-menu @click="doSource($event,item.code)"
                                                                            class="field-right-menu"
                                                                            slot="overlay">
                                                                        <a-menu-item key="copy"
                                                                                     v-clipboard="item.sourceDetail.file_url">
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
                                    <div class="list-item" :class="{'log-comment': log.is_comment}"
                                         v-for="log in taskLogList" :key="log.code">
                                        <template v-if="!log.is_comment">
                                            <a-icon class="log-item" :type="log.icon"/>
                                            <div class="log-item log-txt">
                                                <div>{{log.member.name}} <span v-html="log.remark"></span></div>
                                                <div v-if="log.content" class="log-content"
                                                     v-html="log.content"></div>
                                            </div>
                                        </template>
                                        <template v-if="log.is_comment">
                                            <a-avatar class="log-item" :src="log.member.avatar"/>
                                            <div class="log-item log-txt text-default">
                                                <div>{{log.member.name}}</div>
                                                <div class="m-t-xs" v-html="log.content"></div>
                                            </div>
                                        </template>
                                        <a-tooltip :mouseEnterDelay="0.5">
                                            <template slot="title">
                                                <span>{{log.create_time}}</span>
                                            </template>
                                            <span class="log-item">{{log.create_time | formatLogTime}}</span>
                                        </a-tooltip>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                        <div class="footer">
                            <a-textarea v-model="comment" :rows="1" placeholder="按 Ctrl+Enter 快速发表评论"
                                        style="margin-right: 24px;"/>
                            <a-button class="middle-btn" type="primary" @click="createComment">评论</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
        <invite-project-member v-model="showInviteMember" :project-code="projectCodeCurrent"
                               v-if="showInviteMember"></invite-project-member>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import $ from 'jquery'
    import moment from 'moment';
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
    import {setPrivate, taskSources} from "../../api/task";

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
                    return '1200'
                }
            }
        },
        data() {
            return {
                loading: false,
                code: this.taskCode,
                projectCodeCurrent: '',
                task: {},
                taskLogList: [],
                taskLogTotal: 0,
                taskMemberList: [],

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
                comment: ''
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
                uploader: state => state.common.uploader,

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
            this.changeModalHeight();
            window.onresize = () => {
                return (() => {
                    this.changeModalHeight();
                })()
            };
            document.onkeydown = (event) => {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (13 == e.keyCode && e.ctrlKey) {
                    //处理的部分
                    this.createComment();
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
            init(code) {
                if (code) {
                    this.code = code;//子任务
                }
                this.loading = true;
                this.clearMemberMenu();
                this.getTask();
                this.getChildTasks();
                this.getTaskMembers();
            },
            detailClose() {
                this.$emit('close', this.task);
                // this.$router.push(`/project/space/task/${this.task.project_code}`);
            },
            clearMemberMenu() {
                this.visibleTaskTagMenu = false;
                this.visibleTaskMemberMenu = false;
                this.visibleProjectMemberMenu = false;
                this.showChildTask = false;
            },
            getTask() {
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

                    this.initContent(this.task.description);
                    if (this.task.executor) {
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
                        window.open(window.location.href + '&full-screen');
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
            doSource(action, sourceCode) {
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
                                delSourceLink(sourceCode).then((res) => {
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
                        return '#a6a6a6';

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
                if (!this.comment.trim()) {
                    return false;
                }
                createComment(this.code, this.comment).then(() => {
                    this.comment = '';
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
                    this.childTaskList = res.data.list;
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
            updateChildExecutor(member) {
                this.visibleChildTaskMemberMenu = false;
                this.childExecutor = member;
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
                    width: 63%;
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
                                                padding: 4px 12px 4px 16px;
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
                                    }

                                    p {
                                        margin: 0;
                                    }
                                }
                            }
                        }
                    }
                }

                .content-right {
                    width: 37%;
                    /*width: 440px;*/

                    .header {
                        padding: 15px 20px 20px 20px;
                    }

                    .member-list {
                        padding-top: 12px;
                        display: flex;
                        justify-content: flex-start;

                        .member-item {
                            margin-right: 10px;

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

                            .list-item {
                                display: flex;
                                justify-content: flex-start;
                                align-items: baseline;
                                vertical-align: middle;
                                width: 100%;

                                &.log-comment {
                                    align-items: end;
                                }

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
</style>
