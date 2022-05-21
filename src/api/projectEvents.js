import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/events', data);
}
export function myList(data) {
    return $http.post('project/events/myList', data);
}
export function getEventsLog(data) {
    return $http.post('project/events/_getEventsLog', data);
}
export function read(data) {
    return $http.post('project/events/read', data);
}
export function confirmJoin(data) {
    return $http.post('project/events/confirmJoin', data);
}
export function getEventsListByCalendar(data) {
    return $http.post('project/events/getEventsListByCalendar', data);
}

export function doData(data) {
    let url = 'project/events/save';
    if (data.code) {
        url = 'project/events/edit';
    }
    return $http.post(url, data);
}

export function del(data) {
    return $http.post('project/events/delete', data);
}
