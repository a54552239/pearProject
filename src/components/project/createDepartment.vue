<template>
    <div class="create-department member-menu">
        <div class="header">
            {{actionType}}{{actionTitle}}
        </div>
        <div class="search-content">
            <a-input v-model="name" size="large" :placeholder="`${actionTitle}名称`">
                <a-icon slot="prefix" type="bulb" class="muted"/>
            </a-input>
            <div class="info" v-if="parentDepartmentCode">
                <span class="muted">隶属于：{{parentDepartment.name}}</span>
            </div>
        </div>
        <div class="actions">
            <a-button type="primary" class="middle-btn" size="large" block :loading="loading"
                      :disabled="disabled || loading" @click="doAction" @pressEnter="doAction">{{actionType}}
            </a-button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import {doData, read} from "../../api/department";
    import {checkResponse} from "../../assets/js/utils";
    import {notice} from "../../assets/js/notice";

    export default {
        name: "createDepartment",
        props: {
            departmentCode: {
                type: [String, Boolean],
                default() {
                    return ''
                }
            },
            parentDepartmentCode: {
                type: [String, Boolean],
                default() {
                    return ''
                }
            },
        },
        data() {
            return {
                name: '',
                loading: false,
                department: {},
                parentDepartment: {}
            };
        },
        computed: {
            actionType() {
                return this.departmentCode ? '编辑' : '创建'
            },
            actionTitle() {
                return this.parentDepartmentCode ? '子部门' : '部门'
            },
            disabled() {
                return !this.name.trim()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.departmentCode) {
                    read(this.departmentCode).then(res => {
                        this.department = res.data;
                        this.name = res.data.name;
                    });
                }
                if (this.parentDepartmentCode) {
                    read(this.parentDepartmentCode).then(res => {
                        this.parentDepartment = res.data
                    });
                }
            },
            doAction() {
                this.name = this.name.trim();
                if (!this.name) {
                    return false;
                }
                const obj = {departmentCode: this.departmentCode,parentDepartmentCode: this.parentDepartmentCode, name: this.name};
                this.loading = true;
                doData(obj).then(res => {
                    this.loading = false;
                    if (!checkResponse(res)) {
                        return false;
                    }
                    notice({title: `${this.actionType}部门成功`}, 'notice', 'success');
                    this.$emit('update', res.data);
                    if (this.departmentCode) {
                        this.$emit('edit', this.name)
                    }
                });
            },
        }
    }
</script>
<style lang="less">
    .create-department {

        &.member-menu {
            height: auto;

            .header {
                padding: 0 12px 12px 6px;
                justify-content: center;
                font-weight: bold;
                border-bottom: 1px solid #e8e8e8;
            }

            .search-content {
                padding-top: 18px;
            }

            .info {
                padding: 12px 0 0 0;
            }

            .actions {
                padding: 0px 12px;
            }

        }
    }
</style>
