import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/task_workflow', data);
}

export function save(data) {
    return $http.post('project/task_workflow/save', data);
}

export function edit(data) {
    return $http.post('project/task_workflow/edit', data);
}

export function del(code) {
    return $http.post('project/task_workflow/delete', {code: code});
}
