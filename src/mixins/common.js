// common-mixin.vue
export default {
    data() {
        return {
        }
    },
    methods: {
        routerLink(page) {
            this.$router.push(page)
        },
    }
}
