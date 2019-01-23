/**
 * 个人
 */
export default [
    {
        name: 'personal_notice_list',
        path: '/personal/notice/list',
        component: resolve => require(['@/views/personal/notice/list'], resolve),
        meta: {model: 'Project'},
    },
];