/**
 * 系统
 */
export default [
    {
        name: 'system_setting_base',
        path: '/system/setting_base',
        component: resolve => require(['@/views/system/setting/base/system-setting-base'], resolve),
        meta: {model: 'Project'}
    },
    {
        name: 'system_auth_group_list',
        path: '/system/auth_group/list',
        component: resolve => require(['@/views/system/auth/auth-group-list'], resolve),
        meta: {model: 'Project'},
        children: [
            {
                name: 'auth_group_add',
                path: '/system/auth_group/add',
                component: resolve => require(['@/views/system/auth/auth_group_add'], resolve),
                meta: {model: 'Project', parent: '/system/auth_group/list'},
            },
            {
                name: 'auth_group_edit',
                path: '/system/auth_group/edit/:id',
                component: resolve => require(['@/views/system/auth/auth_group_edit'], resolve),
                meta: {model: 'Project', parent: '/system/auth_group/list'},
            },
            {
                name: 'system_group_user_list',
                path: '/system/auth_group/user_list/:id',
                component: resolve => require(['@/views/system/auth/group-user-list'], resolve),
                meta: {model: 'Project', parent: '/system/auth_group/list'}
            },
        ]
    },
    {
        name: 'system_menu_model_list',
        path: '/system/menu_model/list',
        component: resolve => require(['@/views/system/auth/menu-model-list'], resolve),
        meta: {model: 'Project'},
        children: [
            {
                name: 'menu_model_add',
                path: '/system/menu_model/add',
                component: resolve => require(['@/views/system/auth/menu-model-add'], resolve),
                meta: {model: 'Project', parent: '/system/menu_model/list'},
            },
            {
                name: 'menu_model_edit',
                path: '/system/menu_model/edit/:id',
                component: resolve => require(['@/views/system/auth/menu-model-edit'], resolve),
                meta: {model: 'Project', parent: '/system/menu_model/list'},
            }
        ]
    },
    {
        name: 'system_auth_menu_list',
        path: '/system/auth_menu/list',
        component: resolve => require(['@/views/system/auth/auth-menu-list'], resolve),
        meta: {model: 'Project'},
        children: [
            {
                name: 'auth_menu_add',
                path: '/system/auth_menu/add',
                component: resolve => require(['@/views/system/auth/auth-menu-add'], resolve),
                meta: {model: 'Project', parent: '/system/auth_menu/list'},
            },
            {
                name: 'auth_menu_edit',
                path: '/system/auth_menu/edit/:id',
                component: resolve => require(['@/views/system/auth/auth-menu-edit'], resolve),
                meta: {model: 'Project', parent: '/system/auth_menu/list'},
            }
        ]
    },
    {
        name: 'system_auth_rule_list',
        path: '/system/auth_rule/list',
        component: resolve => require(['@/views/system/auth/auth-rule-list'], resolve),
        meta: {model: 'Project'},
        children: [
            {
                name: 'auth_rule_add',
                path: '/system/auth_rule/add',
                component: resolve => require(['@/views/system/auth/auth-rule-add'], resolve),
                meta: {model: 'Project', parent: '/system/auth_rule/list'},
            },
            {
                name: 'auth_rule_edit',
                path: '/system/auth_rule/edit/:id',
                component: resolve => require(['@/views/system/auth/auth-rule-edit'], resolve),
                meta: {model: 'Project', parent: '/system/auth_rule/list'},
            }
        ]
    },
    {
        name: 'system_log_list',
        path: '/system/log/list',
        component: resolve => require(['@/views/system/log/log-list'], resolve),
        meta: {model: 'Project'},
    },
];