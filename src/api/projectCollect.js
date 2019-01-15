import $http from '@/assets/js/http'

/*收藏项目*/
export function collect(code, type = 'collect') {
    return $http.post('project/project_collect/collect', {type: type, projectCode: code});
}
