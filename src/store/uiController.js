let uiController = {
    namespaced: true,
    state: {
        scrollStatus: false,
        UIGeneralStatus: {
            bodyOverflowState: false,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        },
    },
    mutations: {
        setScrollStatus(state, status) {
            state.scrollStatus = status;
        },
        setUIStatus: function (state, statusObject) {
            if (Object.prototype.hasOwnProperty.call(statusObject, 'bodyOverflowState')) {
                state.UIGeneralStatus.bodyOverflowState = statusObject.bodyOverflowState;
            }
            if (Object.prototype.hasOwnProperty.call(statusObject, 'drawerVisibilityState')) {
                state.UIGeneralStatus.drawerVisibilityState = statusObject.drawerVisibilityState;
            }
            if (Object.prototype.hasOwnProperty.call(statusObject, 'headerVisibilityState')) {
                state.UIGeneralStatus.headerVisibilityState = statusObject.headerVisibilityState;
            }
        }
    },
    actions: {
        setGeneralUIAttributesAction: function (state, statusObject) {
            this.commit('uiController/setUIStatus', statusObject);
        },
        setScrollStatus: function (state, status) {
            this.commit('uiController/setScrollStatus', status);
        }
    }
};
export default uiController;
