import $http from '@/assets/js/http'

/* 查找用户 */
export function searchInviteMember(keyword, departmentCode) {
    return $http.post('project/department_member/searchInviteMember', {keyword: keyword, departmentCode: departmentCode});
}
export function inviteMember(accountCode, departmentCode) {
    return $http.post('project/department_member/inviteMember', {accountCode: accountCode, departmentCode: departmentCode});
}
export function removeMember(accountCode, departmentCode) {
    return $http.post('project/department_member/removeMember', {accountCode: accountCode, departmentCode: departmentCode});
}
export function list(data) {
    return $http.post('project/department_member/index', data);
}
