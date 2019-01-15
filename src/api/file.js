import $http from '@/assets/js/http'
import {getApiUrl} from "../assets/js/utils";

export function list(data) {
    return $http.post('project/file', data);
}

export function read(fileCode) {
    return $http.post('project/file/read', {fileCode: fileCode});
}

export function edit(data) {
    return $http.post('project/file/edit', data);
}

export function uploadFiles() {
    return getApiUrl('project/file/uploadFiles');
}

export function recycle(fileCode) {
    return $http.post('project/file/recycle', {fileCode: fileCode});
}

export function recovery(fileCode) {
    return $http.post('project/file/recovery', {fileCode: fileCode});
}

export function del(fileCode) {
    return $http.post('project/file/delete', {fileCode: fileCode});
}
