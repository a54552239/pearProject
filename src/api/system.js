import $http from '@/assets/js/http'

export function info() {
    return $http.post('project/index/systemConfig');
}
