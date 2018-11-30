export default {
    SET_LOGGED(state, {token, user_info}) {
        state.logged = true;
        state.user_info = user_info;
    },
    SET_LOGOUT(state) {
        state.logged = false;
        state.user_info = null;
    },
    SET_PAGE_LOADING(state, status) {
        state.page_loading = status
    },
    SET_LIST_RELOAD(state, reload) {
        state.list_reload = reload
    },
    SET_MENU_SLIDE(state, status) {
        state.show_menu_slide = status
    },
    UPDATE_ONLINE_USER(state, data) {
        state.online_user = data;
    },
    UPDATE_NOTIFY_NO_READ_LIST(state, data) {
        state.notify_no_read_list = data;
    },
    UPDATE_NOTIFY_NO_READ_COUNT(state, num) {
        state.notify_no_read_count = num;
    },
    SET_SYSTEM_INFO(state, data) {
        state.system_info = data;
    },
    SET_LAST_PATH(state, path) {
        state.last_path = path;
    },
    catchSocketAction(state, data) {
        state.socketAction = data;
    }
};
