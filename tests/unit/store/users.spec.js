import { mutations, actions } from "@/store/users.js"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import { initUserDataState } from "@/store/utils.js"
import Vue from "vue"
import sinon from "sinon"

Vue.config.silent = true;

describe('Actions/Mutations', () => {
    let getStub;
    let restClientStub;
    let graphStub;

    beforeEach(() => {
        // jest.spyOn(Storage.prototype, 'setItem');
        jest.spyOn(Storage.prototype, 'removeItem');
        getStub = sinon.stub(Storage.prototype, 'getItem');
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        actions.commit = jest.fn();
        restClientStub = sinon.stub(Client.prototype, "executeQuery");
    });
    afterEach(() => {
        jest.clearAllMocks();
        getStub.restore();
        restClientStub.restore();
        graphStub.restore();
    });

    it("Login: testing no user and valid token", async () => {
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

    it("Login: testing no user and invalid token", async () => {
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

    it("Login: testing no user and no data", async () => {
        let state = {};
        getStub.withArgs("user").returns();
        await actions.login(state);
        expect(actions.commit).not.toHaveBeenCalled()
    });

    it("Login: testing with a user and no error", async () => {
        let state = {};
        restClientStub.withArgs(sinon.match.any).returns({data:{
            username: "Terazus",
            jwt: 123,
            expiry: 456
        }});
        let user = {
            name: "Terazus",
            password: "fakePassword"
        };
        await actions.login(state, user);
        expect(actions.commit).toHaveBeenCalledWith("users/clearMessages");
        expect(actions.commit).toHaveBeenCalledWith("users/login", {
            expiry: 456,
            jwt: 123,
            username: "Terazus",
        })
    });

    it("Login: testing with a user and errors", async () => {
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

    });

    it("Login: testing automatically", () => {
        const state = {};
        getStub.withArgs("user").returns(JSON.stringify({
            credentials: {
                username: "Terazus",
                token: "123",
            }
        }));
        mutations.autoLogin(state);
        expect(state.user()).toStrictEqual({"credentials": {"token": "123", "username": "Terazus"}})
    });

    it("Logout Action: can logout a user", async () => {
        let state = {};
        mutations.logout(state);
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it("Logout Mutation: can logout a user", async () => {
        restClientStub.returns({
            data: {
                message: "Success"
            }
        });
        let state = {
            state: {
                user: function(){
                    return {
                        credentials: {
                            token: 123
                        }
                    }
                }
            }
        };
        actions.commit = jest.fn();
        actions.logout(state);
        expect(actions.commit).not.toHaveBeenCalled();
        restClientStub.returns({
            data: new Error("error")
        });
        state = {};
        actions.logout(state);
        expect(actions.commit).toHaveBeenCalledWith(
            "users/setError",
            {"field": "logout", "message": "Cannot read property 'user' of undefined"}
        );
    });

    it("setUser: can set user data", () => {
        const state = {};
        const user = {
            credentials: {
                username: "Terazus",
                token: 123,
                tokenValidity: 123
            },
            records: {user: {}},
            metadata: {
                username: "Terazus"
            },
            isLoggedIn: true,
            is_curator: false,
            role: null
        };
        getStub.withArgs("user").returns(JSON.stringify(user));
        mutations.setUser(state, user);
        expect(state.user()).toStrictEqual({
            credentials: {
                username: "Terazus",
                token: 123,
                tokenValidity: 123
            },
            records: {},
            metadata: {username: "Terazus"},
            isLoggedIn: true,
            is_curator: false,
            role: null
        });
    });

    it("setUser: can set user metadata", () => {
        const state = {};
        const user = {
            username: "Terazus"
        };
        getStub.withArgs("user").returns(JSON.stringify({
            credentials: {
                username: "Terazus",
                token: 123,
                tokenValidity: 123
            }
        }));
        mutations.setUserMeta(state, user);
        expect(state.user()).toStrictEqual({
            credentials: {
                username: "Terazus",
                token: 123,
                tokenValidity: 123
            },
            records: {},
            metadata: {username: "Terazus"},
            isLoggedIn: true
        });
    });

    it("Utils: can correctly clear the store", () => {
        const state = {
            user: "test"
        } ;
        const userDefaultState = initUserDataState();
        mutations.clearUserData(state);
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        expect(state.user()).toStrictEqual(userDefaultState);
    });

    it("Error Handling: getUser outer case", async () => {
        let state = {};
        restClientStub.returns({
            data: new Error("error")
        });
        await actions.getUser(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {
            "field": "getUser",
            "message": "Cannot read property 'user' of undefined"
        });

    });

    it('Error Handling: getUser inner case 1', async () => {
        let state = {
            state: {
                user: function(){
                    return {
                        credentials: {
                            token: 123
                        }
                    }
                }
            }
        };
        restClientStub.returns({
            data: {error: {response: {data: {error: "Error"}}}}
        });
        await actions.getUser(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError",
            {"field": "getUser", "message": "Error"})
    });

    it('Error Handling: getUser inner case 2', async () => {
        let state = {
            state: {
                user: function(){
                    return {
                        credentials: {
                            token: 123
                        }
                    }
                }
            }
        };
        restClientStub.returns({
            data: {
                message: "Hello"
            }
        });
        graphStub.returns({
            error: {response: {data: {error: "Error"}}}
        });
        await actions.getUser(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError",
            {"field": "getUser", "message": "Error"})
    });

    it("Error Handling: getUserMeta outer case", async () => {
        restClientStub.returns({
            data: new Error("Error")
        });
        const state = {};
        await actions.getUserMeta(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {
            field: "getUser",
            message: "Cannot read property 'user' of undefined"
        })
    });

    it('Error Handling: getUserMeta inner case', async () => {
        let state = {
            state: {
                user: function(){
                    return {
                        credentials: {
                            token: 123
                        }
                    }
                }
            }
        };
        restClientStub.returns({
            data: {error: "Error"}
        });
        await actions.getUserMeta(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError",{
            "field": "getUser", "message": "Error"
        });
    });

    it("Error Handling: getUserMeta outer case", async () => {
        restClientStub.returns({
            data: new Error("Error")
        });
        const state = {};
        await actions.updateUser(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {
            field: "updateProfile",
            message: "Cannot read property 'user' of undefined"
        })
    });

    it('Error Handling: getUserMeta inner case', async () => {
        let state = {
            state: {
                user: function(){
                    return {
                        credentials: {
                            token: 123
                        }
                    }
                }
            }
        };
        restClientStub.returns({
            data: {error: "Error"}
        });
        await actions.updateUser(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError",{
            "field": "updateProfile", "message": "Cannot read property 'data' of undefined"
        });
    });

    it("Error Handling: resetPwd outer case", async () => {
        restClientStub.returns(new Error("Error"));
        const state = {};
        await actions.resetPwd(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {
            field: "resetPassword",
            message: "Cannot read property 'error' of undefined"
        })
    });

    it("Error Handling: resetPwdWithoutToken outer case", async () => {
        restClientStub.returns(new Error("Error"));
        const state = {};
        await actions.resetPwdWithoutToken(state);
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {
            field: "resetPassword",
            message: "Cannot read property 'user' of undefined"
        })
    });

    it("Can correctly validate a user token", async() => {
        restClientStub.returns({data: {success: true}});
        let state = {
            state: {user: () => {
                return {credentials:{ token: 123}}
            }}
        };
        await actions.validateUserToken(state);
        expect(actions.commit).toHaveBeenCalledTimes(0);
        restClientStub.restore();

        restClientStub = sinon.stub(Client.prototype, 'executeQuery');
        restClientStub.returns({data: {success: false}});
        state.state.user = () => {
            return {credentials:{ token: 123}}
        };
        await actions.validateUserToken(state);
        expect(actions.commit).toHaveBeenCalledWith("users/logout");
        expect(actions.commit).toHaveBeenCalledWith("users/setError", {
            field: "getUser",
            message: {success: false}
        });
        restClientStub.restore();
    });


});
