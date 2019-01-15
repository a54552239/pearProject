// pagination-mixin.vue
export default {
    data() {
        return {
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0,
                showTotal: (total, range) => `共 ${total} 条`
            },
            // requestData: {
            //     page: this.pagination.page,
            //     pageSize: this.pagination.pageSize,
            // },
        }
    },
    computed:{
        requestData(){
            return {
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
            };
        }
    },
    methods: {
        init() {
        },
        pageChange(page) {
            this.pagination.page = page;
            this.requestData.page = page.current;
            this.init();
        },
    }
}
