<template>
    <div class='editable-cell'>
        <div v-if="editable" class='editable-cell-input-wrapper'>
            <a-input
                    :value="value"
                    @change="handleChange"
                    @pressEnter="check"
            />
            <a-icon
                    type='check'
                    class='editable-cell-icon-check'
                    @click="check"
            />
        </div>
        <div v-else class='editable-cell-text-wrapper'>
            <span v-if="value">{{value}}</span>
            <span v-else-if="value == 0">{{value}}</span>
            <span v-else> </span>
            <a-icon type='edit' class='editable-cell-icon' @click="edit"/>
        </div>
    </div>
</template>
<script>
    import {Input, Icon} from 'ant-design-vue';

    export default {
        name: 'EditableCell',
        components: {
            'a-input': Input,
            'a-icon': Icon
        },
        props: {
            text: [String,Number],
            showEdit: {
                type: [Boolean]
            }
        },
        data() {
            return {
                value: this.text,
                editable: false,
            }
        },
        methods: {
            handleChange(e) {
                const value = e.target.value;
                this.value = value
            },
            check() {
                this.editable = false;
                this.$emit('change', this.value)
            },
            edit() {
                this.editable = true
            },
        },
    }
</script>
<style>
    .editable-cell {
        position: relative;
    }

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
        position: relative;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        top: 8px;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        line-height: 18px;
        display: none;
    }
    .editable-cell-icon.anticon{
        display: none;
    }

    .editable-cell-icon-check {
        top: 0;
        line-height: 28px !important;
    }

    .editable-cell:hover .editable-cell-icon {
        display: inline-block;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
</style>
