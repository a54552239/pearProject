import $http from '../../assets/js/http'

export function install(data) {
    return $http.post('index/index/install', data);
}

export function checkInstall() {
    return $http.post('index/index/checkInstall');
}

export function inviteInfo(inviteCode) {
    return $http.post('project/invite_link/_read', {inviteCode: inviteCode});
}

export function createInviteLink(data) {
    return $http.post('project/invite_link/save', data);
}


export function notifyOverview(to) {
    return $http.post('index/notify/listTypeFormat', {to: to});
}

export function areasData() {
    return $http.post('index/index/getAreaData');
}

export function refreshAccessToken(refreshToken) {
    return $http.post('index/index/refreshAccessToken', {refreshToken: refreshToken});
}
