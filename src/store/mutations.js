export default {
    SET_LOGGED(state, {tokenList, userInfo}) {
        state.logged = true;
        state.userInfo = userInfo;
    },
    SET_USER(state, data) {
        state.userInfo = data;
    },
    SET_LOGOUT(state) {
        state.logged = false;
        state.userInfo = null;
    },
    setTheme(state, theme) {
        state.theme = theme
    },
    pageLoading(state, status) {
        state.pageLoading = status
    },
    windowLoading(state, status) {
        state.windowLoading = status
    },
    setSystem(state, data) {
        state.system = data;
    },
    setOrganizationList(state, data) {
        state.organizationList = data;
    },
    setCurrentOrganization(state, data) {
        state.currentOrganization = data;
    },
    catchSocketAction(state, data) {
        state.socketAction = data;
    },
    setBoundClient(state, data) {
        state.boundClient = data;
    }
};
