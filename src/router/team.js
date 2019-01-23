/**
 * 团队
 */
export default [
    {
        name: 'team_list',
        path: '/team/list',
        component: resolve => require(['@/views/team/list'], resolve),
        meta: {model: 'Project'}
    },
    {
        name: 'team_user_list',
        path: '/team/user/list/:team_id',
        component: resolve => require(['@/views/team/user/list'], resolve),
        meta: {model: 'Project', parent: '/team/list'},
    },
    {
        name: 'team_user_detail',
        path: '/team/user/detail/:user_id',
        component: resolve => require(['@/views/team/user/detail'], resolve),
        meta: {model: 'Project', parent: '/user/list'},
    },
    {
        name: 'team_user_level_list',
        path: '/team/user/level/list',
        component: resolve => require(['@/views/team/user/level/list'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'team_user_level_detail',
        path: '/team/user/level/detail/:id',
        component: resolve => require(['@/views/team/user/level/detail'], resolve),
        meta: {model: 'Project', parent: '/team/user/level/list'},
    },
    {
        name: 'team_user_position_list',
        path: '/team/user/position/list',
        component: resolve => require(['@/views/team/user/position/list'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'team_user_position_detail',
        path: '/team/user/position/detail/:id',
        component: resolve => require(['@/views/team/user/position/detail'], resolve),
        meta: {model: 'Project', parent: '/team/user/position/list'},
    },
];