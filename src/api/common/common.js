import $http from '../../assets/js/http'

export function install(data) {
    return $http.post('index/index/install', data);
}

export function checkInstall() {
    return $http.post('index/index/checkInstall');
}

export function notifyOverview(to) {
    return $http.post('index/notify/listTypeFormat', {to: to});
}

export function areasData() {
    return $http.post('index/index/getAreaData');
}
