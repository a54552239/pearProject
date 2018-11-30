<template>
    <div class="wrapper-main">
        <vue-scroll>
        <div class="wrapper-content"
             :class="{ 'hidden':page_loading,'hide':!show_menu_slide }">
            <slot name="page-header"></slot>
            <div class="layout-content">
                <slot name="page-action"></slot>
                <h1 class="page-title" v-if="pageTitle != ''">{{ pageTitle }}</h1>
                <slot></slot>
            </div>
            <!--<div class="layout-copy">
                2016-2017 &copy; Pear TeamConsole
            </div>-->
        </div>
        </vue-scroll>
    </div>
</template>
<script type="es6">
    import {mapState} from 'vuex'
    import {getClassObj, getStore} from '../assets/js/utils'
    import $ from 'jquery'

    export default {
        props: {
            pageTitle: {
                default: ''
            },
        },
        mounted() {
            //用户权限资源检测
            function TraversalObject(obj, value) {
                for (let a in obj) {
                    if (typeof (obj[a]) === "object") {
                        TraversalObject(obj[a], value); //递归遍历
                    }
                    else {
                        if (a === 'name' && obj[a] === value) {
                            window.permission = true;
                        }
                    }
                }
            }

            const auth_list = getStore('auth_list',true);
            const permissions = $("a[permission]");
            if (permissions) {
                $.each(permissions, function (k, v) {
                    let permission = $(v).attr('permission');
                    window.permission = false;
                    TraversalObject(auth_list, permission);
                    if (!window.permission) {
                        $(v).remove()
                    }
                });
            }
            this.$nextTick(function () {
                // 挂载时隐藏所有父级页面的内容区
                const ClassElements = getClassObj('wrapper-main');
                if (ClassElements.length > 1) {
                    for (let i = 0; i < ClassElements.length - 1; i++) {
                        ClassElements[i].style.display = "none"
                    }
                }
            })
        },
        computed: {
            ...mapState(['page_loading', 'show_menu_slide']),
            wrapper_content_class: function () {
                if (this.show_menu_slide) {
                    return ' wrapper_content';
                } else {
                    return 'wrapper_content hide';
                }
            }
        },
        destroyed: function () {
            this.$nextTick(function () {
                const ClassElements = getClassObj('wrapper-main');
                for (let i = 0; i < ClassElements.length; i++) {
                    ClassElements[i].removeAttribute("style");
                }
            })
        },
    }
</script>
