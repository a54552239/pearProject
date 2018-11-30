import $http from '../assets/js/http'

export async function getTeamUser(team_id = 0, page_size = 50, page_num = 1, keyword = '') {
    return $http.post('Team_Team.getTeamUser', {
        team_id: team_id,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}


export function getList(pid = 0, page_size, page_num, keyword) {
    return $http.post('Team_Team.getList', {
        pid: pid,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword,
    });
}

export function getNoInTeamUser(team_id = 0, page_size = 20, page_num = 1, keyword = '') {
    return $http.post('Team_Team.getNoInTeamUser', {
        team_id: team_id,
        page_size: page_size,
        page_num: page_num,
        keyword: keyword
    });
}

export function addTeamUser(team_id, user_id) {
    return $http.post('Team_Team.addTeamUser', {
        team_id: team_id,
        user_id: user_id
    });
}
export function delTeamUser(team_id, user_id) {
    return $http.post('Team_User.delTeamUser', {
        team_id: team_id,
        user_id: user_id
    });
}

export function editLeader(team_id, user_id, state) {
    return $http.post('Team_Team.editLeader', {
        team_id: team_id,
        user_id: user_id,
        state: state
    });
}

export function getInfo(team_id) {
    return $http.post('Team_Team.getInfo', {team_id: team_id});
}

export function delTeam(ids) {
    return $http.post('Team_Team.delTeam', {ids: ids});
}

export function changeState(team_id, state) {
    return $http.post('Team_Team.changeState', {team_id: team_id, state: state});
}

export function doTeam(action = 'add', data) {
    let url = 'Team_Team.addTeam';
    if (action === 'edit') {
        url = 'Team_Team.editTeam'
    }
    return $http.post(url, data);
}
