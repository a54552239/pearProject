import $http from '../../assets/js/http'

export function notifyOverview(to) {
    return $http.post('index/notify/listTypeFormat', {to: to});
}

export function areasData() {
    return $http.post('index/index/getAreaData');
}
