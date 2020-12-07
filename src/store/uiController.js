export const mutations = {
    setScrollStatus(state, status) {
        state.scrollStatus = status;
    },
    setStickToTop(state, status) {
        state.stickToTop = status;
    },
    setUIStatus: function (state, statusObject) {
        if (Object.prototype.hasOwnProperty.call(statusObject, 'drawerVisibilityState')) {
            state.UIGeneralStatus.drawerVisibilityState = statusObject.drawerVisibilityState;
        }
        if (Object.prototype.hasOwnProperty.call(statusObject, 'headerVisibilityState')) {
            state.UIGeneralStatus.headerVisibilityState = statusObject.headerVisibilityState;
        }
    }
};
export const actions = {
    setGeneralUIAttributesAction: function (state, statusObject) {
        this.commit('uiController/setUIStatus', statusObject);
    },
    setScrollStatus: function (state, status) {
        this.commit('uiController/setScrollStatus', status);
    },
    setStickToTop: function (state, status) {
        this.commit('uiController/setStickToTop', status);
    },
};
let uiController = {
    namespaced: true,
    state: {
        scrollStatus: false,
        stickToTop:false,
        UIGeneralStatus: {
            drawerVisibilityState: false,
            headerVisibilityState: true,
        },
    },
    mutations: mutations,
    actions: actions
};
export default uiController;
