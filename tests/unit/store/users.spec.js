import { mutations, actions } from "src/store/users.js"
import Client from "src/components/Client/RESTClient.js"
import sinon from "sinon"

describe('Mutations', () => {

    it('can autologin', () => {
        const state = {};
        mutations.autoLogin(state);
        expect(state).toStrictEqual({ userLoggedIn: true,
            currentUserToken: undefined,
            currentUserID: undefined,
            tokenValidity: undefined }
        );
    });

    it('testing login branches', () => {
        let stub  = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({data: "Hello"});
        actions.login({}, {name: "Terazus", password: "LOL!"});
        actions.login({});
        // Mock local storage
        let localStorageMock = (function() {
            return {
                jwt: '1234'
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        let state = {tokenValidity: new Date()};
        actions.login(state);
        state = {};
        actions.login(state);
        stub.restore();
    });

});
