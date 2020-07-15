import {actions, mutations} from "@/store/uiController.js"

describe('Mutations & Actions', () => {

    let state = {
        scrollStatus: false,
        UIGeneralStatus: {
            bodyOverflowState: false,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        },
    };

    beforeEach(() => {
        state = {
            scrollStatus: false,
            UIGeneralStatus: {
                bodyOverflowState: false,
                drawerVisibilityState: false,
                headerVisibilityState: false,
            },
        };
    });

    it("can check the setGeneralUIAttributesAction action", () => {

        let fakeObject = {
            bodyOverflowState: false,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        }
        actions.commit = jest.fn();
        actions.setGeneralUIAttributesAction(state, fakeObject);
        expect(actions.commit).toHaveBeenCalledTimes(1);

    });

    it("can check the setScrollStatus action", () => {

        let fakeState = true;
        actions.commit = jest.fn();
        actions.setScrollStatus(state, fakeState);
        expect(actions.commit).toHaveBeenCalledTimes(1);

    });

    it("can check the setScrollStatus Mutations", () => {

        let fakeState = true;
        mutations.setScrollStatus(state, fakeState);
        expect(state.scrollStatus).toBe(true);

    });

    it("can check the setUIStatus Mutations", () => {

        const fakeUIStateObject_caseA = {
            bodyOverflowState: false,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        };
        mutations.setUIStatus(state, fakeUIStateObject_caseA);
        expect(state.UIGeneralStatus).toStrictEqual(fakeUIStateObject_caseA);

        const fakeUIStateObject_caseB = {}
        mutations.setUIStatus(state, fakeUIStateObject_caseB);
        expect(state.UIGeneralStatus).toStrictEqual(fakeUIStateObject_caseA);

    });

});
