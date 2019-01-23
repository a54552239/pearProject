/**
 * 用户
 */
export default [
    {
        name: 'user_list',
        path: '/user/list',
        component: resolve => require(['@/views/user/profile/user-list'], resolve),
        meta: {model: 'Project'},
        children: [
            {
                name: 'ass_group_access',
                path: '/user/ass_group_access/:user_id',
                component: resolve => require(['@/views/user/profile/user-ass-group-access'], resolve),
                meta: {model: 'Project', parent: '/user/list'},
            }
        ]
    },
    {
        name: 'user_base_setting',
        path: '/user/base_setting',
        component: resolve => require(['@/views/user/setting/base/user-base-setting'], resolve),
        meta: {model: 'Project'}
    }
];