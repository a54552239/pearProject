import $http from '../assets/js/http'

export async function Login({account, password, remember = false}) {
    return $http.post('User_User.Login', {
        account,
        password,
        remember
    });
}

export function getUser(user_id) {
    return $http.post('User_User.getUser', {user_id: user_id});
}

export function changeUserState(id, state) {
    return $http.post('User_User.changeState', {id: id, state: state});
}

export function delUser(ids) {
    return $http.post('User_User.delUser', {ids: ids});
}

export function getUserList(page_size, page_num, keyword) {
    return $http.post('User_User.getUserList', {page_size: page_size, page_num: page_num, keyword: keyword});
}

export function doUserInfo(action = 'add', data) {
    let url = 'User_User.addUser';
    if (action === 'edit') {
        url = 'User_User.editUser'
    }
    return $http.post(url, data);
}

export function getUserMenu() {
    return $http.post('User_User.getUserMenu');
}

export function getUserAuth() {
    return $http.post('User_User.getUserAuth');
}

export function getInfoByToken() {
    return $http.post('User_User.getInfoByToken');
}

export function editUser(data) {
    return $http.post('User_User.editUser', data);
}

export function doUser(data) {
    return $http.post('User.doUser', data);
}

export function changePassword(data) {
    return $http.post('User_User.changePassword', data);
}

export function getPositionList(page_size, page_num = 1, keyword = '') {
    return $http.post('User_Position.getList', {page_size: page_size, page_num: page_num, keyword: keyword});
}

export function getPositionInfo(position_id) {
    return $http.post('User_Position.getInfo', {position_id: position_id});
}

export function getPositionUserList(position_id, page_size, page_num, keyword) {
    return $http.post('User_Position.getUserList', {
        position_id: position_id,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export function delPosition(ids) {
    return $http.post('User_Position.delPosition', {ids: ids});
}

export function doPosition(action = 'add', data) {
    let url = 'User_Position.addPosition';
    if (action === 'edit') {
        url = 'User_Position.editPosition'
    }
    return $http.post(url, data);
}


export function getUserLevelList(level_id, page_size, page_num, keyword) {
    return $http.post('User_Level.getUserList', {
        level_id: level_id,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export function getLevelList(page_size, page_num = 1, keyword = '') {
    return $http.post('User_Level.getList', {page_size: page_size, page_num: page_num, keyword: keyword});
}

export function delLevel(ids) {
    return $http.post('User_Level.delLevel', {ids: ids});
}

export function getLevelInfo(level_id) {
    return $http.post('User_Level.getInfo', {level_id: level_id});
}

export function doLevel(action = 'add', data) {
    let url = 'User_Level.addLevel';
    if (action === 'edit') {
        url = 'User_Level.editLevel'
    }
    return $http.post(url, data);
}

export function getUserSetting(set_name) {
    return $http.post('User_UserSetting_Setting.getSetting', {name: set_name});
}

export function doUserSetting(set_name, data) {
    return $http.post('User_UserSetting_Setting.doSetting', {name: set_name, value: data});
}