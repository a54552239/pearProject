import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/task_workflow', data);
}
export function _getTaskWorkflowRules(data) {
    return $http.post('project/task_workflow/_getTaskWorkflowRules', data);
}

export function save(data) {
    return $http.post('project/task_workflow/save', data);
}

export function edit(data) {
    return $http.post('project/task_workflow/edit', data);
}

export function del(data) {
    return $http.post('project/task_workflow/delete', data);
}
