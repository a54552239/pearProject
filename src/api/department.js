import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/department', data);
}

export function read(departmentCode) {
    return $http.post('project/department/read', {departmentCode: departmentCode});
}

export function doData(data) {
    let url = 'project/department/save';
    if (data.departmentCode) {
        url = 'project/department/edit';
    }
    return $http.post(url, data);
}

export function del(departmentCode) {
    return $http.post('project/department/delete', {departmentCode: departmentCode});
}
