import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/project_version', data);
}
export function getVersionTask(data) {
    return $http.post('project/project_version/_getVersionTask', data);
}
export function getVersionLog(data) {
    return $http.post('project/project_version/_getVersionLog', data);
}
export function read(data) {
    return $http.post('project/project_version/read', data);
}

export function save(data) {
    return $http.post('project/project_version/save', data);
}

export function edit(data) {
    return $http.post('project/project_version/edit', data);
}
export function addVersionTask(data) {
    return $http.post('project/project_version/addVersionTask', data);
}
export function removeVersionTask(data) {
    return $http.post('project/project_version/removeVersionTask', data);
}
export function changeStatus(data) {
    return $http.post('project/project_version/changeStatus', data);
}

export function del(data) {
    return $http.post('project/project_version/delete', data);
}
