import $http from '@/assets/js/http'

/* 查找用户 */
export function searchInviteMember(keyword, code) {
    return $http.post('project/project_member/searchInviteMember', {keyword: keyword, projectCode: code});
}
export function inviteMember(memberCode, code) {
    return $http.post('project/project_member/inviteMember', {memberCode: memberCode, projectCode: code});
}
export function _joinByInviteLink(inviteCode) {
    return $http.post('project/project_member/_joinByInviteLink', {inviteCode: inviteCode});
}
export function removeMember(memberCode, code) {
    return $http.post('project/project_member/removeMember', {memberCode: memberCode, projectCode: code});
}
export function list(data) {
    return $http.post('project/project_member/index', data);
}
export function _listForInvite(data) {
    return $http.post('project/project_member/_listForInvite', data);
}
