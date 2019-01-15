import $http from '@/assets/js/http'


export function del(sourceCode) {
    return $http.post('project/source_link/delete', {sourceCode: sourceCode});
}
