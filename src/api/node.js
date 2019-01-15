import $http from '@/assets/js/http'

export function getNodeList(module = '') {
    return $http.post('project/node', {module: module});
}

export function allList(module = '', node = '') {
    return $http.post('project/node/allList', {module: module, node: node});
}

export function save(data) {
    return $http.post('project/node/save', {list: data});
}

export function clear() {
    return $http.post('project/node/clear');
}
