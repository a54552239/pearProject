<template xmlns="http://www.w3.org/1999/html">
    <div class="project-setting">
        <Modal v-model="this_modal"
               class="project-setting-modal">
            <p slot="header" class="text-center">
                <span>项目设置</span>
            </p>
            <div class="project-setting-content">
                <Tabs v-model="tab_name" @on-click="changeTabs" :animated="false" style="min-height: 550px">
                    <Tab-pane label="基本设置" name="base_setting">
                        <Form class="setting-form" ref="formValidate" :model="formValidate" :rules="ruleValidate"
                              label-position="top">
                            <Row>
                                <i-col span="12">
                                    <Form-item label="项目名称" prop="name">
                                        <Input v-model="formValidate.name" placeholder="项目名称" type="text"/>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="项目状态" prop="state">
                                        <Select v-model="formValidate.status" placeholder="项目状态" filterable>
                                            <Option v-for="item in project_state_list" :value="item.code"
                                                    :key="item.code" :label="item.name">
                                                <span> {{ item.name }}</span>
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <Form-item label="截止日期" prop="end">
                                        <DatePicker :value="formValidate.end" @on-change="changeEndDate"
                                                    :editable="false" type="date" placeholder="截止日期"
                                                    style="width: 100%"></DatePicker>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="预付日期" prop="prepayDate">
                                        <DatePicker :value="formValidate.prepayDate" @on-change="changePrepayDate"
                                                    :editable="false" type="date" placeholder="预付日期"
                                                    style="width: 100%"></DatePicker>
                                    </Form-item>
                                </i-col>

                            </Row>
                            <Row>
                                <i-col span="12">
                                    <Form-item label="项目类型" prop="type_id">
                                        <Select v-model="formValidate.type_id" placeholder="项目类型" filterable>
                                            <Option v-for="item in type_list" :value="item.id" :key="item.id" :label="item.name">
                                                <span> {{ item.name }}</span>
                                                <!--<span style="float:right;color:#ccc;height: 35px;display: flex;align-items: center;width: 100%;"> {{ item.memo }}</span>-->
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="项目评级" prop="level_id">
                                        <Select v-model="formValidate.level_id" placeholder="项目评级" filterable>
                                            <Option v-for="item in level_list" :value="item.id" :key="item.id" :label="item.level_name">
                                                <span> {{ item.level_name }}</span>
                                                <span style="float:right;color:#ccc"> {{ item.money }}</span>
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <Form-item label="项目标记" prop="ticket">
                                        <Select v-model="formValidate.ticket" placeholder="项目标记" filterable>
                                            <Option v-for="item in ticket_list" :value="item.key" :key="item.key" :label="item.name">
                                                <span> {{ item.name }}</span>
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="项目公开性" prop="access_control_type">
                                        <Select v-model="formValidate.access_control_type" placeholder="项目公开性"
                                                filterable>
                                            <Option value="open">公开</Option>
                                            <Option value="private">私有</Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="24">
                                    <Form-item label="详细描述" prop="project_desc">
                                        <Input v-model="formValidate.project_desc" placeholder="详细描述" type="textarea"/>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <div class="footer-item p-w-sm">
                                <Form-item>
                                    <Button class="middle-btn pull-right" type="primary" size="large"
                                            @click="handleSubmit('formValidate')"
                                            :loading="send_loading">保存
                                    </Button>
                                </Form-item>
                            </div>
                        </Form>
                    </Tab-pane>
                    <Tab-pane label="其他设置" name="other_setting">
                        <Form class="setting-form" ref="formValidateOther" :model="formValidateOther"
                              label-position="top">
                            <Row>
                                <i-col span="12">
                                    <Form-item label="项目进度（%）" prop="schedule">
                                        <InputNumber :max="100" :min="0" :step="10" v-model="formValidateOther.schedule"
                                                     style="width: 100%"></InputNumber>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="项目业务" prop="leader_id">
                                        <Select v-model="formValidateOther.business_id" filterable>
                                            <Option v-for="item in project_user_list" :value="item.u_user_id"
                                                    :key="item.u_user_id" :label="item.realname">
                                                <span> {{ item.realname }}</span>
                                                <span style="float:right;color:#ccc"> {{ item.account }}</span>
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <Form-item label="项目负责人" prop="leader_id">
                                        <Select v-model="formValidateOther.leader_id" filterable>
                                            <Option v-for="item in project_user_list" :value="item.u_user_id"
                                                    :key="item.u_user_id" :label="item.realname">
                                                <span> {{ item.realname }}</span>
                                                <span style="float:right;color:#ccc"> {{ item.account }}</span>
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="项目负责人" prop="leader_id">
                                        <Select v-model="formValidateOther.leader_id" filterable>
                                            <Option v-for="item in project_user_list" :value="item.u_user_id"
                                                    :key="item.u_user_id" :label="item.realname">
                                                <span> {{ item.realname }}</span>
                                                <span style="float:right;color:#ccc"> {{ item.account }}</span>
                                            </Option>
                                        </Select>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <Form-item label="测试信息" prop="test_message">
                                        <Input v-model="formValidateOther.test_message" placeholder="测试信息"
                                               type="textarea"/>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="测试FTP" prop="test_ftp">
                                        <Input v-model="formValidateOther.test_ftp" placeholder="测试FTP"
                                               type="textarea"/>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <Form-item label="上线信息" prop="online_message">
                                        <Tooltip placement="top" content="上线信息">
                                            <Input v-model="formValidateOther.online_message" placeholder="上线信息"
                                                   type="textarea"/>
                                        </Tooltip>
                                    </Form-item>
                                </i-col>
                                <i-col span="12">
                                    <Form-item label="上线FTP" prop="online_ftp">
                                        <Input v-model="formValidateOther.online_ftp" placeholder="上线FTP"
                                               type="textarea"/>
                                    </Form-item>
                                </i-col>
                            </Row>
                            <div class="footer-item p-w-sm">
                                <Form-item>
                                    <Button class="middle-btn pull-right" type="primary" size="large"
                                            @click="handleSubmit('formValidateOther')"
                                            :loading="send_loading">保存
                                    </Button>
                                </Form-item>
                            </div>
                        </Form>
                    </Tab-pane>
                    <Tab-pane label="项目操作" name="task_join">
                        <p class="muted m-b">您可以执行以下操作</p>
                        <Button type="warning" size="large" class="middle-btn m-r" :loading="send_loading"
                                @click="del_user_modal = !del_user_modal">退出
                        </Button>
                        <Button type="error" size="large" class="middle-btn" :loading="send_loading"
                                @click="del_project_modal = !del_project_modal">删除
                        </Button>
                    </Tab-pane>
                </Tabs>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
                v-model="del_user_modal"
                title="操作提示">
            <p>真的要退出本项目吗？ </p>
            <div slot="footer">
                <Button type="text" @click="del_user_modal = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="delProjectUser">退出</Button>
            </div>
        </Modal>
        <Modal
                v-model="del_project_modal"
                title="操作提示">
            <p>真的要删除本项目吗？一旦删除将无法恢复 </p>
            <div slot="footer">
                <Button type="text" @click="del_user_modal = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="delProject">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<style>
    .project-setting-content .ivu-form .ivu-tooltip, .project-setting-content .ivu-form .ivu-tooltip-rel {
        width: 100%;
    }

    .project-setting-modal .ivu-modal-content {
        min-height: 550px;
    }

    .project-setting-modal .ivu-modal-footer {
        display: none;
    }

    .setting-form .ivu-col {
        padding-right: 15px;
    }
