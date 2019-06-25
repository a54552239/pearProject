import $http from '@/assets/js/http'
import {getFullUrl} from "../assets/js/utils";

export function dingTalkOauth() {
    return getFullUrl('index/oauth/dingTalkOauth');
}

export function dingTalkLoginByCode(data) {
    return $http.post('index/oauth/dingTalkLoginByCode', data);
}
