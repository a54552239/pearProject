<template>
    <a-modal
        wrapClassName="events"
        dialogClass="vertical-modal"
        destroyOnClose
        :maskClosable="false"
        :title="actionInfo.modalTitle"
        :confirmLoading="submitting"
        v-model="show"
        @ok="handleSubmit"
    >
        <a-spin :spinning="loading">
            <!--<a-alert class="m-b alert-white" type="info" message="提示"
                     showIcon></a-alert>-->
            <a-form-model class="m-b" :model="formData" ref="ruleForm" :rules="rules"
                          @submit.prevent="handleSubmit">
                <a-row :gutter="16">
                    <a-col :span="24">
                        <a-form-model-item
                            label='标题'
                            prop="title"
                        >
                            <a-input v-model="formData.title"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                        <a-row :gutter="16">
                            <a-col :span="12">
                                <a-form-model-item
                                    label='开始时间'
                                    prop="begin_time"
                                >
                                    <a-date-picker v-model="formData.begin_time" showTime format="YYYY年MM月DD日 HH:mm"
                                                   style="width: 100%"
                                                   placeholder="选择开始时间"></a-date-picker>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label='结束时间'
                                    prop="end_time"
                                >
                                    <a-date-picker v-model="formData.end_time" showTime format="YYYY年MM月DD日 HH:mm"
                                                   style="width: 100%"
                                                   placeholder="选择结束时间"></a-date-picker>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label='所属项目'
                            prop="memberList"
                        >
                            <a-select style="width: 100%" v-model="formData.project_code"
                                      allowClear
                                      showSearch
                                      :disabled="!!formData.id"
                                      autoClearSearchValue
                                      @change="projectChange"
                            >
                                <template v-for="item in projectList">
                                    <a-select-option :key="item.code" :value="item.code">
                                        {{ item.name }}
                                    </a-select-option>
                                </template>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label='日程地点'
                            prop="position"
                        >
                            <a-input v-model="formData.position"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-model-item
                            label='选择成员'
                            prop="memberList"
                        >
                            <a-select style="width: 100%;" v-model="formData.member_list"
                                      allowClear
                                      showSearch
                                      autoClearSearchValue
                                      :maxTagCount="4"
                                      optionLabelProp="label"
                                      mode="multiple">
                                <template v-for="item in projectMemberList">
                                    <a-select-option :disabled="!canRemove(item.code)" :key="item.code"
                                                     :value="item.code" :label="item.name">
                                        <a-avatar :size="24" icon="user" :src="item.avatar" class="m-r-sm"/>
                                        {{ item.name }}
                                    </a-select-option>
                                </template>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-model-item
                            label='备注'
                            prop="description"
                        >
                            <a-textarea :rows="4" v-model="formData.description" placeholder='填写备注，不超过250字'/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-spin>
    </a-modal>
</template>
<script>
import moment from "moment";
import {read as getProject} from "@/api/project";
import {checkResponse} from "assets/js/utils";
import {doData, read, del} from "@/api/projectEvents";
import pagination from "@/mixins/pagination";
import {list as getProjectMemberList} from "@/api/projectMember";
import {selfList as getProjectList} from "@/api/project";

