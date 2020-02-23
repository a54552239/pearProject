// common-mixin.vue
import {getStore} from "../assets/js/storage";
import config from "../config/config";

export default {
    data() {
        return {}
    },
    methods: {
        routerLink(page, replace = false) {
            if (replace) {
                this.$router.replace(page);
            } else {
                this.$router.push(page);
            }
        },
        toHome() {
            const currentOrganization = getStore('currentOrganization', true);
            let home = config.HOME_PAGE;
            if (currentOrganization) {
                home = home + '/' + currentOrganization.code;
            }
            this.$router.push(home);
        },
    }
}
