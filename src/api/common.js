import $http from '../assets/js/http'

export function bindClientId(client_id, uid) {
    return $http.post('index/index/bindClientId', {client_id: client_id, uid: uid});
}
