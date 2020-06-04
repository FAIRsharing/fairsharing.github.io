import {has} from 'lodash'

let uiController = {
    namespaced: true,
    state: {
        UIGeneralStatus: {
            bodyOverflowState: false,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        },
    },
    mutations: {
        setGeneralUIAttributesMutation: function (state, statusObject) {
            if (has(statusObject, 'bodyOverflowState')) {
                state.UIGeneralStatus.bodyOverflowState = statusObject.bodyOverflowState;
            }
            if (has(statusObject, 'drawerVisibilityState')) {
                state.UIGeneralStatus.drawerVisibilityState = statusObject.drawerVisibilityState;
            }
            if (has(statusObject, 'headerVisibilityState')) {
                state.UIGeneralStatus.headerVisibilityState = statusObject.headerVisibilityState;
            }
        }
    },
    actions: {
        setGeneralUIAttributesAction: function (state, statusObject) {
            this.commit('uiController/setGeneralUIAttributesMutation', statusObject);
        },
    }
};

export default uiController;

