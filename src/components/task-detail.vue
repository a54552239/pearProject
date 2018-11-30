<template>
    <div class="task-wrapper">
        <div class="task-detail">
            <Modal class="task-detail-modal"
                   :width="600"
                   v-model="detail_modal"
                   title="任务提示">
                <div slot="header">
                    <span class="task-header-title muted" v-if="task.pid == 0">{{ task.project_info.name }} ·
                        <Dropdown :transfer="true" class="task-type-list" trigger="click" @on-click="changeTaskType">
                            <a href="javascript:void(0)" class="muted">
                                {{ task.task_type_name }}
                            </a>
                            <Dropdown-menu slot="list">
                                <Dropdown-item v-for="(task_type,index) in task_type_list" :key="index"
                                               :name="index">
                                    <span class="muted" style="line-height: 25px;">{{ task_type.name }}</span>
                                    <Icon type="ios-checkmark" size="24" style="float: right" class="muted"
                                          v-if="task_type.id == task.task_type"></Icon>
                                </Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
                    </span>
                    <span class="task-header-title muted" v-else-if="task.pid">属于任务：<a href="javascript:void(0)"
                                                                                       @click="init(task.pid)"
                                                                                       class="muted">
                                {{ task.parent_task.name }}
                            </a>
                    </span>
                    <div class="task-detail-action">
                        <Dropdown trigger="click" @on-click="delete_task_modal = !delete_task_modal">
                            <a href="javascript:void(0)" class="muted">
                                操作
                                <Icon type="chevron-down"></Icon>
                            </a>
                            <Dropdown-menu slot="list">
                                <Dropdown-item>删除任务</Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
                    </div>
                    <div class="task task-title-wrap" :class="{'done': task.task_state == 1}">
                        <a class="check-box" @click.stop="setTaskState(task)"><span
                                class="ivu-icon ivu-icon-md-checkmark"></span></a>
                        <Input v-model="task.name" v-if="show_name_edit && edit_task_id == task.id"
                               class="task-input muted"
                               @on-blur="editName(task)" :autofocus="true" element-id="title-input"/>
                        <h3 class="task-title" @click="show_name_edit = true;edit_task_id = task.id" v-else>
                            <Tooltip placement="top" content="点击即可编辑">
                                <span :class="{'muted':task.task_state == 1}" style="line-height: 25px">
                                    {{ task.name }}
                                </span>
                            </Tooltip>
                        </h3>
                    </div>
                </div>
                <vue-scroll :ops="ops">
                    <div class="detail-content">
                        <div class="detail-white-card task-detail-handler-wrap">
                            <div class="task-detail-handler-set task-base">
                                <Row>
                                    <i-col span="8">
                                        <!--<div class="executor">执行者</div>-->
                                        <div @click="show_task_user = !show_task_user" style="cursor: pointer;">
                                            <Dropdown :transfer="true" trigger="click"
                                                      @on-click="addTaskExecutorUser"
                                                      v-if="task_user_list.list.length > 0"
                                            >
                                                <img class="avatar img-circle img-24 pull-left m-r-sm"
                                                     :src="task_user_list.executor.avatar" alt="">
                                                <span class="muted"
                                                      style="line-height: 25px;">{{ task_user_list.executor.realname }}</span>
                                                <Dropdown-menu slot="list" class="task-user-list">
                                                    <p class="m-sm">设置执行者</p>
                                                    <Dropdown-item
                                                            v-for="(user,index) in task_user_list.list" :key="index"
                                                            :name="user.user_id">
                                                        <img class="avatar img-circle img-24 pull-left m-r-sm "
                                                             :src="user.user_info.avatar">
                                                        <span class="muted"
                                                              style="line-height: 25px;">{{ user.user_info.realname }}</span>
                                                        <Icon type="ios-checkmark"
                                                              v-if="user.is_executor == 1"></Icon>
                                                    </Dropdown-item>
                                                </Dropdown-menu>
                                            </Dropdown>
                                        </div>
                                    </i-col>
                                    <i-col span="16">
                                        <!--<div class="m-b-xs">开始时间 </div>-->
                                        <!--<div class="task-date-item">-->
                                        <!--<Date-picker-->
                                        <!--confirm-->
                                        <!--:open="begin_open"-->
                                        <!--:value="date_picker_data.task_begin_time"-->
                                        <!--type="datetime"-->
                                        <!--format="yyyy-MM-dd HH:mm"-->
                                        <!--placement="bottom"-->
                                        <!--@on-change="handleBeginChange"-->
                                        <!--@on-ok="handleOk('begin')"-->
                                        <!--@on-clear="begin_open = false">-->
                                        <!--<Tooltip placement="top" content="点击设置开始时间">-->
                                        <!--<a href="javascript:void(0)" class="muted" @click="handleClick('begin')">-->
                                        <!--<Icon type="android-calendar" size="16"></Icon>-->
                                        <!--<template v-if="date_picker_data.task_begin_time === null || date_picker_data.task_begin_time === ''">设置开始时间</template>-->
                                        <!--<template v-else>{{ date_picker_data.task_begin_time_format }}-->
                                        <!--</template>-->
                                        <!--</a>-->
                                        <!--</Tooltip>-->
                                        <!--</Date-picker>-->
                                        <!--</div>-->
                                        <!--<div class="task-date-item">-->
                                        <!--<span class="muted">–</span>-->
                                        <!--</div>-->
                                        <div class="task-date-item">
                                            <Date-picker
                                                    confirm
                                                    :open="open"
                                                    :value="date_picker_data.task_end_time"
                                                    type="datetime"
                                                    format="yyyy-MM-dd HH:mm"
                                                    placement="bottom"
                                                    @on-change="handleChange"
                                                    @on-ok="handleOk('end')"
                                                    @on-clear="handleClear('end')">
                                                <Tooltip placement="top" content="点击设置截止时间" transfer>
                                                    <a href="javascript:void(0)" class="date-title muted"
                                                       @click="handleClick('end')">
                                                        <Icon type="android-calendar" size="20"></Icon>
                                                        <span class="m-l-xs">
                                                                <template
                                                                        v-if="date_picker_data.task_end_time === null || date_picker_data.task_end_time === ''">设置截止时间</template>
                                                            <template
                                                                    v-else>{{ date_picker_data.task_end_time_format }}</template>
                                                            </span>
                                                    </a>
                                                </Tooltip>
                                            </Date-picker>
                                        </div>
                                        <div class="task-date-item" style="padding-top: 0;">
                                            <Date-picker
                                                    confirm
                                                    :open="remind_open"
                                                    :value="date_picker_data.task_remind_time"
                                                    type="datetime"
                                                    format="yyyy-MM-dd HH:mm"
                                                    placement="bottom"
                                                    @on-change="handleRemindChange"
                                                    @on-ok="handleOk('remind_time')"
                                                    @on-clear="handleClear('remind_time')">
                                                <Tooltip placement="top" :content="remind_content" transfer>
                                                    <a href="javascript:void(0)" class="date-title muted"
                                                       :class="{'primary': date_picker_data.task_remind_time !== null && date_picker_data.task_remind_time !== ''}"
                                                       @click="handleClick('remind_time')">
                                                        <Icon type="md-alarm" size="20"></Icon>
                                                    </a>
                                                </Tooltip>
                                            </Date-picker>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-white-card task-detail-handler-wrap"
                             :style="{'height: 250px;': !hidden_task_content}">
                            <div class="task-detail-handler-set">
                                <Row>
                                    <i-col>
                                        <div style="padding-left: 1px;">
                                            <div class="note-aside muted"
                                                 @click="hidden_task_content = !hidden_task_content">
                                                <Icon type="ios-paper-outline"
                                                      style="float: left;font-size: 24px;position: absolute;top: 5px;"></Icon>
                                                <!--<Tooltip placement="top" content="点击即可编辑">-->
                                                <span class="task-content" v-if="task.desc != '' && task.desc != null"
                                                      v-html="task.desc"
                                                      :class="{'hidden':!hidden_task_content}"></span>
                                                <!--</Tooltip>-->
                                                <a class="muted title"
                                                   href="javascript:void(0)"
                                                   v-if=" (task.desc == '' || task.desc == null) && hidden_task_content"
                                                   style="margin-left: 20px;cursor: pointer;line-height: 33px;"
                                                   @click.stop="hidden_task_content = !hidden_task_content">添加备注</a>
                                            </div>
                                        </div>
                                        <div style="padding-top:0;" :class="{'hidden': hidden_task_content}">
                                            <editor ref="vueWangeditor" @load="editorLoad" @change="editorChange"
                                                    :width="editor_style.width" :height="editor_style.height"
                                                    :uploadImgUrl="uploadImgUrl" :uploadParams="uploadParams"
                                                    :uploadHeaders="uploadHeaders" :menus="menus"
                                                    id="editor"></editor>
                                            <div class="task-content-footer">
                                                <Button type="text" class="middle-btn"
                                                        @click="hidden_task_content = !hidden_task_content">
                                                    取消
                                                </Button>
                                                <Button type="primary" class="middle-btn" @click="saveContent">保存
                                                </Button>
                                            </div>

                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-white-card task-detail-handler-wrap">
                            <div class="task-detail-handler-set">
                                <Row>
                                    <i-col>
                                        <div class="note-aside muted">
                                            <Icon type="ios-stopwatch-outline" size="24"></Icon>
                                            <span class="title">执行状态</span>
                                            <Dropdown class="task-level-list" trigger="click"
                                                      @on-click="changeTaskExecute">
                                                <a class="muted">{{ task.task_execute_name }}</a>
                                                <Dropdown-menu slot="list">
                                                    <Dropdown-item
                                                            v-for="(task_execute,index) in task_execute_state_list"
                                                            :key="index"
                                                            :name="index">
                                                        <Button type="text" size="small">{{ task_execute.name }}
                                                        </Button>
                                                        <Icon type="ios-checkmark" size="24" style="float: right"
                                                              class="muted"
                                                              v-if="task_execute.key == task.execute_state"></Icon>
                                                    </Dropdown-item>
                                                </Dropdown-menu>
                                            </Dropdown>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-white-card task-detail-handler-wrap">
                            <div class="task-detail-handler-set">
                                <Row>
                                    <i-col>
                                        <div class="note-aside muted">
                                            <Icon type="ios-radio-button-off" size="24"></Icon>
                                            <span class="title">优先级</span>
                                            <Dropdown class="task-level-list" trigger="click"
                                                      @on-click="changeTaskLevel">
                                                <Button :type="task.task_level_show_type" size="small">{{
                                                    task.task_level_name }}
                                                </Button>
                                                <Dropdown-menu slot="list">
                                                    <Dropdown-item v-for="(task_level,index) in task_level_list"
                                                                   :key="index"
                                                                   :name="index">
                                                        <Button :type="task_level.show_type" size="small">{{
                                                            task_level.name
                                                            }}
                                                        </Button>
                                                        <Icon type="ios-checkmark" size="24" style="float: right"
                                                              class="muted" v-if="task_level.key == task.pri"></Icon>
                                                    </Dropdown-item>
                                                </Dropdown-menu>
                                            </Dropdown>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-white-card task-detail-handler-wrap">
                            <div class="task-detail-handler-set">
                                <Row>
                                    <i-col>
                                        <div class="note-aside muted">
                                            <Icon type="ios-pricetag-outline" size="24"></Icon>
                                            <span class="title">标签</span>
                                            <Tag class="tag-circle" v-for="(tag,tag_index) in task.task_tag_item_list"
                                                 :key="tag.id" :name="tag_index" :color="tag.color_value" closable
                                                 @on-close="removeTaskTag">{{ tag.name }}
                                            </Tag>
                                            <Dropdown class="task-tag-list" trigger="click" @on-click="addTaskTag" @on-visible-change="tagListViewChange">
                                                <a class="muted m-l-xs">
                                                    <Icon type="ios-add-circle-outline" size="20"></Icon>
                                                </a>
                                                <Dropdown-menu slot="list">
                                                    <div class="tag-search">
                                                        <Input v-model="tag_search" placeholder="搜索标签"
                                                               class="tag-search-input" :autofocus="true"/>
                                                        <Tooltip placement="top" content="添加标签">
                                                            <a href="javascript:void(0)" @click.stop="show_edit_task_tag = true;edit_task_tag_id = 0;edit_task_tag_index = 0">
                                                                <Icon type="ios-add-circle-outline"
                                                                      class="tag-search-icon"></Icon>
                                                            </a>
                                                        </Tooltip>
                                                    </div>

                                                    <Dropdown-item class="tag-list-item" v-if="task_tag_list.length > 0 && !show_edit_task_tag"
                                                                   v-for="(task_tag,task_tag_index) in task_tag_list"
                                                                   :key="task_tag_index"
                                                                   :name="task_tag_index">
                                                        <!--@mouseover="edit_task_tag_id = task_tag.id;edit_task_tag_index = task_tag_index"-->
                                                        <!--@mouseout="edit_task_tag_id = 0;edit_task_tag_index = 0"-->
                                                        <div>
                                                            <span class="tag muted"
                                                                  :class="'tag-color-'+ task_tag.color"></span>
                                                            <Button size="small" type="text">{{ task_tag.name }}</Button>
                                                            <span class="tag-icon" >
                                                                <!--@click.stop="showEditTaskTag(task_tag)"-->
                                                                 <a class="muted" style="display: inline-block">
                                                                    <!--<Icon type="edit" size="14"></Icon>-->
                                                                    <Icon type="edit" size="14" v-show="edit_task_tag_id == task_tag.id" @click.stop="show_edit_task_tag = true;edit_task_tag_id = task_tag.id;add_tag_color = task_tag.color;tag_search = task_tag.name"></Icon>
                                                                </a>
                                                                <Icon type="checkmark" size="14" class="muted" v-show="showTaskSelect(task_tag.id)"></Icon>
                                                            </span>
                                                        </div>

                                                    </Dropdown-item>
                                                    <div v-if="(task_tag_list.length == 0 && tag_search) || show_edit_task_tag">
                                                        <ul class="color-picker">
                                                            <li class="color-circle"
                                                                v-for="(color,color_index) in tag_color_list"
                                                                :key="color_index">
                                                                <a class="color-circle-btn"
                                                                   @click.stop="add_tag_color = color">
                                                                    <div class="color-disc"
                                                                         :class="'tag-color-disc-' + color">
                                                                        <span class="ivu-icon ivu-icon-md-checkmark" v-show="add_tag_color == color"></span>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <div class="p-xs text-center">
                                                            <Button size="large" :long="!show_edit_task_tag" :class="{'inline-btn': show_edit_task_tag && edit_task_tag_id}" type="error"
                                                                    v-show="show_edit_task_tag && edit_task_tag_id"
                                                                    @click.stop="createTaskTag()">删除
                                                            </Button>
                                                            <Button size="large" :long="!show_edit_task_tag || (show_edit_task_tag && edit_task_tag_id == 0)" :class="{'inline-btn': show_edit_task_tag && edit_task_tag_id}"  type="primary"
                                                                    @click.stop="createTaskTag()">
                                                                <span v-show="show_edit_task_tag && edit_task_tag_id">完成</span>
                                                                <span v-show="!show_edit_task_tag || (show_edit_task_tag && edit_task_tag_id == 0)">创建</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div v-show="task_tag_list.length == 0 && !tag_search && !show_edit_task_tag" class="p-lg text-center">
                                                        <span>暂无标签</span>
                                                    </div>
                                                </Dropdown-menu>
                                            </Dropdown>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content" style="margin-bottom: 0">
                        <div class="detail-white-card task-detail-handler-wrap no-border">
                            <div class="task-detail-handler-set">
                                <Row>
                                    <i-col>
                                        <div class="note-aside muted">
                                            <Icon type="ios-list" size="24"></Icon>
                                            <span class="title">子任务 <span v-show="task.children_task">· {{showTaskCount(task.children_task,1)}}/{{showTaskCount(task.children_task,-1)}}</span></span>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-white-card task-detail-handler-wrap">
                            <div class="task-detail-handler-set text-default" style="padding-left: 0;">
                                <Row style="padding-bottom: 10px;">
                                    <i-col v-if="task.children_task">
                                        <SlickList lockAxis="y" axis="y" :pressDelay="500" v-model="task.children_task"
                                                   @input="SlickEvent" class="children-task-list">
                                            <SlickItem class="children-task"
                                                       v-for="(children,index) in task.children_task"
                                                       :key="children.id" :index="index"
                                                       v-if="children.task_state == 0">
                                                <div class="link-head">
                                                    <div class="task children-task-title-wrap"
                                                         :class="{'done': children.task_state == 1}">
                                                        <a class="check-box" @click.stop="setTaskState(children,false)"><span
                                                                class="ivu-icon ivu-icon-md-checkmark"></span></a>
                                                        <Input v-model="children.name"
                                                               v-if="show_name_edit && edit_task_id == children.id"
                                                               class="task-input muted"
                                                               @on-blur="editName(children)" :autofocus="true"/>
                                                        <p class="task-title"
                                                           @click="show_name_edit = true; edit_task_id = children.id"
                                                           v-else>
                                                            <Tooltip placement="top" content="点击即可编辑">
                                    <span :class="{'muted':children.task_state == 1}" style="line-height: 25px">
                                        {{ children.name }}
                                    </span>
                                                            </Tooltip>
                                                        </p>
                                                        <div @click="show_task_user = !show_task_user"
                                                             style="cursor: pointer;">
                                                            <Dropdown :transfer="true" trigger="click"
                                                                      @on-click="addTaskExecutorUser($event,children.id)"
                                                                      v-if="project_user_list.length > 0">
                                                                <img class="task-avatar avatar img-circle img-24"
                                                                     :src="children.executor_user_info.avatar" alt="">
                                                                <p class="task-time"><span v-if="children.end_time">{{showTaskSettingTime(children.end_time)}}</span>
                                                                </p>
                                                                <a class="task-detail-icon muted"
                                                                   @click.stop="init(children.id)">
                                                                    <span class="ivu-icon ivu-icon-ios-arrow-forward"></span>
                                                                </a>
                                                                <Dropdown-menu slot="list"
                                                                               class="children-task-user-list">
                                                                    <p class="m-sm">设置执行者</p>
                                                                    <Dropdown-item
                                                                            v-for="(user,index) in project_user_list"
                                                                            :key="index"
                                                                            :name="user.id">
                                                                        <img class="avatar img-circle img-24 pull-left m-r-sm "
                                                                             :src="user.avatar">
                                                                        <span class="muted"
                                                                              style="line-height: 25px;">{{ user.realname }}</span>
                                                                        <Icon type="ios-checkmark"
                                                                              v-if="user.id == children.executor_user_info.id"></Icon>
                                                                    </Dropdown-item>
                                                                </Dropdown-menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                            </SlickItem>
                                            <div class="children-task" v-for="(children,index) in task.children_task"
                                                 :key="children.id" :index="index" v-if="children.task_state == 1">
                                                <div class="link-head">
                                                    <div class="task children-task-title-wrap"
                                                         :class="{'done': children.task_state == 1}">
                                                        <a class="check-box" @click.stop="setTaskState(children,false)"><span
                                                                class="ivu-icon ivu-icon-md-checkmark"></span></a>
                                                        <Input v-model="children.name"
                                                               v-if="show_name_edit && edit_task_id == children.id"
                                                               class="task-input muted"
                                                               @on-blur="editName(children)" :autofocus="true"/>
                                                        <p class="task-title"
                                                           @click="show_name_edit = true; edit_task_id = children.id"
                                                           v-else>
                                                            <Tooltip placement="top" content="点击即可编辑">
                                    <span :class="{'muted':children.task_state == 1}" style="line-height: 25px">
                                        {{ children.name }}
                                    </span>
                                                            </Tooltip>
                                                        </p>
                                                        <div @click="show_task_user = !show_task_user"
                                                             style="cursor: pointer;">
                                                            <Dropdown :transfer="true" trigger="click"
                                                                      @on-click="addTaskExecutorUser($event,children.id)"
                                                                      v-if="project_user_list.length > 0">
                                                                <img class="task-avatar avatar img-circle img-24"
                                                                     :src="children.executor_user_info.avatar" alt="">
                                                                <p class="task-time"><span v-if="children.end_time">{{showTaskSettingTime(children.end_time)}}</span>
                                                                </p>
                                                                <a class="task-detail-icon muted"
                                                                   @click.stop="init(children.id)">
                                                                    <span class="ivu-icon ivu-icon-ios-arrow-forward"></span>
                                                                </a>
                                                                <Dropdown-menu slot="list"
                                                                               class="children-task-user-list">
                                                                    <p class="m-sm">设置执行者</p>
                                                                    <Dropdown-item
                                                                            v-for="(user,index) in project_user_list"
                                                                            :key="index"
                                                                            :name="user.id">
                                                                        <img class="avatar img-circle img-24 pull-left m-r-sm "
                                                                             :src="user.avatar">
                                                                        <span class="muted"
                                                                              style="line-height: 25px;">{{ user.realname }}</span>
                                                                        <Icon type="ios-checkmark"
                                                                              v-if="user.id == children.executor_user_info.id"></Icon>
                                                                    </Dropdown-item>
                                                                </Dropdown-menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </SlickList>
                                    </i-col>
                                    <i-col>
                                        <div class="children-task" v-show="create_task">
                                            <div class="link-head">
                                                <div class="task children-task-title-wrap">
                                                    <Input v-model="new_task.name"
                                                           class="task-input muted"/>
                                                    <div @click="show_task_user = !show_task_user"
                                                         style="cursor: pointer;">
                                                        <Dropdown :transfer="true" trigger="click"
                                                                  @on-click="selectExecutor"
                                                                  v-if="project_user_list.length > 0">
                                                            <img class="task-avatar avatar img-circle img-24"
                                                                 :src="default_executor.avatar" alt="">
                                                            <p class="task-time"></p>
                                                            <Dropdown-menu slot="list" class="children-task-user-list">
                                                                <p class="m-sm">设置执行者</p>
                                                                <Dropdown-item
                                                                        v-for="(user,index) in project_user_list"
                                                                        :key="index"
                                                                        :name="index">
                                                                    <img class="avatar img-circle img-24 pull-left m-r-sm "
                                                                         :src="user.avatar">
                                                                    <span class="muted"
                                                                          style="line-height: 25px;">{{ user.realname }}</span>
                                                                    <Icon type="ios-checkmark"
                                                                          v-if="user.id == default_executor.id"></Icon>
                                                                </Dropdown-item>
                                                            </Dropdown-menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="submit-set pull-right m-t-xs ">
                                                <Button type="default" class="small-btn"
                                                        @click="create_task = false">取消
                                                </Button>
                                                <Button type="primary" class="small-btn"
                                                        @click="addTask">创建
                                                </Button>
                                            </div>
                                        </div>
                                    </i-col>
                                </Row>
                                <div style="height: 22px;padding-left: 10px;" v-show="!create_task">
                                    <a href="javascript:void(0)" @click="create_task = true">
                                        <Icon type="ios-add-circle" style="float: left;font-size: 22px;"></Icon>
                                        <span style="float: left;margin-top: 2px; margin-left: 5px;">添加子任务</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content" style="margin-bottom: 0">
                        <div class="detail-white-card task-detail-handler-wrap no-border">
                            <div class="task-detail-handler-set">
                                <Row>
                                    <i-col>
                                        <div class="note-aside muted">
                                            <Icon type="md-link" size="24"></Icon>
                                            <span class="title">关联的文件</span>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content" style="margin-bottom: 0">
                        <div class="detail-white-card task-detail-handler-wrap no-border">
                            <div class="task-detail-handler-set text-default" style="padding-left: 0;">
                                <Row>
                                    <i-col>
                                        <ul class="file-list" v-if="file_list.length > 0">
                                            <li class="link" v-for="(file,index) in file_list" :key="index">
                                                <div class="link-head">
                                                    <div class="link-content m-r-sm">
                                                        <svg class="icon link-icon" aria-hidden="true">
                                                            <use :href="formatFile(file.extension)"></use>
                                                        </svg>
                                                    </div>
                                                    <div class="link-title link-content" @click="downloadFile(file.id)">
                                                       <span>
                                                        {{ file.title }}
                                                        </span>
                                                    </div>
                                                    <div class="link-content pull-right" style="margin-top: 8px;">
                                                        <Dropdown trigger="click"
                                                                  @on-click="file_id = file.id,file_index = index,delete_file_modal = !delete_file_modal">
                                                            <a href="javascript:void(0)" class="muted">
                                                                操作
                                                                <Icon type="arrow-down-b"></Icon>
                                                            </a>
                                                            <Dropdown-menu slot="list">
                                                                <Dropdown-item>删除</Dropdown-item>
                                                            </Dropdown-menu>
                                                        </Dropdown>
                                                    </div>

                                                </div>

                                            </li>
                                        </ul>
                                        <!-- <Table :width="auto" :show-header="false" :columns="file_columns" :data="file_list"></Table>-->
                                    </i-col>
                                </Row>
                                <div class="task-file-upload">
                                    <Upload ref="upload"
                                            :action="upload_config.url"
                                            :name="upload_config.name"
                                            :headers="upload_config.headers"
                                            :data="task"
                                            :show-upload-list="false"
                                            :on-progress="uploadProgress"
                                            :on-success="uploadSuccess">
                                        <a href="javascript:void(0)">
                                            <Icon type="ios-add-circle" style="float: left;font-size: 22px;"></Icon>
                                            <span style="float: left;margin-top: 2px; margin-left: 5px; ">添加文件</span>
                                        </a>
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="detail-content" style="margin-bottom:0;padding: 0">
                        <div class="detail-white-card task-detail-handler-wrap last-detail-white-card">
                            <div class="task-detail-handler-set task-user-join">
                                <Row>
                                    <i-col>
                                        <div style="margin-bottom: 5px;">参与者</div>
                                        <div class="note-aside">
                                            <Tooltip placement="top" :content="user.user_info.realname"
                                                     v-for="(user,index) in task_user_list.list"
                                                     :key="index">
                                                <img class="avatar img-circle img-24 pull-left item-avatar"
                                                     style="margin-top: 4px;"
                                                     :src="user.user_info.avatar" alt="">
                                            </Tooltip>
                                            <!--   <Poptip title="提示标题" content="提示内容" placement="bottom">
                                                   <a  href="javascript:void(0)">
                                                       <Icon type="ios-add-circle" class="text-navy " style="font-size: 26px;"></Icon>
                                                   </a>
                                                   <div class="api" slot="content">
                                                       <p class="m-b-sm">添加成员</p>
                                                       <div>
                                                             <span class="avatar img-circle img-24 pull-left m-r-sm "
                                                     style="background-image: url(https://striker.teambition.net/thumbnail/110t8768eb3af2155ab8eadce6ce01c98e21/w/200/h/200);"></span>
                                                           <span class="muted" style="line-height: 25px;">vilson</span>
                                                       </div>
                                                   </div>
                                               </Poptip>-->
                                            <div style="display: inline-block">
                                                <Dropdown :transfer="true" trigger="click"
                                                          @on-click="addTaskUser">
                                                    <a href="javascript:void(0)">
                                                        <Icon type="ios-add-circle" class="text-navy "
                                                              style="font-size: 26px;"></Icon>
                                                    </a>
                                                    <Dropdown-menu slot="list" class="task-user-list">
                                                        <p class="m-sm">添加成员・{{ project_user_list.length }}</p>
                                                        <!--<Dropdown-item style="height: 40px; ">-->
                                                        <!--<Icon type="ios-person" class="pull-left"-->
                                                        <!--style="font-size: 24px;"></Icon>-->
                                                        <!--<span class="pull-left task-user-item"> 所有成员・{{ project_user_list.length }} </span>-->
                                                        <!--</Dropdown-item>-->
                                                        <Dropdown-item
                                                                v-for="(user,index) in project_user_list" :key="index"
                                                                :name="user.u_user_id">
                                                            <img class="avatar img-circle img-24 pull-left item-avatar"
                                                                 :src="user.avatar">
                                                            <span class="muted"
                                                                  style="line-height: 25px;">{{ user.realname }}</span>
                                                            <Icon type="ios-checkmark" v-if="user.is_add"></Icon>
                                                        </Dropdown-item>
                                                    </Dropdown-menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="task-detail-handler-set" style="border-top:1px solid #f2f2f2">
                                <Row>
                                    <i-col class="activities-timeline early-shown">
                                        <div class="activities-list-wrap">
                                            <div class="activity-early-wrap"><a
                                                    class="activity-early-handler link-add-handler">
                                                <span class="activity-early-hidden" @click="getTaskLogList(1)"
                                                      v-if="task_log_list.count > 5 && task_log_list.list.length <= 5">显示较早的 {{ task_log_list.count - 5}} 条动态</span>
                                                <span v-if="task_log_list.count > 5 && task_log_list.list.length > 5"
                                                      @click="getTaskLogList()"
                                                      class="activity-early-shown">隐藏较早的动态</span>
                                                <!--<span-->
                                                <!--class="activity-early-loading">正在载入更早的动态...</span>-->
                                            </a></div>
                                            <ul class="activities-list">
                                                <li class="activity creator"
                                                    v-for="(task_log,index) in task_log_list.list" :key="index">
                                                    <div v-if="task_log.log_type != 'comment'">
                                                        <i :class="showLogIcon(task_log.log_type)"
                                                           class="ivu-icon pull-left muted"></i>
                                                        <div class="react-time-stamp muted pull-right hinted">
                                                            <Tooltip placement="top"
                                                                     :content="showTaskLogTime(task_log.create_time,false)">
                                                                <time class="time-stamp">
                                                                    {{ showTaskLogTime(task_log.create_time, true) }}
                                                                </time>
                                                            </Tooltip>
                                                        </div>
                                                        <div class="activity-body-coyness readable muted">
                                                            <span> {{ task_log.realname + ' ' + task_log.content }} </span>
                                                            <div class="activity-content overflow"
                                                                 @click="showLogContent($event)"
                                                                 v-if="task_log.content">
                                                                <blockquote class="activity-description"
                                                                            v-html="task_log.memo"></blockquote>
                                                                <blockquote class="activity-content-detail"
                                                                            v-html="task_log.memo"></blockquote>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <img :src="task_log.user_info.avatar"
                                                             class="comment-avatar avatar img-circle img-24 pull-left m-r-sm"
                                                             alt="">
                                                        <div class="react-time-stamp muted pull-right hinted">
                                                            <Tooltip placement="top"
                                                                     :content="showTaskLogTime(task_log.create_time,false)">
                                                                <time class="time-stamp">
                                                                    {{ showTaskLogTime(task_log.create_time, true) }}
                                                                </time>
                                                            </Tooltip>
                                                        </div>
                                                        <div class="activity-body-coyness readable muted">
                                                            <span> {{ task_log.realname }} </span>
                                                            <div class="activity-content overflow">
                                                                <p class="task-comment-content"
                                                                   v-html="task_log.memo"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div class="member-tip-wrap"></div>
                                            <div class="involve-tip-wrap"></div>
                                            <div class="activities-place-bottom"></div>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div slot="footer">
                    </div>
                </vue-scroll>
                <div class="task-comment">
                    <Input type="textarea" :rows="comment_rows" class="comment-content" v-model="task_comment"
                           placeholder="发表评论，按回车换行" style="width: 480px"></Input>
                    <Button type="primary" :disabled="task_comment==''" @click="commitComment"
                            style="width: 70px;margin-left: 10px;">评论
                    </Button>
                </div>
            </Modal>
            <Modal
                    v-model="delete_file_modal"
                    title="操作提示">
                <p>确定要永远删除这个文件吗？删除后无法恢复</p>
                <div slot="footer">
                    <Button type="text" @click="delete_file_modal = false">再想想</Button>
                    <Button type="error" :loading="send_loading" @click="confirmDeleteTaskFile">删了</Button>
                </div>
            </Modal>
            <Modal
                    v-model="delete_task_modal"
                    title="操作提示">
                <p>确定要删除当前任务吗？删除后无法恢复</p>
                <div slot="footer">
                    <Button type="text" @click="delete_task_modal = false">再想想</Button>
                    <Button type="error" :loading="send_loading" @click="confirmDeleteTask">删了</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import * as utils from '../assets/js/utils'
    import $ from 'jquery'
    import editor from './editor_2.0.vue'
    import {format} from "../assets/js/file_format";
    import * as dateTime from "../assets/js/date_time";
    import * as Time from '../assets/js/time_format';
    import {SlickList, SlickItem} from 'vue-slicksort';
    import {
        getTaskInfo,
        getTaskTypeList,
        getTaskLevel,
        getTaskExecuteStateList,
        getTaskTagList,
        editTask,
        setTaskState,
        delTask,
        getTaskLog,
        getTaskUserList,
        getUserList,
        addTaskExecutorUser,
        addTaskUser,
        delTaskFile,
        getTaskFileList,
        addTask,
        exchangeTaskSort,
        addTaskComment,
        editTaskComment,
        delTaskComment,
        createTaskTag,
        editTaskTag,
    } from "@/api/project";

    export default {
        components: {
            editor,
            SlickList,
            SlickItem
        },
        props: {
            showModal: {
                default: false
            },
            task_id: {
                default: 0
            }
        },
        data() {
            return {
                ops: {
                    vuescroll: {
                        mode: 'native'
                    },
                    scrollPanel: {
                        scrollingX: false,
                    },
                    bar: {
                        delayTime: 500,
                        onlyShowBarOnScroll: false,
                        background: "#cecece",
                        keepShow: false,
                        opacity: 1,
                        hover: false
                    }
                },
                loading: true,
                detail_modal: this.showModal,
                task: {
                    project_info: {
                        name: ''
                    }
                },
                show_edit_task_tag: false,
                edit_task_tag_id: 0,
                edit_task_tag_index: 0,
                add_tag_color: 'blue',
                tag_color_list: ['blue', 'red', 'orange', 'green', 'brown', 'purple'],
                tag_search: '',
                tag_search_temp: '',
                task_comment: '',
                comment_rows: 1,
                create_task: false,
                new_task: {
                    pid: 0,
                    name: '',
                    desc: '',
                    task_type: 0
                },
                default_executor: {},
                add_task_loading: false,
                edit_task_id: 0,
                task_name: '',
                task_user_list: {
                    list: []
                },
                task_type_list: [],
                task_level_list: [],
                task_execute_state_list: [],
                task_tag_list: [],
                task_tag_list_temp: [],
                project_user_list: [],
                task_log_list: [],
                delete_task_modal: false,
                show_name_edit: false,
                show_task_user: false,
                send_loading: false,

                open: false,
                begin_open: false,
                remind_open: false,
                date_picker_data: {
                    task_begin_time: '',
                    task_end_time: '',
                    task_remind_time: '',
                    task_begin_time_format: '',
                    task_end_time_format: '',
                },
                task_begin_time: '',
                task_end_time: '',
                task_remind_time: '',
                remind_content: '点击设置提醒时间',

                hidden_task_content: true,
                editor_style: {
                    width: 'auto',
                    height: 'auto'
                },
                uploadImgUrl: utils.getUploadUrl('Project_Task.uploadContentImg'),
                uploadHeaders: {
                    token: utils.getStore('token')
                },
                uploadParams: {
                    task_id: 0
                },
                menus: [
                    'head',	// 标题
                    'bold',	// 粗体
                    'italic',	// 斜体
                    'aligncenter',	// 居中
                    'img',	// 图片
                    'link',	// 链接
                    'unorderlist',	// 无序列表
                    'orderlist',	// 有序列表
                    'quote',	// 引用
                    'table',	// 表格
                    '|',
                    'fullscreen'	// 全屏
                ],

                file_id: 0,
                file_index: 0,
                file_list: [],
                delete_file_modal: false,
                upload_config: {
                    url: utils.getApiUrl('Project_Task.uploadTaskFile'),
                    headers: {
                        token: utils.getStore('token')
                    },
                    name: 'file',
                },
            }
        },
        created() {
        },
        watch: {
            showModal: function (value) {
                this.detail_modal = value
                if (value) {
                    this.init();
                }
            },
            detail_modal: function (value) {
                this.$emit('on-modal-change', value);
            },
            task_id: function () {
                // this.init();
            },
            task: function (value) {
                this.$emit('on-task-update', value, 'update')
            },
            show_name_edit: function (value) {
                if (value) {
                    $(".task-input input").focus()
                }
            },
            task_comment(value) {
                const count = value.split("\n").length;
                if (count <= 10) {
                    this.comment_rows = count;
                }
            },
            tag_search(val){
                this.tag_search_temp = JSON.parse(JSON.stringify(val));
                this.searchTag();
            }
        },
        methods: {
            init(task_id) {
                if (task_id) {
                    this.task_id = task_id;
                }
                this.create_task = false;
                this.file_list = [];
                this.task_log_list = [];
                this.task_user_list = {
                    list: []
                };
                this.date_picker_data = {
                    task_begin_time: '',
                    task_end_time: '',
                    task_remind_time: '',
                    task_begin_time_format: '',
                    task_end_time_format: '',
                    task_remind_time_format: '',
                };

                this.hidden_task_content = true;
                //当前任务信息
                this.getInfo(this.task_id,true);
                //获取等级列表
                this.getTaskLevel();
                //获取任务执行状态列表
                this.getTaskExecuteState();
                //任务日志
                this.getTaskLogList();
                //任务成员
                this.showTaskUserList();
                //任务文件列表
                this.getTaskFileList();
            },
            //准备添加任务
            addTask() {
                console.log(this.new_task);
                if (this.new_task.name === '') {
                    this.$Message.warning('任务内容不能为空', 2);
                    return false
                }
                this.new_task.task_type = this.task.task_type;
                this.new_task.project_id = this.task.project;
                this.new_task.pid = this.task.id;
                this.doAddTask();
            },
            //添加任务
            doAddTask() {
                let app = this;
                if (app.add_task_loading) {
                    app.$Message.warning('正在添加任务，请稍后...', 2);
                    return false;
                }
                setTimeout(function () {
                    if (app.add_task_loading === true) {
                        app.$Message.loading({
                            content: '正在添加任务，请稍后...',
                            duration: 5
                        })
                    }
                }, 2000);
                app.add_task_loading = true;
                app.new_task.executor_id = app.default_executor.id;
                addTask(app.new_task).then(res => {
                    app.add_task_loading = false;
                    app.$Message.destroy();
                    const result = utils.showBack(res);
                    if (result) {
                        app.getInfo(app.task.id);
                        app.new_task = {
                            name: '',
                            desc: '',
                            task_type: 0
                        };
                        app.getTaskLogList();
                    }
                });
            },
            SlickEvent(list) {
                console.log(list);
                const send = [];
                list.forEach(function (v, k) {
                    if (v.task_state == 0) {
                        send.push(v.id);
                    }
                });
                exchangeTaskSort(JSON.stringify(send));
            },
            selectExecutor(project_user_index) {
                let app = this;
                console.log(project_user_index);
                app.default_executor = app.project_user_list[project_user_index]
            },
            getInfo(task_id,init = false) {
                let app = this;
                if (!task_id) {
                    task_id = app.task_id;
                }
                getTaskInfo(task_id).then(res => {
                    app.task = res.data;
                    if (init) {
                        app.initContent(app.task.desc);
                    }
                    app.getProjectUserList(app.task.project);
                    //获取任务类型列表
                    app.getTaskType(app.task.project);
                    //获取任务标签列表
                    this.getTaskTag(app.task.project);
                    app.date_picker_data.task_begin_time = app.task.begin_time;
                    app.date_picker_data.task_end_time = app.task.end_time;
                    app.date_picker_data.task_remind_time = app.task.remind_time;
                    if (app.task.begin_time) {
                        let begin_time = new Date(app.task.begin_time).getTime() / 1000;
                        app.date_picker_data.task_begin_time_format = app.showTaskSettingTime(begin_time)
                    }
                    if (app.task.end_time) {
                        let end_time = new Date(app.task.end_time).getTime() / 1000;
                        app.date_picker_data.task_end_time_format = app.showTaskSettingTime(end_time)
                    }
                    if (app.task.remind_time) {
                        let remind_time = new Date(app.task.remind_time).getTime() / 1000;
                        app.date_picker_data.task_remind_time_format = app.showTaskSettingTime(remind_time)
                    }
                    if (app.date_picker_data.task_remind_time_format) {
                        app.remind_content = app.date_picker_data.task_remind_time_format + ' ' + '提醒'
                    } else {
                        app.remind_content = '点击设置提醒时间'
                    }
                });
            },
            searchTag() {
                let app = this;
                let new_task_tag_list = [];
                app.task_tag_list = app.task_tag_list_temp;
                if (app.tag_search.trim()){
                    app.task_tag_list.forEach(function (item, k) {
                        if (item.name.indexOf(app.tag_search) !== -1) {
                            new_task_tag_list.push(item);
                        }
                    });
                    console.log(new_task_tag_list)
                    app.task_tag_list = new_task_tag_list;
                }
            },
            showTaskCount(list, state) {
                let count = 0;
                if (!list) {
                    return count;
                }
                if (state == -1) {
                    count = list.length;
                } else {
                    list.forEach(function (v, k) {
                        if (v.task_state == state) {
                            count++;
                        }
                    });
                }
                return count;
            },
            //获取任务类型列表
            getTaskType(project_id) {
                let app = this;
                getTaskTypeList(project_id).then(res => {
                    app.task_type_list = res.data.list
                });
            },
            createTaskTag() {
                let app = this;
                if (!app.tag_search) {
                    app.$Message.warning('标签名不能为空');
                    return false;
                }
                let result = true;
                if (app.edit_task_tag_id) {
                    editTaskTag(app.edit_task_tag_id, app.tag_search, app.add_tag_color).then(res=>{
                        result = utils.showBack(res);
                        if (result) {
                            const name =  JSON.parse(JSON.stringify(app.tag_search_temp));
                            const color =  JSON.parse(JSON.stringify(app.add_tag_color));
                            app.task_tag_list_temp[app.edit_task_tag_index].name = name;
                            app.task_tag_list_temp[app.edit_task_tag_index].color = color;
                            app.task_tag_list = app.task_tag_list_temp;
                            app.getTaskTag(app.task.project);
                        }
                    });
                }else{
                    createTaskTag(app.task.id, app.task.project, app.tag_search, app.add_tag_color).then(res => {
                        result = utils.showBack(res);
                        if (result) {
                            let color_value = '';
                            switch (app.add_tag_color) {
                                case 'blue':
                                    color_value = '#2d8cf0';
                                    break;
                                case 'red':
                                    color_value = '#ed3f14';
                                    break;
                                case 'orange':
                                    color_value = '#ff9900';
                                    break;
                                case 'green':
                                    color_value = '#19be6b';
                                    break;
                                case 'brown':
                                    color_value = '#2fbdb3';
                                    break;
                                case 'purple':
                                    color_value = '#797ec9';
                                    break;
                            }
                            const tag = {
                                id: res.data,
                                name: JSON.parse(JSON.stringify(app.tag_search_temp)),
                                color: JSON.parse(JSON.stringify(app.add_tag_color)),
                                color_value: color_value
                            };
                            app.task_tag_list.unshift(tag);
                            app.task_tag_list_temp.unshift(tag);
                            app.addTaskTag(0);
                        }
                        // app.getTaskTag(app.task.project);
                    });
                }
                if (result) {
                    setTimeout(function () {
                        app.tag_search = '';
                        app.add_tag_color = 'blue';
                        app.show_edit_task_tag = false;

                        app.edit_task_tag_id = 0;
                        app.edit_task_tag_index = 0;
                    },500);
                }
            },
            getTaskLevel() {
                let app = this;
                getTaskLevel().then(res => {
                    app.task_level_list = res.data
                });
            },
            getTaskExecuteState() {
                let app = this;
                getTaskExecuteStateList().then(res => {
                    app.task_execute_state_list = res.data
                });
            },
            getTaskTag(project_id) {
                let app = this;
                getTaskTagList(project_id).then(res => {
                    app.task_tag_list = res.data;
                    app.task_tag_list_temp = JSON.parse(JSON.stringify(res.data));
                });
            },
            tagListViewChange(value){
                let app = this;
                if (!value) {
                    setTimeout(function () {
                        app.tag_search = '';
                        app.show_edit_task_tag = false;
                        app.edit_task_tag_id = 0;
                        app.edit_task_tag_index = 0
                    },500);
                }
            },
            changeTaskType(index) {
                let app = this;
                const type = app.task_type_list[index].id;
                const type_name = app.task_type_list[index].name;
                let task_data = {
                    task_id: app.task_id,
                    task_type: type
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.task.task_type = type;
                        app.task.task_type_name = type_name;
                        app.$emit('on-task-update', app.task, 'change_task_type', index);
                        app.getTaskLogList()
                    }
                });
            },
            setTaskState(task, emit = true) {
                let app = this;
                task.task_state = task.task_state == 0 ? 1 : 0;
                setTaskState(task.id, task.task_state).then(res => {
                    const result = utils.showBack(res);
                    if (result && emit) {
                        app.$emit('on-task-update', task, 'update', index);
                    }
                    app.getTaskLogList();
                });
            },
            commitComment() {
                let app = this;
                const comment = this.task_comment.trim();
                if (!comment) {
                    app.$Message.warning('至少说点啥吧~')
                    return false;
                }
                addTaskComment(app.task_id, comment).then(res => {
                    app.task_comment = '';
                    app.getTaskLogList();
                    app.task.has_comment = true;
                });
            },
            changeTaskLevel(index) {
                let app = this;
                const level = app.task_level_list[index].key;
                if (level === app.task.pri) {
                    return false
                }
                const level_name = app.task_level_list[index].name;
                const show_type = app.task_level_list[index].show_type;
                const task_data = {
                    task_id: app.task_id,
                    task_level: level
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.task.pri = level;
                        app.task.task_level_name = level_name;
                        app.task.task_level_show_type = show_type;
                        app.$emit('on-task-update', app.task, 'update', index);
                        app.getTaskLogList()
                    }
                });
            },
            changeTaskExecute(index) {
                let app = this;
                const state = app.task_execute_state_list[index].key;
                if (state === app.task.execute_state) {
                    return false
                }
                const state_name = app.task_execute_state_list[index].name;
                const task_data = {
                    task_id: app.task_id,
                    execute_state: state
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.task.task_execute = app.task_execute_state_list[index];
                        app.task.execute_state = state;
                        app.task.task_execute_name = state_name;
                        app.$emit('on-task-update', app.task, 'update', index);
                        app.getTaskLogList();
                    }
                });
            },
            editName(task) {
                let app = this;
                this.show_name_edit = false;
                if ($.trim(task.name) === '') {
                    task.name = app.task_name;
                    return false
                }
                const task_data = {
                    task_id: task.id,
                    title: task.name
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.getInfo();
                        app.getTaskLogList();
                    }
                });
            },
            confirmDeleteTask() {
                let app = this;
                this.send_loading = true;
                delTask(app.task_id).then(res => {
                    app.send_loading = false;
                    app.delete_task_modal = false;
                    app.detail_modal = false;
                    app.$emit('on-task-update', null, 'deleteTask');
                    app.$Message.success('任务已删除')

                });
            },
            getTaskLogList(show_all) {
                let app = this;
                if (show_all === undefined) {
                    show_all = 0
                }
                getTaskLog(app.task_id, show_all).then(res => {
                    app.task_log_list = res.data
                });
            },
            showTaskUserList() {
                let app = this;
                getTaskUserList(app.task_id).then(res => {
                    app.task_user_list = res.data;
                    app.default_executor = app.task_user_list.executor;
                });
            },
            getProjectUserList(project_id) {
                let app = this;
                getUserList(project_id, '', app.task_id).then(res => {
                    app.project_user_list = res.data.list;
                });
            },
            addTaskExecutorUser(user_id, task_id) {
                let app = this;
                console.log(user_id);
                console.log(task_id);
                if (!task_id) {
                    task_id = app.task.id;
                }
                addTaskExecutorUser(task_id, user_id).then(res => {
                    let result = utils.showBack(res, true);
                    if (result) {
                        //todo 暂时先重新获取全部列表，后期优化
                        app.getInfo();
                        app.getTaskLogList();
                        app.showTaskUserList()
                    }
                });
            },
            addTaskUser(user_id) {
                let app = this;
                addTaskUser(app.task.id, user_id).then(res => {
                    const result = utils.showBack(res, true);
                    if (result) {
                        app.getTaskLogList();
                        app.showTaskUserList();
                        app.getProjectUserList(app.task.project)
                    }
                });
            },
            handleClick(type) {
                if (type === 'begin') {
                    this.begin_open = !this.begin_open
                } else if (type === 'end') {
                    this.open = !this.open
                } else {
                    this.remind_open = !this.remind_open
                }
            },
            handleOk(type) {
                if (type === 'begin') {
                    this.begin_open = !this.begin_open
                } else if (type === 'end') {
                    this.open = !this.open
                } else {
                    this.remind_open = !this.remind_open
                }
                this.editTaskTime()
            },
            handleClear(type) {
                if (type === 'begin') {
                    this.begin_open = false
                } else if (type === 'end') {
                    this.date_picker_data.task_end_time = 'null';
                    this.open = false
                } else {
                    this.date_picker_data.task_remind_time = 'null';
                    this.remind_open = false
                }
                this.editTaskTime()
            },
            handleChange(date) {
                let app = this;
                this.date_picker_data.task_end_time = date;
                let task_end_time = new Date(date).getTime() / 1000;
                this.date_picker_data.task_end_time_format = this.showTaskSettingTime(task_end_time)
            },
            handleRemindChange(date) {
                let app = this;
                this.date_picker_data.task_remind_time = date;
                let task_remind_time = new Date(date).getTime() / 1000;
                this.date_picker_data.task_remind_time_format = this.showTaskSettingTime(task_remind_time)
            },
            handleBeginChange(date) {
                let app = this;
                this.date_picker_data.task_begin_time = date;
                if (date) {
                    let task_begin_time = new Date(date).getTime() / 1000;
                    this.date_picker_data.task_begin_time_format = this.showTaskSettingTime(task_begin_time)
                } else {
                    this.date_picker_data.task_begin_time_format = ''
                }
            },
            showRemindContent() {
                if (this.date_picker_data.task_remind_time_format) {
                    this.remind_content = this.date_picker_data.task_remind_time_format
                } else {
                    this.remind_content = '点击设置提醒时间'
                }
            },
            editTaskTime() {
                let app = this;
                this.show_name_edit = false;
                if ($.trim(app.task.name) === '') {
                    app.task.name = app.task_name;
                    return false
                }
                const task_data = {
                    task_id: app.task_id,
                    begin_time: app.date_picker_data.task_begin_time,
                    end_time: app.date_picker_data.task_end_time,
                    remind_time: app.date_picker_data.task_remind_time
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.getInfo();
                        app.getTaskLogList()
                    }

                });
            },
            showTaskSettingTime(time) {
                if (typeof time == "string") {
                    time = new Date(time).getTime() / 1000;
                }
                if (time > 0) {
                    let show_time = utils.format_date(time, false);
                    return show_time.month + '月' + show_time.day + '日' + show_time.hour + ':' + show_time.minute
                }
            },
            editorLoad(originalName, resultText) {
                // resultText 服务器端返回的text
                // originalName 上传文件名
                this.$refs.vueWangeditor.insertImg(resultText)
            },
            editorChange(a) {
//                console.log(a)
            },
            initContent(value) {
                if (value) {
                    this.$refs.vueWangeditor.setHtml(value)
                } else {
                    this.$refs.vueWangeditor.setHtml('')
                }
            },
            saveContent() {
                let app = this;
                let content = app.$refs.vueWangeditor.getHtml();
                const task_data = {
                    task_id: app.task_id,
                    content: content
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.task.desc = content;
                        app.hidden_task_content = !app.hidden_task_content;
                        app.getTaskLogList();
                        if (content !== '') {
                            app.task.has_content = true
                        } else {
                            app.task.has_content = false
                        }
                        app.$emit('on-task-update', app.task, 'update');
                    }
                });
            },
            downloadFile(file_id) {
                window.open(utils.getDirectUrl('Project_Task.downloadTaskFile&file_id=' + file_id))
            },
            confirmDeleteTaskFile() {
                let app = this;
                this.send_loading = true;
                delTaskFile(app.file_id).then(res => {
                    app.send_loading = false
                    app.delete_file_modal = false
                    app.file_list.splice(app.file_index, 1)
                    if (app.file_list.length <= 0) {
                        app.task.has_file = false
                        app.$emit('on-task-update', app.task, 'update');
                    }
                });
            },
            formatFile(file_ext) {
                return format(file_ext)
            },
            getTaskFileList() {
                let app = this;
                getTaskFileList(app.task_id).then(res => {
                    app.file_list = res.data.list;
                    if (app.file_list.length <= 0) {
                        app.task.has_file = false;
                        app.$emit('on-task-update', app.task, 'update');
                    }
                });
            },
            uploadProgress(event, file, fileList) {
                let app = this;
                this.send_loading = true;
                setTimeout(function () {
                    if (app.send_loading) {
                        app.$Message.loading({
                            content: '正在上传，请稍后...',
                            duration: 10
                        })
                    }
                }, 500)
            },
            uploadSuccess(response, file, fileList) {
                let result = utils.showBack(response);
                this.send_loading = false;
                if (result) {
                    this.$Message.destroy();
                    this.$Message.success({
                        content: '上传文件成功',
                        duration: 3
                    });
                    this.task.has_file = true;
                    this.$emit('on-task-update', this.task, 'update');
                    this.getTaskFileList();
                    this.getTaskLogList()
                } else {
                    this.$Message.destroy();
                    this.$Message.error({
                        content: response.msg,
                        duration: 3
                    });
                    this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
                }
            },
            showEditTaskTag(task_tag){
                this.show_edit_task_tag = true;
                this.edit_task_tag_id = task_tag.id;
                this.add_tag_color = JSON.parse(JSON.stringify(task_tag.color));
                this.tag_search = JSON.parse(JSON.stringify(task_tag.name));
            },
            showTaskSelect(task_key) {
                let app = this;
                let task_list = [];
                $.each(app.task.task_tag_item_list, function (k, v) {
                    task_list.push(v.id)
                });
                const task_index = $.inArray(task_key, task_list);
                return task_index >= 0;
            },
            removeTaskTag(event, task_index) {
                let app = this;
                let task_tag = [];
                app.task.task_tag_item_list.splice(task_index, 1);
                $.each(app.task.task_tag_item_list, function (k, v) {
                    task_tag.push(v.id)
                });
                const task_data = {
                    task_id: app.task_id,
                    task_tag: JSON.stringify(task_tag)
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res)
                    if (result) {
                        app.$emit('on-task-update', app.task, 'update', task_index)
                        app.getTaskLogList()
                    }
                });
            },
            addTaskTag(index) {
                let app = this;
                if(!app.show_edit_task_tag && app.edit_task_tag_id){
                    return false;
                }
                let task_list = [];
                let task_tag_key = app.task_tag_list[index].id;
                let task_tag = app.task_tag_list[index];
                $.each(app.task.task_tag_item_list, function (k, v) {
                    task_list.push(v.id)
                });
                const task_index = $.inArray(task_tag_key, task_list);
                if (task_index >= 0) {
                    app.task.task_tag_item_list.splice(task_index, 1)
                } else {
                    app.task.task_tag_item_list.push(task_tag)
                }
                task_list = [];
                $.each(app.task.task_tag_item_list, function (k, v) {
                    task_list.push(v.id)
                });
                const task_data = {
                    task_id: app.task_id,
                    task_tag: JSON.stringify(task_list)
                };
                editTask(task_data).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.$emit('on-task-update', app.task, 'update', index);
                        app.getTaskLogList()
                    }
                });
            },
            showLogIcon(log_type) {
                switch (log_type) {
                    case 'date':
                        return 'ivu-icon-ios-clock-outline';
                    case 'add':
                        return 'ivu-icon-md-add';
                    case 'child_task':
                        return 'ivu-icon-ios-list';
                    case 'done':
                        return 'ivu-icon-md-checkmark';
                    case 'again':
                        return 'ivu-icon-md-refresh';
                    case 'upload':
                        return 'ivu-icon-md-link';
                    case 'title':
                        return 'ivu-icon-edit';
                    case 'content':
                        return 'ivu-icon-ios-paper-outline';
                    case 'add_member':
                        return 'ivu-icon-md-person-add';
                    case 'remove_member':
                        return 'ivu-icon-ios-close-outline';
                    case 'add_executor':
                        return 'ivu-icon-md-person';
                    case 'task_type':
                        return 'ivu-icon-md-sync';
                    case 'task_level':
                        return 'ivu-icon-ios-radio-button-off';
                    case 'task_tag':
                        return 'ivu-icon-ios-pricetag';
                    case 'task_execute':
                        return 'ivu-icon-ios-stopwatch-outline';
                    case 'remove_user':
                        return 'ivu-icon-md-person'
                }
            },
            showLogContent(event) {
                const content = $(event.target);
                const dom = content.parent();
                const is_overflow = dom.hasClass('overflow');
                if (is_overflow) {
                    dom.removeClass('overflow')
                } else {
                    dom.addClass('overflow')
                }
            },
            showTaskLogTime(time, prettyTime) {
                if (prettyTime) {
                    return Time.showBeforeTime(time)
                } else {
                    return Time.showBeforeTime(time, false)
                }
            },
            showTaskTime(begin_time, end_time) {
                return dateTime.showTaskTime(begin_time, end_time)
            },
        },
    }
