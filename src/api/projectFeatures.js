import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/project_features', data);
}

export function save(data) {
    return $http.post('project/project_features/save', data);
}

export function edit(data) {
    return $http.post('project/project_features/edit', data);
}

export function del(data) {
    return $http.post('project/project_features/delete', data);
}
