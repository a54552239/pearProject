import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/task_stages_template', data);
}

export function doData(data) {
    let url = 'project/task_stages_template/save';
    if (data.code) {
        url = 'project/task_stages_template/edit';
    }
    return $http.post(url, data);
}
export function del(code) {
    return $http.post('project/task_stages_template/delete', {code: code});
}
