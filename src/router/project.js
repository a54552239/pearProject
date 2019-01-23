/**
 * 项目
 */
export default [
    {
        name: 'project_statistics',
        path: '/project/statistics',
        component: resolve => require(['@/views/project/statistics/statistics'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_overview',
        path: '/project/overview',
        component: resolve => require(['@/views/project/overview/overview'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'all_project_list',
        path: '/project/all_project/list',
        component: resolve => require(['@/views/project/allProject/list'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'my_project_list',
        path: '/project/my_project/list',
        component: resolve => require(['@/views/project/myProject/list'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_file_list',
        path: '/project/file/:project_id',
        component: resolve => require(['@/views/project/file/file'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_build_list',
        path: '/project/build/:project_id',
        component: resolve => require(['@/views/project/build/build'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_type_list',
        path: '/project/project_type/list',
        component: resolve => require(['@/views/project/projectType/list'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_level_list',
        path: '/project/level/list',
        component: resolve => require(['@/views/project/level/list'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_task',
        path: '/project/task/:project_id',
        component: resolve => require(['@/views/project/task/task'], resolve),
        meta: {model: 'Project'},
    },
    {
        name: 'project_task_overview',
        path: '/project/taskoverview/:team_id',
        component: resolve => require(['@/views/project/task/task-overview'], resolve),
        meta: {model: 'Project', parent: '/project/taskoverview/0'},
    },
    {
        name: 'project_task_type_template',
        path: '/project/task_type_template/:type_id',
        component: resolve => require(['@/views/project/task/task_type_template_list'], resolve),
        meta: {model: 'Project', parent: '/project/project_type/list'},
    },
];