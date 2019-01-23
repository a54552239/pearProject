import $http from '../assets/js/http'
import {COMMON} from '../const/common'

export function getList(state = -1, page_size, page_num, keyword = '') {
    return $http.post('Project_Project.getList', {
        state: state,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export function getListForUser(state, page_size, page_num, keyword, end_time = '') {
    return $http.post('Project_Project.getListForUser', {
        state: state,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword,
        end_time: end_time,
    });
}

export function getListForUserObject(data) {
    return $http.post('Project_Project.getListForUser', data);
}

export function getInfo(project_id) {
    return $http.post('Project_Project.getInfo', {project_id: project_id});
}

export function delProject(ids) {
    return $http.post('Project_Project.delProject', {ids: ids});
}

export function getUserList(project_id, keyword = '', task_id = 0) {
    return $http.post('Project_Project.getProjectUserList', {
        project_id: project_id,
        keyword: keyword,
        task_id: task_id
    });
}

export function getTypeInfo(project_type_id) {
    return $http.post('Project_ProjectType.getInfo', {project_type_id: project_type_id});
}

export function getTypeList(page_size = COMMON.PAGE_SIZE, page_num = COMMON.PAGE_NUM, keyword = '') {
    return $http.post('Project_ProjectType.getList', {page_size: page_size, page_num: page_num, keyword: keyword});
}

export function delProjectType(ids) {
    return $http.post('Project_ProjectType.delProjectType', {ids: ids});
}

export function doProjectType(action = 'add', data) {
    let url = 'Project_ProjectType.addProjectType';
    if (action === 'edit') {
        url = 'Project_ProjectType.editProjectType'
    }
    return $http.post(url, data);
}

export function getLevelList(sort = 'sort asc', page_size = 50, page_num = 1, keyword = '') {
    return $http.post('Project_Level.getList', {page_size: page_size, sort: sort, page_num, keyword: keyword});
}

export function getLevelInfo(level_id) {
    return $http.post('Project_Level.getInfo', {level_id: level_id});
}

export function delLevel(ids) {
    return $http.post('Project_Level.delLevel', {ids: ids});
}

export function doProjectLevel(action = 'add', data) {
    let url = 'Project_Level.addLevel';
    if (action === 'edit') {
        url = 'Project_Level.editLevel'
    }
    return $http.post(url, data);
}

export function getLogList(project_id, contain_task_log = 1) {
    return $http.post('Project_Project.getProjectLogList', {
        project_id: project_id,
        contain_task_log: contain_task_log
    });
}

export function getTicketList() {
    return $http.post('Project_Project.getProjectTicketList');
}

export function getStateList() {
    return $http.post('Project_Project.getProjectStateList');
}

export function getStatisticsByAll(jixiao = false, type = 'current_month') {
    return $http.post('Project_Project.getProjectStatisticsByAll', {type: type, jixiao: jixiao});
}

export function selectProjectUser(project_id, keyword) {
    return $http.post('Project_Project.selectProjectUser', {project_id: project_id, keyword: keyword});
}

export function delProjectUser(user_id, project_id) {
    return $http.post('Project_Project.delProjectUser', {user_id: user_id, project_id: project_id});
}

export function addProjectUser(user_id, project_id) {
    return $http.post('Project_Project.addProjectUser', {user_id: user_id, project_id: project_id});
}

export function doProject(action = 'add', data) {
    let url = 'Project_Project.addProject';
    if (action === 'edit') {
        url = 'Project_Project.editProject'
    }
    return $http.post(url, data);
}

export function getTaskInfo(task_id) {
    return $http.post('Project_Task.getInfo', {task_id: task_id});
}

export function exchangeTaskSort(list) {
    return $http.post('Project_Task.exchangeTaskSort', {list: list});
}

export function exchangeTaskTypeSort(list) {
    return $http.post('Project_TaskType.exchangeTaskTypeSort', {list: list});
}

export function getTaskLog(task_id, show_all) {
    return $http.post('Project_Task.getTaskLog', {task_id: task_id, show_all: show_all});
}

export function getTaskUserList(task_id) {
    return $http.post('Project_Task.getTaskUserList', {task_id: task_id});
}

export function getTaskFileList(task_id) {
    return $http.post('Project_Task.getTaskFileList', {task_id: task_id});
}

export function getTaskStatisticsByAll(type = 'month', task_id) {
    return $http.post('Project_Task.getTaskStatisticsByAll', {type: type, task_id: task_id});
}

export function getListOverview(team_id = 0, page_size = COMMON.PAGE_SIZE, task_type = 0, task_state = -1) {
    return $http.post('Project_Task.getListOverview', {
        team_id: team_id,
        page_size: page_size,
        task_type: task_type,
        task_state: task_state
    });
}

export function addTask({content, executor_id, name, project_id, task_count, task_type, title, pid}) {
    return $http.post('Project_Task.addTask', {
        content,
        executor_id,
        name,
        project_id,
        task_count,
        task_type,
        title,
        pid: pid
    });
}

export function editTask(data) {
    return $http.post('Project_Task.editTask', data);
}

export function delTask(id) {
    return $http.post('Project_Task.delTask', {id: id});
}

export function delTaskFile(file_id) {
    return $http.post('Project_Task.delTaskFile', {file_id: file_id});
}

export function delTypeTask(project_id, type_id) {
    return $http.post('Project_Task.delTypeTask', {project_id: project_id, type_id: type_id});
}

export function addTaskExecutorUser(task_id, user_id) {
    return $http.post('Project_Task.addTaskExecutorUser', {task_id: task_id, user_id: user_id});
}

export function addTaskUser(task_id, user_id) {
    return $http.post('Project_Task.addTaskUser', {task_id: task_id, user_id: user_id});
}

export function setTypeTaskEndTime(project_id, type_id, end_time) {
    return $http.post('Project_Task.setTypeTaskEndTime', {
        project_id: project_id,
        type_id: type_id,
        end_time: end_time
    });
}

export function setTypeTaskExecutor(project_id, type_id, user_id) {
    return $http.post('Project_Task.setTypeTaskExecutor', {
        project_id: project_id,
        type_id: type_id,
        user_id: user_id
    });
}

export function setTaskState(task_id, state) {
    return $http.post('Project_Task.setTaskState', {task_id: task_id, task_state: state});
}

export function getTaskForUser(is_executor, state, project_id = 0, is_overdue = 0) {
    return $http.post('project_Task.getTaskForUser', {
        is_executor: is_executor,
        state: state,
        project_id: project_id,
        is_overdue: is_overdue
    });
}

export function getTaskForUserObject(data) {
    return $http.post('project_Task.getTaskForUser', data);
}

export function getTeamTaskLog() {
    return $http.post('project_Task.getTeamTaskLog');
}

export function getTaskStatisticsByTeam(type = 'week') {
    return $http.post('Project_Task.getTaskStatisticsByTeam', {type: type});
}

export function getTaskList(project_id, task_type) {
    return $http.post('Project_Task.getList', {project_id: project_id, task_type: task_type});
}

export function getTaskLevel() {
    return $http.post('Project_Task.getTaskLevelList');
}

export function getTaskTagList(project_id) {
    return $http.post('Project_Task.getTaskTagList', {project_id: project_id});
}

export function createTaskTag(task_id, project_id, name, color) {
    return $http.post('Project_Task.addTaskTag', {task_id: task_id, project_id: project_id, name: name, color: color});
}
export function editTaskTag(tag_id, name, color) {
    return $http.post('Project_Task.editTaskTag', {id: tag_id, name: name, color: color});
}


export function getTaskExecuteStateList() {
    return $http.post('Project_Task.getTaskExecuteStateList');
}

export function getTaskTypeList(project_id, page_size = COMMON.PAGE_SIZE) {
    return $http.post('Project_TaskType.getList', {project_id: project_id, page_size: page_size});
}

export function addTaskType(type_name, project_id, sort = 0) {
    return $http.post('Project_TaskType.addTaskType', {type_name: type_name, project_id: project_id, sort: sort});
}

export function editTaskType(task_type_id, type_name) {
    return $http.post('Project_TaskType.editTaskType', {
        task_type_id: task_type_id,
        type_name: type_name
    });
}

export function delTaskType(task_type_id) {
    return $http.post('Project_TaskType.delTaskType', {task_type_id: task_type_id});
}

export function getProjectBuildList(project_id, keyword) {
    return $http.post('Project_Project.getProjectBuildList', {project_id: project_id, keyword: keyword});
}

export function getBuildInfo(id) {
    return $http.post('Project_Project.getBuildInfo', {id: id});
}

export function deleteProjectBuild(id) {
    return $http.post('Project_Project.deleteProjectBuild', {id: id});
}

export function doProjectBuild(data) {
    return $http.post('Project_Project.addProjectBuild', data);
}

export function getProjectFileList(project_id, keyword) {
    return $http.post('Project_Project.getProjectFileList', {project_id: project_id, keyword: keyword});
}

export function getTaskTypeTemplateInfo(template_id) {
    return $http.post('Project_TaskTypeTemplate.getInfo', {template_id: template_id});
}

export function delTaskTypeTemplate(ids) {
    return $http.post('Project_TaskTypeTemplate.delTaskTypeTemplate', {ids: ids});
}

export function getTaskTypeTemplateList(project_type_id, page_size, page_num, keyword) {
    return $http.post('Project_TaskTypeTemplate.getList', {
        project_type_id: project_type_id,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export function doProjectTemplate(action = 'add', data) {
    let url = 'Project_TaskTypeTemplate.addTaskTypeTemplate';
    if (action === 'edit') {
        url = 'Project_TaskTypeTemplate.editTaskTypeTemplate'
    }
    return $http.post(url, data);
}

export function addTaskComment(task_id, comment) {
    return $http.post('Project_Task.addTaskComment', {task_id: task_id, memo: comment});
}

export function editTaskComment(id, comment) {
    return $http.post('Project_Task.editTaskComment', {id: id, memo: comment});
}

export function delTaskComment(id) {
    return $http.post('Project_Task.delTaskComment', {id: id});
}

