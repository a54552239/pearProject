import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/organization',data);
}

export function doData(data) {
    let url = 'project/organization/save';
    if (data.organizationCode) {
        url = 'project/organization/edit';
    }
    return $http.post(url, data);
}

export function del(organizationCode) {
    return $http.post('project/organization/delete', {organizationCode: organizationCode});
}
