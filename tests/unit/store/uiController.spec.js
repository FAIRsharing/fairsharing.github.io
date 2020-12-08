import {actions, mutations} from "@/store/uiController.js"

describe('Mutations & Actions', () => {

    let state = {};

    beforeEach(() => {
        state = {
            scrollStatus: false,
            stickToTop: false,
            UIGeneralStatus: {
                drawerVisibilityState: false,
                headerVisibilityState: false,
            },
        };
    });

    it("can check the setGeneralUIAttributesAction action", () => {
        let fakeObject = {
            drawerVisibilityState: false,
            headerVisibilityState: true,
        }
        actions.commit = jest.fn();
        actions.setGeneralUIAttributesAction(state, fakeObject);
        expect(actions.commit).toHaveBeenCalledWith("uiController/setUIStatus",fakeObject);
    });

    it("can check the setScrollStatus action", () => {
        let fakeState = true;
        actions.commit = jest.fn();
        actions.setScrollStatus(state, fakeState);
        expect(actions.commit).toHaveBeenCalledWith("uiController/setScrollStatus",fakeState);
    });

    it("can check the setStickToTop action", () => {
        let fakeState = true;
        actions.commit = jest.fn();
        actions.setStickToTop(state, fakeState);
        expect(actions.commit).toHaveBeenCalledWith("uiController/setStickToTop",fakeState);
    });

    it("can check the setScrollStatus Mutations", () => {
        let fakeState = true;
        mutations.setScrollStatus(state, fakeState);
        expect(state.scrollStatus).toBe(true);
    });

    it("can check the setUIStatus Mutations", () => {
        const fakeUIStateObject_caseA = {
            drawerVisibilityState: false,
            headerVisibilityState: true,
        };
        mutations.setUIStatus(state, fakeUIStateObject_caseA);
        expect(state.UIGeneralStatus).toStrictEqual(fakeUIStateObject_caseA);

        const fakeUIStateObject_caseB = {}
        mutations.setUIStatus(state, fakeUIStateObject_caseB);
        expect(state.UIGeneralStatus).toStrictEqual(fakeUIStateObject_caseA);
    });

    it("can check the setStickToTop Mutations", () => {
        let fakeState = true;
        mutations.setStickToTop(state, fakeState);
        expect(state.stickToTop).toBe(true);
    });

    it("can check the setStickToTop Mutations", () => {
        let fakeState = true;
        mutations.setStickToTop(state, fakeState);
        expect(state.stickToTop).toBe(true);
    });

});