</script>
<style>
    .task-detail-modal .task-comment {
        position: absolute;
        bottom: 0px;
        width: 600px;
        padding: 15px;
        z-index: 2;
        background: #FFF;
    }

    .task-detail-modal .comment-content {

    }

    .task-detail-modal .task-comment-content {
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
    }

    .task-detail-modal .comment-avatar {
        position: absolute;
        left: 5px;
        width: 34px;
        height: 34px;
    }

    .ivu-select-dropdown {
        z-index: 2000 !important;
        max-height: inherit !important;
    }

    .task-detail-modal .ivu-modal {
        top: 50px;
    }

    .task-detail-modal .ivu-modal-content {
        /*max-height: 100vh !important;*/
        height: 85vh !important;
        /*background-color: #f7f7f7;*/
        /*max-height: 855px;*/
        overflow-y: hidden !important;
        overflow-x: hidden;
        /*overflow: inherit !important;*/
        border-radius: 3px;
    }

    .task-detail-modal .ivu-modal-header {
        padding-bottom: 0;
        border-bottom: none;
    }

    .task-detail-modal .ivu-modal-header .task-header-title {
        display: inline-block;
        background-color: #F5F5F5;
        padding: 5px 8px;
        font-size: 14px;
    }

    .task-detail-modal .ivu-modal-body {
        padding: 10px 0 0;
        background: #FFF;
        height: 75vh !important;
    }

    .task-detail-modal .ivu-modal-footer {
        border-top: none;
        display: none;
    }

    .task-detail-modal .detail-white-card {
        background-color: #fff;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        border-radius: 3px;
    }

    .task-detail-modal .detail-content {
        margin-bottom: 10px;
        padding: 0 10px;
        width: 600px;
    }

    .task-detail-modal .task-content {
        float: left;
        margin-top: 2px;
        margin-left: 20px;
        cursor: pointer;
        width: 95%;
        padding: 5px;
    }

    .task-detail-modal .note-aside {
        display: flex;
        align-items: center;
    }

    .task-detail-modal .note-aside .title {
        padding-left: 10px;
        padding-right: 10px;
        width: 100px;
    }

    .task-detail-modal .task-type-list .ivu-select-dropdown {
        width: 150px;
    }

    .task-detail-modal .task-level-list .ivu-select-dropdown {
        width: 200px;
    }

    .task-detail-modal .task-tag-list .ivu-select-dropdown {
        width: 250px;
    }

    .task-tag-list .tag-search {
        padding: 10px;
    }
    .task-tag-list .inline-btn {
        width: calc(100%/2 - 10px);
        margin-left: 4px;
        margin-right: 4px;
    }

    .task-tag-list .tag-list-item{
        position: relative;
        padding-left: 20px;
    }
    .task-tag-list .tag-list-item .tag-icon{
        position: absolute;
        top: 10px;
        right: 20px;
    }
    .task-tag-list .tag-list-item .tag-icon .ivu-icon{
        vertical-align: middle;
        padding-left: 5px;
    }

    .task-tag-list .tag-search .tag-search-input {
        width: 200px;
    }

    .task-tag-list .tag-search .tag-search-icon {
        font-size: 20px;
        padding-left: 5px;
        vertical-align: middle;
    }

    .task-tag-list .tag {
        position: relative;
    }

    .task-tag-list .tag:before {
        left: -5px !important;
    }

    .task-tag-list .color-picker {
        padding: 10px 15px;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .task-tag-list .color-disc {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        position: relative;
    }

    .task-tag-list .color-disc .ivu-icon {
        color: #fff;
        top: 7px;
        position: absolute;
        right: 7px;
    }

    .task-detail-modal .task-content:hover {
        background: #F7F7F7;
    }

    .task-detail-modal .wangEditor-container .wangEditor-txt {
        height: 100% !important;
    }

    .task-detail-modal {
        padding: 10px;
    }

    .last-detail-white-card {
        min-height: 300px;
        margin-bottom: 50px;
        border-radius: 0;
        padding-top: 10px;
        background: #f5f5f5 !important;
        border-bottom: none !important;
    }

    .last-detail-white-card .activities-timeline > div, .activities-timeline > ul {
        background-color: initial;
    }

    .task-detail-modal .task-detail-action {
        margin-top: 4px;
        margin-right: 25px;
        display: inline-block;
        float: right;
    }

    .task-detail .ivu-select-dropdown {
        /*position: relative !important;*/
        /*left: 0 !important;*/
        /*top: 0 !important;*/
    }

    .task-detail-icon {
        position: absolute;
        font-size: 18px;
        top: -1px;
        right: -8px;
    }

    .task-detail-handler-set {
        padding: 0 10px 10px 10px;
    }

    .task-user-join {
        padding-left: 20px;
    }

    .task-user-join .ivu-row {
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
    }

    .task-input {
        text-align: left;
        margin-left: 15px;
    }

    .task-input .ivu-input {
        height: 26px;
    }

    .task-title-wrap {
        padding: 5px;
        margin-top: 15px;
        margin-bottom: 5px;
    }

    .children-task {
        padding-left: 5px;
        z-index: 99999;
    }

    .children-task .ivu-input {
        height: 28px;
    }

    .children-task-title-wrap {
        padding: 5px;
    }

    .children-task-user-list {
        padding-left: 5px;
        width: 200px;
    }

    .task-time {
        /*width: 160px;   */
        height: 24px;
        line-height: 2;
        white-space: nowrap;
        padding-right: 50px;
        padding-left: 10px;
    }

    .task-avatar {
        margin-right: 20px;
        float: right;
        margin-left: 10px;
    }

    .task-title-wrap.done {
        /*background-color: inherit;*/
    }

    .task .task-title-wrap .check-box .ivu-icon.ivu-icon-md-checkmark {
        font-size: 16px;
    }

    .task-title {
        cursor: text;
        border-radius: 3px;
        font-size: 18px;
        font-weight: 400;
        text-align: left;
        width: 100%;
        top: 5px;
        margin-left: 5px;
        padding: 0 5px;
    }

    .children-task-list .task-title {
        font-size: 14px;
    }

    .task-title:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .task-title .ivu-tooltip, .task-title .ivu-tooltip .ivu-tooltip-rel {
        width: 100%;
    }

    .task-base .executor {
        margin-bottom: 5px;
    }

    .task-user-list .avatar {
        float: left;
        margin-right: 10px;
    }

    .task-user-list {
        width: 200px;
    }

    .task-user-list .ivu-icon-ios-checkmark, .children-task-user-list .ivu-icon-ios-checkmark {
        float: right;
        font-size: 24px;
    }

    .task-content-footer {
        text-align: right;
    }

    .task-content-footer button {
        margin-top: 10px;
    }

    .task-date-item {
        float: left;
        padding-right: 15px;
        padding-top: 3px;
    }

    .task-date-item .date-title {
        display: block;
        align-items: center;
    }

    .file-list-title {
        margin-left: 10px;
        margin-top: 20px;
        margin-bottom: 10px;
        position: relative;
    }

    .file-list-span {
        position: absolute;
        top: 2px;
        left: 20px;
    }

    .task-user-item {
        margin-left: 5px;
        margin-top: 5px;
    }

    .task-user-join .item-avatar {
        margin-right: 10px;
    }

    .file-list {
        padding-bottom: 15px;
    }

    .task-file-upload {
        padding: 0;
    }

    .task-file-upload .ivu-icon {
        padding-left: 10px;
    }

    .detail-content .link {
        position: relative;
        padding: 8px 10px 8px 5px;
        cursor: pointer;
        /*border-top: 1px solid rgba(0, 0, 0, 0.1);*/
        background-color: #FFFFFF;
    }

    .detail-content .link:first-child {
        border-top: none;
        border-radius: 3px;
    }

    .detail-content .link:hover {
        background-color: #F7F7F7;
    }

    .detail-content .link-title {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
    }

    .detail-content .link-head {
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .detail-content .link-content {
        display: inline-block;
    }

    .detail-content .link-icon {
        font-size: 32px;
    }
</style>
