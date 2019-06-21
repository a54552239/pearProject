import $http from '@/assets/js/http'

export function _clearAll(data) {
    return $http.post('project/notify/_clearAll', data);
}
export function list(data) {
    return $http.post('project/notify', data);
}

export function noReads() {
    return $http.post('project/notify/noReads');
}

export function doData(data) {
    let url = 'project/notify/save';
    if (data.id) {
        url = 'project/notify/edit';
    }
    return $http.post(url, data);
}

export function del(id) {
    return $http.post('project/notify/delete', {id: id});
}

export function batchDel(ids) {
    return $http.post('project/notify/batchDel', {ids: ids});
}

export function setReadied(ids) {
    return $http.post('project/notify/setReadied', {ids: ids});
}
