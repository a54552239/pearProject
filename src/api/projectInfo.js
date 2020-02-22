import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/project_info', data);
}

export function doData(data) {
    let url = 'project/project_info/save';
    if (data.infoCode) {
        url = 'project/project_info/edit';
    }
    return $http.post(url, data);
}

export function del(data) {
    return $http.post('project/project_info/delete', data);
}
