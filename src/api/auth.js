import $http from '@/assets/js/http'

export function getAuthList(data) {
    return $http.post('project/auth',data);
}

export function doAuth(data) {
    let url = 'project/auth/add';
    if (data.id) {
        url = 'project/auth/edit';
    }
    return $http.post(url, data);
}

export function apply(auth_id = 0, nodes = [], action = 'get') {
    let url = 'getnode';
    if (action === 'save') {
        url = 'save';
    }
    return $http.post('project/auth/apply', {action: url, id: auth_id, nodes: nodes});
}

export function forbid(id, status) {
    return $http.post('project/auth/forbid', {id: id, status: status});
}

export function resume(id, status) {
    return $http.post('project/auth/resume', {id: id, status: status});
}

/* 设置默认权限 */
export function setDefault(id, is_default) {
    return $http.post('project/auth/setDefault', {id: id, is_default: is_default});
}

export function del(id) {
    return $http.post('project/auth/del', {id: id});
}