</style>
<script>
    import {
        getInfo,
        getLevelList,
        getTicketList,
        getTypeList,
        getStateList,
        getUserList,
        doProject,
        delProjectUser,
        delProject
    } from "@/api/project";


    export default {
        components: {},
        props: {
            showModal: {
                default: false
            },
            project_id: {
                default: 0
            }
        },
        created: function () {
            this.getInfo();
            this.getLevelList();
            this.getTypeList();
            this.getTicketList();
            this.getProjectStateList()
        },
        data() {
            return {
                this_modal: this.showModal,
                del_user_modal: false,
                del_project_modal: false,
                send_loading: false,
                project: {},
                level_list: [],
                ticket_list: [],
                type_list: [],
                project_user_list: [],
                project_state_list: [],
                tab_name: 'base_setting',
                formValidate: {
                    project_id: this.project_id,
                    name: '',
                    access_control_type: 'open',
                    level_id: 0,
                    ticket: 0,
                    type_id: 0,
                    status: '',
                    project_desc: '',
                    end: '',
                    prepayDate: '',
                },
                formValidateOther: {
                    project_id: this.project_id,
                    schedule: 0,
                    leader_id: 0,
                    business_id: 0,
                    test_message: '',
                    test_ftp: '',
                    online_message: '',
                    online_ftp: '',
                    other_message: '',
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '写上项目名称吧', trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {
            showModal: function (value) {
                this.this_modal = value
            },
            this_modal: function (value) {
                this.$emit('on-modal-change', value);
            },
            project_id: function (value) {
                this.getInfo();
                this.getLevelList();
                this.getTypeList();
                this.getProjectStateList()

            }
        },
        methods: {
            getInfo() {
                let app = this;
                getInfo(app.project_id).then(res => {
                    app.project = res.data;
                    app.$emit('on-update', app.project);
                    app.formValidate = {
                        project_id: app.project_id,
                        name: res.data.name,
                        access_control_type: res.data.access_control_type,
                        status: res.data.status,
                        ticket: res.data.ticket,
                        level_id: res.data.level_id,
                        type_id: res.data.type_id,
                        end: res.data.end,
                        prepayDate: res.data.prepayDate,
                        project_desc: res.data.project_desc,
                    };
                    app.formValidateOther = {
                        project_id: app.project_id,
                        schedule: Number(res.data.schedule),
                        leader_id: res.data.leader_id,
                        business_id: res.data.business_id,
                        test_message: res.data.test_message,
                        test_ftp: res.data.test_ftp,
                        online_message: res.data.online_message,
                        online_ftp: res.data.online_ftp,
                        other_message: res.data.other_message,
                    }
                });
            },
            getLevelList() {
                let app = this;
                getLevelList().then(res => {
                    app.level_list = res.data.list
                });
            },
            getTicketList() {
                let app = this;
                getTicketList().then(res => {
                    app.ticket_list = res.data
                });
            },
            getTypeList() {
                let app = this;
                getTypeList().then(res => {
                    app.type_list = res.data.list
                });
            },
            getProjectStateList() {
                let app = this;
                getStateList().then(res => {
                    app.project_state_list = res.data
                });
            },
            getProjectUserList() {
                let app = this;
                getUserList(app.project_id).then(res => {
                    app.project_user_list = res.data.list
                });
            },
            changeTabs(name, reload = false) {
                if (name === 'other_setting') {
                    if (this.project_user_list.length === 0) {
                        this.getProjectUserList()
                    }
                }

            },
            changeEndDate(date) {
                this.formValidate.end = date
            },
            changePrepayDate(date) {
                this.formValidate.prepayDate = date
            },
            handleSubmit(name) {
                let app = this;
                let send_data = {};
                if (name === 'formValidate') {
                    send_data = app.formValidate
                } else {
                    send_data = app.formValidateOther
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        app.send_loading = true;
                        doProject('edit', send_data).then(res => {
                            const code = res.ret;
                            const msg = res.msg;
                            if (code !== 200) {
                                app.$Message.warning({
                                    content: msg,
                                    duration: 5
                                });
                            } else {
                                app.this_modal = false;
                                app.form_modal = false;
                                app.$Message.success('操作成功');
                                app.getInfo()
                            }
                            app.send_loading = false;
                        }).catch(res => {
                            app.send_loading = false;
                        });
                    }
                })
            },
            delProjectUser() {
                let app = this;
                app.send_loading = true;
                delProjectUser(app.project_id).then(res => {
                    app.send_loading = false
                    app.del_user_modal = false
                    if (res.ret === 200) {
                        app.$Message.success('您已退出项目');
                        app.$router.push('/project/my_project/list')
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            delProject() {
                let app = this;
                let project_list = [app.project_id];
                app.send_loading = true;
                delProject(JSON.stringify(project_list)).then(res => {
                    app.send_loading = false;
                    app.del_project_modal = false;
                    if (res.ret == 200) {
                        app.$Message.success('删除成功');
                        app.$router.push('/project/my_project/list')
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            }
        }
    }
</script>
