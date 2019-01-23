<template>
    <div id="menu-slide" :class="menu_slide_class">
        <Menu ref="menu" width="256px" theme="dark" :active-name="active_key" :open-names="open_items"
              @on-select="goPage" accordion>
            <Submenu v-for="(menu,index) in menu_data.menu_list" :key="menu.id" :name="menu.name">
                <template slot="title">
                    <Icon v-if="menu.icon" :type="menu.icon"></Icon>
                    {{ menu.title }}
                </template>
                <div v-if="menu.nextItem">
                    <Menu-item v-for="(sec_menu,index) in menu.nextItem" :key="sec_menu.id" :name="'/' + sec_menu.path">
                        {{ sec_menu.title }}
                    </Menu-item>
                </div>
            </Submenu>
        </Menu>
    </div>
</template>
<script type="es6">
    import * as utils from '../assets/js/utils'
    import {mapState} from 'vuex'
    import $ from 'jquery'

    export default {
        props: {
            active_key: {
                type: String
            },
            openItems: {
                type: Array
            },
            menuModel: { //菜单分组
                type: String
            }
        },
        data() {
            return {
                updated: true
            };
        },
        watch: {
            // $route: function () {
            //     this.$nextTick(() => {
            //         this.$refs.menu.updateOpened(this.open_items)
            //     });
            // },
            active_slide_key: function () {
                this.$nextTick(() => {
                    this.$refs.menu.updateOpened(this.open_items)
                });
            }
        },
        computed: {
            ...mapState({
                show_menu_slide: state => state.show_menu_slide,
                menu_data: state => state.menu.menu_data,
                active_slide_key: state => state.menu.active_key,
                open_items: state => state.menu.open_items,
            }),
            menu_slide_class: function () {
                if (this.show_menu_slide) {
                    return 'menu-slide';
                } else {
                    return 'menu-slide hide';
                }
            }
        },
        methods: {
            goPage(name) { // 点击菜单进入对应路由
                let app = this;
                this.$nextTick(() => {
                    app.$router.push(name)
                });
            },
        },
    };
</script>
