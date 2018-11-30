import $http from '../assets/js/http'

export function getNotifyList(page_size = 5, data = {}) {
    let params = {page_size: page_size};
    params = Object.assign(params, data);
    return $http.post('Common_Notify.getList', params);
}

export function getNotifyListForUser() {
    return $http.post('Common_Notify.getListForUser');
}

export function getTicketRead(id) {
    return $http.post('Common_Notify.ticketRead', {id: id});
}

export function batchTicketRead() {
    return $http.post('Common_Notify.batchTicketRead');
}

export function setFinallySendTime(ids) {
    return $http.post('Common_Notify.setFinallySendTime', {ids: ids});
}

export function getNotifyTypeList(ids) {
    return $http.post('Common_Notify.getNotifyTypeList', {ids: ids});
}

export function Search(keyword) {
    return $http.post('Common_Search.search', {keyword: keyword});
}
export function bindClientId(client_id, uid) {
    return $http.post('Common_Notify.bindClientId', {client_id: client_id, uid: uid});
}
