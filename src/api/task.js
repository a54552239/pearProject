import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/task', data);
}
export function getListByTaskTag(data) {
    return $http.post('project/task/getListByTaskTag', data);
}

export function selfList(data) {
    return $http.post('project/task/selfList', data);
}

export function taskSources(data) {
    return $http.post('project/task/taskSources', data);
}

export function sort(data) {
    return $http.post('project/task/sort', data);
}

export function save(data) {
    return $http.post('project/task/save', data);
}

export function edit(data) {
    return $http.post('project/task/edit', data);
}

export function taskToTags(data) {
    return $http.post('project/task/taskToTags', data);
}
export function setTag(data) {
    return $http.post('project/task/setTag', data);
}

export function like(code, like) {
    return $http.post('project/task/like', {like: like, taskCode: code});
}

export function star(code, star) {
    return $http.post('project/task/star', {star: star, taskCode: code});
}

export function createComment(code, comment, mentions) {
    return $http.post('project/task/createComment', {taskCode: code, comment: comment, mentions: mentions});
}

export function assignTask(data) {
    return $http.post('project/task/assignTask', data);
}

export function batchAssignTask(data) {
    return $http.post('project/task/batchAssignTask', data);
}

export function read(code) {
    return $http.post('project/task/read', {taskCode: code});
}

export function taskDone(code, done) {
    return $http.post('project/task/taskDone', {taskCode: code, done: done});
}

export function setPrivate(code, isPrivate) {
    return $http.post('project/task/setPrivate', {taskCode: code, private: isPrivate});
}

export function recycle(code) {
    return $http.post('project/task/recycle', {taskCode: code});
}

export function recycleBatch(data) {
    return $http.post('project/task/recycleBatch', data);
}

export function recovery(code) {
    return $http.post('project/task/recovery', {taskCode: code});
}

export function del(code) {
    return $http.post('project/task/delete', {taskCode: code});
}

export function dateTotalForProject(data) {
    return $http.post('project/task/dateTotalForProject', data);
}

export function logs(data) {
    return $http.post('project/task/taskLog', data);
}

export function getLogBySelfProject(data) {
    return $http.post('project/project/getLogBySelfProject', data);
}
export function _taskWorkTimeList(data) {
    return $http.post('project/task/_taskWorkTimeList', data);
}
export function saveTaskWorkTime(data) {
    return $http.post('project/task/saveTaskWorkTime', data);
}
export function editTaskWorkTime(data) {
    return $http.post('project/task/editTaskWorkTime', data);
}
export function delTaskWorkTime(data) {
    return $http.post('project/task/delTaskWorkTime', data);
}

