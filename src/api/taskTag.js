import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/task_tag', data);
}

export function save(data) {
    return $http.post('project/task_tag/save', data);
}

export function edit(data) {
    return $http.post('project/task_tag/edit', data);
}

export function del(code) {
    return $http.post('project/task_tag/delete', {tagCode: code});
}
