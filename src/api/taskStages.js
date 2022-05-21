import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/task_stages', data);
}
export function taskTree(data) {
    return $http.post('project/task_stages/taskTree', data);
}
export function _getAll(data) {
    return $http.post('project/task_stages/_getAll', data);
}

export function tasks(data) {
    return $http.post('project/task_stages/tasks', data);
}

export function sort(preCode, nextCode, projectCode) {
    return $http.post('project/task_stages/sort', {preCode: preCode, nextCode: nextCode, projectCode: projectCode});
}

export function save(data) {
    return $http.post('project/task_stages/save', data);
}

export function edit(data) {
    return $http.post('project/task_stages/edit', data);
}

export function del(code) {
    return $http.post('project/task_stages/delete', {code: code});
}
