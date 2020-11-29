<template>
    <calendar></calendar>
</template>

<script>
import _ from 'lodash'
import pagination from "@/mixins/pagination";
import calendar from "@/components/project/calendar";

export default {
    name: "CommonCalendar",
    components: {
        calendar
    },
    mixins: [pagination],
    data() {
        return {
            keyword: '',
            selectedKeys: ['0'],
        }
    },
    watch: {
        keyword() {
            this.search();
        },
    },
    created() {
    },
    methods: {
    }
}
</script>

<style lang="less">

</style>
