import $http from '@/assets/js/http'

export async function Login(data) {
    return $http.post('project/login', data);
}

export function register(data) {
    return $http.post('project/login/register', data);
}

export function getCaptcha(mobile) {
    return $http.post('project/login/getCaptcha', {mobile: mobile});
}

export function _getMailCaptcha(email) {
    return $http.post('project/login/_getMailCaptcha', {email: email});
}

export function _resetPasswordByMail(data) {
    return $http.post('project/login/_resetPasswordByMail', data);
}

export function changeCurrentOrganization(organizationCode) {
    return $http.post('project/index/changeCurrentOrganization', {organizationCode: organizationCode});
}

export function list(data) {
    return $http.post('project/account', data);
}

export function forbid(accountCode) {
    return $http.post('project/account/forbid', {accountCode: accountCode, status: 0});
}

export function resume(accountCode) {
    return $http.post('project/account/resume', {accountCode: accountCode, status: 1});
}

export function doAccount(data) {
    let url = 'project/account/add';
    if (data.code) {
        url = 'project/account/edit';
    }
    return $http.post(url, data);
}

export function auth(id, auth) {
    return $http.post('project/account/auth', {id: id, auth: auth});
}

export function del(accountCode) {
    return $http.post('project/account/del', {accountCode: accountCode});
}

export function info($id) {
    return $http.post('project/index/info', {id: $id});
}

export function read(code) {
    return $http.post('project/account/read', {code: code});
}

export function editAccount(data) {
    return $http.post('project/account/edit', data);
}

export function editPersonal(data) {
    return $http.post('project/index/editPersonal', data);
}

export function editPassword(data) {
    return $http.post('project/index/editPassword', data);
}

export function _bindMobile(data) {
    return $http.post('project/login/_bindMobile', data);
}

export function _bindMail(data) {
    return $http.post('project/login/_bindMail', data);
}

export function _unbindDingtalk(data) {
    return $http.post('project/login/_unbindDingtalk', data);
}

export function _currentMember(data) {
    return $http.post('project/login/_currentMember', data);
}

export function _checkBindMail(data) {
    return $http.post('project/login/_checkBindMail', data);
}

export function _joinByInviteLink(inviteCode) {
    return $http.post('project/account/_joinByInviteLink', {inviteCode: inviteCode});
}

export function _checkLogin(data) {
    return $http.post('project/login/_checkLogin', data);
}

export function _out(data) {
    return $http.post('project/login/_out', data);
}
