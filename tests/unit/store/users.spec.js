import { mutations, actions } from "@/store/users.js"
import Client from "@/components/Client/RESTClient.js"
import sinon from "sinon"

describe('Actions', () => {
    let getStub;
    let restClientStub;

    beforeEach(() => {
        // jest.spyOn(Storage.prototype, 'setItem');
        getStub = sinon.stub(Storage.prototype, 'getItem');
        actions.commit = jest.fn();
        restClientStub = sinon.stub(Client.prototype, "executeQuery");
    });
    afterEach(() => {
        jest.clearAllMocks();
        getStub.restore();
        restClientStub.restore();
    });

    it("testing login action: no user and valid token", async () => {
        let now = new Date();
        getStub.withArgs("user").returns(JSON.stringify({
            credentials: {
                username: "Terazus",
                token: "123",
                tokenValidity: now.getTime()
            }
        }));
        let state = {};
        await actions.login(state);
        expect(actions.commit).toHaveBeenCalledWith('users/autoLogin');
    });

    it("testing login action: no user and invalid token", async () => {
        let state = {};
        getStub.withArgs("user").returns(JSON.stringify({
            credentials: {
                username: "Terazus",
                token: "123",
                tokenValidity: "100039"
            }
        }));
        await actions.login(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {"field": "login", "message": "You session has expired. Please log in again."});
    });

    it("testing login action: no user and no data", async () => {
        let state = {};
        getStub.withArgs("user").returns();
        await actions.login(state);
        expect(actions.commit).not.toHaveBeenCalled()
    });

    it("testing login action with a user and no error", async () => {
        let state = {};
        restClientStub.withArgs(sinon.match.any).returns({
            data: {message: "Hello"}
        });
        let user = {
            name: "Terazus",
            password: "fakePassword"
        };
        await actions.login(state, user);
        expect(actions.commit).toHaveBeenCalledWith("users/clearMessages");
        expect(actions.commit).toHaveBeenCalledWith("users/login",
            {pwd: "fakePassword", user: {"message": "Hello"}})
    });

    it("testing login action with a user and errors", async () => {
        let state = {};
        restClientStub.withArgs(sinon.match.any).returns({
            data: {error: {response: {data: {error: "Error"}}}}
        });
        let user = {
            name: "Terazus",
            password: "fakePassword"
        };
        await actions.login(state, user);
        expect(actions.commit).toHaveBeenCalledWith("users/clearUserData");
        expect(actions.commit).toHaveBeenCalledWith("users/setError",
            {field: "login", message: "Error"});
        restClientStub.withArgs(sinon.match.any).returns(new Error("error"));
        await expect(actions.login(state, user)).rejects;

    })


});
