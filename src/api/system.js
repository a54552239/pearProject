import $http from '../assets/js/http'

export async function getSetting(set_name) {
    return $http.post('System_Setting.getSetting', {
        set_name: set_name
    });
}

export async function doSetting(set_name, data) {
    return $http.post('System_Setting.doSetting', {name: set_name, value: data});
}

export async function getAuthGroupList(page_size, page_num, keyword = '') {
    return $http.post('System_AuthGroup.getList', {
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}
export async function getGroupAccess(user_id) {
    return $http.post('System_AuthGroup.getGroupAccess', {user_id: user_id});
}
export async function assGroupAccess(data) {
    return $http.post('System_AuthGroup.assGroupAccess', data);
}

export async function delGroup(ids) {
    return $http.post('System_AuthGroup.delGroup', {
        ids: ids
    });
}

export async function getMenu(id) {
    return $http.post('System_AuthMenu.getMenu', {id: id});
}

export async function delMenu(ids) {
    return $http.post('System_AuthMenu.delMenu', {ids: ids});
}

export async function getAllAuthMenuList(page_size, page_num, keyword,pid = -1) {
    return $http.post('System_AuthMenu.getAllList', {
        pid: pid,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export async function addMenu(data) {
    return $http.post('System_AuthMenu.addMenu', data);
}

export async function editMenu(data) {
    return $http.post('System_AuthMenu.editMenu', data);
}

export async function getAllMenuModelList() {
    return $http.post('System_MenuModel.getAllList');
}

export async function getRule(id) {
    return $http.post('System_AuthRule.getRule', {id: id});
}

export async function addRule(data) {
    return $http.post('System_AuthRule.addRule', data);
}

export async function editRule(data) {
    return $http.post('System_AuthRule.editRule', data);
}

export async function delRule(ids) {
    return $http.post('System_AuthRule.delRule', {ids: ids});
}

export async function getAllAuthRuleList(pid = 0, page_size, page_num, keyword) {
    return $http.post('System_AuthRule.getAllList', {
        pid: pid,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export async function getAllAuthGroupList() {
    return $http.post('System_AuthGroup.getAllList');
}

export async function addGroup(data) {
    return $http.post('System_AuthGroup.addGroup', data);
}

export async function editGroup(data) {
    return $http.post('System_AuthGroup.editGroup', data);
}

export async function getFullGroupOne(id) {
    return $http.post('System_AuthGroup.getFullGroupOne', {id: id});
}

export async function removeGroupUser(group_id, ids) {
    return $http.post('System_AuthGroup.removeGroupUser', {group_id: group_id, ids: ids});
}

export async function getGroupUserList(id, page_size, page_num, keyword) {
    return $http.post('System_AuthGroup.getGroupUserList', {
        id: id,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export async function getMenuModel(id) {
    return $http.post('System_MenuModel.getModel', {id: id});
}

export async function addMenuModel(data) {
    return $http.post('System_MenuModel.addModel', data);
}

export async function editMenuModel(data) {
    return $http.post('System_MenuModel.editModel', data);
}

export async function delMenuModel(ids) {
    return $http.post('System_MenuModel.delModel', {ids: ids});
}

export async function getMenuModelList(page_size, page_num, keyword) {
    return $http.post('System_MenuModel.getList', {
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export async function getLogList(page_size, page_num, keyword, search_date) {
    return $http.post('System_Log.getList', {
        page_size: page_size,
        page_num: page_num,
        keyword: keyword,
        search_date: search_date
    });
}
