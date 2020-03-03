import $http from '@/assets/js/http'
import store from '@/store';

export function list(data) {
    return $http.post('project/organization', data);
}

export function _getOrgList(data) {
    return $http.post('project/organization/_getOrgList', data).then(res => {
        if (res.data) {
            store.dispatch('setOrganizationList', res.data);
        }
        return Promise.resolve(res);
    });
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
export function _quitOrganization(data) {
    return $http.post('project/organization/_quitOrganization', data);
}
