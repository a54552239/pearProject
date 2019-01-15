import $http from '@/assets/js/http'

export function getMenuForUser() {
    return $http.post('project/index');
}

export function getMenu() {
    return $http.post('project/menu/menu');
}

export function doMenu(data) {
    let url = 'project/menu/menuAdd';
    if (data.id) {
        url = 'project/menu/menuEdit';
    }
    return $http.post(url, data);
}
export function forbid(id, status) {
    return $http.post('project/menu/menuForbid', {id: id, status: status});
}

export function resume(id, status) {
    return $http.post('project/menu/menuResume', {id: id, status: status});
}
export function delMenu(id) {
    return $http.post('project/menu/menuDel', {id: id});
}