export default {
    name: "events",
    mixins: [pagination],
    props: {
        'code': {
            default: 0
        },
        'projectCode': {
            default: 0
        },
        date: {
            default: moment()
        },
        visible: {
            default: false
        },
    },
    data() {
        return {
            moment,
            currentMemberCode: this.$store.state.userInfo.code,
            currentProjectCode: this.projectCode,
            loading: true,
            showLoadingMore: false,
            loadingMore: false,
            show: this.visible,
            submitting: false,
            projectList: [],
            projectMemberList: [],

            actionInfo: {
                modalStatus: false,
                confirmLoading: false,
                modalTitle: '新建日程',
                okText: '确定',
                cancelText: '放弃',
            },

            formData: {
                id: 0,
                title: undefined,
                description: undefined,
                begin_time: this.date,
                end_time: this.date,
                all_day: false,
                project_code: this.$route.params.code,
                position: undefined,
                member_list: [],
            },
            rules: {
                title: [
                    {required: true, message: '请选择必填项', trigger: 'blur'}
                ],
                project_code: [
                    {required: true, message: '请选择必填项', trigger: 'blur'}
                ],
                begin_time: [
                    {required: true, message: '请选择开始时间', trigger: 'change'}
                ],
                end_time: [
                    {required: true, message: '请选择结束时间', trigger: 'change'}
                ],
            },
        }
    },
    watch: {
        visible(val) {
            this.show = val;
            if (val) {
                this.init();
            }
        },
        show: {
            handler(val) {
                this.$emit('update:visible', val);
            },
            deep: true,
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        getProject() {
            this.loading = true;
            if (!this.currentProjectCode) {
                this.loading = false;
                return false;
            }
            getProject(this.currentProjectCode).then((res) => {
                this.loading = false;
                this.project = res.data;
                this.$store.dispatch('setTempData', {
                    projectCode: this.project.code,
                })
            });
        },
        getProjectMemberList() {
            getProjectMemberList({projectCode: this.currentProjectCode, pageSize: 300}).then(res => {
                this.projectMemberList = res.data.list;
            })
        },
        getProjectList() {
            getProjectList({archive: 0, pageSize: 300}).then(res => {
                this.loading = false;
                this.projectList = res.data.list;
                if (this.projectList.length && !this.currentProjectCode) {
                    this.currentProjectCode = this.projectList[0].code;
                    this.projectChange(this.currentProjectCode);
                }
            })
        },
        init(reset = true) {
            let app = this;
            if (this.currentProjectCode) {
                this.getProject();
                this.getProjectMemberList();
            }
            this.getProjectList();
            if (!this.code) {
                app.actionInfo.modalTitle = '新建日程';
                app.formData = {
                    id: 0,
                    title: undefined,
                    description: undefined,
                    begin_time: this.date,
                    end_time: this.date,
                    all_day: false,
                    project_code: this.currentProjectCode,
                    position: undefined,
                    member_list: [app.currentMemberCode],
                };
            } else {
                app.actionInfo.modalTitle = '编辑日程';
                read({eventsCode: this.code}).then(res => {
                    let record = res.data;
                    app.formData.id = record.id;
                    let member_list = [];
                    record.memberList.forEach((v => {
                        member_list.push(v.member_code);
                    }))
                    record.member_list = member_list;
                    app.formData = {...record};
                });
            }
        },
        projectChange(value, option) {
            this.currentProjectCode = value;
            this.formData.project_code = value;
            this.formData.member_list = [this.currentMemberCode];
            this.getProjectMemberList();
        },
        handleSubmit() {
            let app = this;
            app.$refs.ruleForm.validate(valid => {
                if (valid) {
                    app.handleOk();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleOk() {
            let app = this;
            app.submitting = true;
            let obj = {...app.formData};
            console.log(obj);
            // app.$emit('fieldsSave', obj);
            obj.member_list = JSON.stringify(obj.member_list);
            obj.begin_time = moment(obj.begin_time).format('YYYY-MM-DD HH:mm:ss')
            obj.end_time = moment(obj.end_time).format('YYYY-MM-DD HH:mm:ss')
            doData(obj).then(res => {
                app.submitting = false;
                if (!checkResponse(res, true)) {
                    return;
                }
                app.$emit('confirm', obj)
                this.show = false;
            });
        },
        async rowClick(record, action, index = null) {
            let app = this;
            app.formData.id = 0;
            if (action == 'add' || action == 'edit' || action == 'new') {
                app.formData = {
                    id: 0,
                    title: undefined,
                    description: undefined,
                    begin_time: null,
                    end_time: null,
                    all_day: false,
                    project_code: app.$route.params.code,
                    position: undefined,
                    member_list: [app.currentMemberCode],
                };
                app.actionInfo.modalTitle = '新增日程';
                if (action == 'edit') {
                    app.actionInfo.modalTitle = '编辑日程';
                    app.formData.id = record.id;
                    let member_list = [];
                    record.memberList.forEach((v => {
                        member_list.push(v.member_code);
                    }))
                    record.member_list = member_list;
                    app.formData = {...record};
                }
                app.actionInfo.modalStatus = true;
                app.$nextTick(() => {
                    app.$refs.ruleForm.clearValidate();
                });
            } else if (action == 'del') {
                app.$confirm({
                    title: `确定要删除?`,
                    content: '关联的相关信息将会同时被删除',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '放弃',
                    onOk() {
                        del({eventsCode: record.code}).then(res => {
                            if (!checkResponse(res, true)) {
                                return;
                            }
                            app.init(true);
                        })
                    }
                });
            }
        },
        canRemove(memberCode) {
            console.log(this.formData.memberList);
            if (this.formData.memberList) {
                const member = this.formData.memberList.find(item => item.member_code == memberCode);
                if (member && member.is_owner) {
                    return false;
                }
                return true;
            }
            return memberCode !== this.currentMemberCode;
        }
    }
}
</script>
