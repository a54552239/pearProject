/**
 * Home
 */
export default [
    {
        //任务看板
        name: 'task',
        path: '/project/space/task/:code',
        component: resolve => require(['@/views/project/space/task'], resolve),
        meta: {model: 122, info: {show_slider: false, is_inner: true}},
        children: [
            {
                //任务详情
                name: 'taskdetail',
                path: 'detail/:taskCode',
                component: resolve => require(['@/views/project/space/taskdetail'], resolve),
                meta: {model: 'Project', info: {show_slider: false}},
            },
        ]
    },
    {
        //邀请链接
        name: 'inviteFromLink',
        path: '/invite_from_link/:code',
        component: resolve => require(['@/views/common/inviteFromLink'], resolve),
        meta: {model: 'Common', info: {show_slider: false}},
    },
    {
        name: 'calendar',
        path: '/calendar',
        component: resolve => require(['@/views/common/calendar'], resolve),
        meta: {model: 'Common', info: {show_slider: false}},
    },
];
