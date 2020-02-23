<template>
    <div v-if="currentOrganization">
        <a-dropdown class="action-item" placement="bottomCenter">
            <div class="organization-select">
                <span>{{currentOrganization.name}}</span>
               <a-icon :style="{fontSize: '14px', marginLeft: '2px'}" type="down" />
            </div>
            <a-menu slot="overlay" class="middle-menu organization-menu" :selectable="false" @click="organizationAction">
                <a-menu-item v-for="(organization,index) in organizationList" :key="index">
                    <div class="muted flex ant-row-flex-middle">
                        <span href="javascript:;" class="text-default">{{organization.name}} </span>
                        <a-icon v-show="currentOrganization.code == organization.code" class="muted m-l-lg" type="check" />
                    </div>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {changeCurrentOrganization} from '@/api/user';
    import {checkResponse} from "@/assets/js/utils";
    import {createRoute} from "../../../assets/js/utils";

    export default {
        name: 'HeaderSelect',
        data() {
            return {
            }
        },
        computed: {
            ...mapState({
                currentOrganization: state => state.currentOrganization,
                organizationList: state => state.organizationList
            })
        },
        methods: {
            organizationAction(action) {
                let app = this;
                changeCurrentOrganization(app.organizationList[action.key]).then(res=>{
                    if (checkResponse(res)) {
                        app.$router.replace('/home/' + app.organizationList[action.key].code);
                    }
                    console.log(res);
                })
            },
        }
    }
</script>

<style lang="less">
</style>
