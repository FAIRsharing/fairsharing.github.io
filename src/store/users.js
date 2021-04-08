import RESTClient from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import { initStateMessages, initUserDataState, validateToken } from "./utils.js"
import getUserQuery from "@/components/GraphClient/queries/getUserMeta.json"
import getPublicUserQuery from "@/components/GraphClient/queries/getPublicUserMeta.json"

let client = new RESTClient();
let graphClient = new GraphClient();

export const mutations = {
    login(state, user){
        state.user = function(){
            return {
                isLoggedIn: true,
                credentials: {
                    username: user.username,
                    token: user["jwt"],
                    tokenValidity: user["expiry"]
                },
                metadata: {},
                records: {},
                is_curator: user.is_curator,
                role: user.role,
                watchedRecords: user.watchedRecords || []
            }
        };
        localStorage.setItem("user", JSON.stringify(state.user()));
    },
    autoLogin(state){
        let user = JSON.parse(localStorage.getItem("user"));
        state.user = function(){
            return user
        };
        state.user();
    },
    logout(state){
        localStorage.removeItem("user");
        state.user = function(){
            return initUserDataState;
        };
        state.messages = function(){
            return initStateMessages();
        };
        state.messages();
    },
    setUser(state, record){
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            let isCurator = user.is_curator;
            let role = user.role;
            let watchedRecords = user.watchedRecords;
            state.user = function () {
                return {
                    isLoggedIn: true,
                    credentials: {
                        username: user.credentials.username,
                        token: user.credentials.token,
                        tokenValidity: user.credentials.tokenValidity
                    },
                    metadata: record.metadata,
                    records: record.records.user,
                    is_curator: isCurator,
                    watchedRecords: watchedRecords,
                    role: role
                }
            };
        }
        else {
            state.user = function () {
                return {
                    isLoggedIn: true,
                    credentials: {
                    },
                    metadata: record.metadata,
                    records: record.records.user,
                    watchedRecords: [],
                    is_curator: false,
                    role: null
                }
            };
        }
    },
    setUserMeta(state, metadata){
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            state.user = function () {
                return {
                    isLoggedIn: true,
                    credentials: {
                        username: user.credentials.username,
                        token: user.credentials.token,
                        tokenValidity: user.credentials.tokenValidity
                    },
                    metadata: metadata,
                    records: {},
                    watchedRecords: []
                }
            };
        }
    },
    setError(state, message){
        state.messages = function(){
            let output = initStateMessages();
            output[message.field] = {
                message: message.message,
                error: true
            };
            return output;
        }
    },
    setMessage(state, message){
        state.messages = function(){
            let output = initStateMessages();
            output[message.field] = {
                message: message.message,
                error: false
            };
            return output;
        }
    },
    clearUserData(state){
        state.user = function(){
            return initUserDataState()
        };
        localStorage.removeItem("user");
    },
    clearMessages(state){
        state.messages = function(){
            return initStateMessages();
        }
    },
    cleanStore(state){
        let previousState = {...state.user()};
        state.user = function(){
            return {
                isLoggedIn: previousState.isLoggedIn,
                credentials: previousState.credentials,
                metadata: {},
                records: {},
                watchedRecords: [],
                is_curator: previousState.is_curator,
                role: previousState.role
            }
        };
    },
    changeWatched(state, watchedRecords) {
        let user = JSON.parse(localStorage.getItem("user"));
        console.log("USER: " + JSON.stringify(user));
        if (user) {
            console.log("WIBBLE!");
            state.user = function () {
                return {
                    isLoggedIn: true,
                    credentials: {
                        username: user.credentials.username,
                        token: user.credentials.token,
                        tokenValidity: user.credentials.tokenValidity
                    },
                    metadata: user.metadata,
                    records: user.records,
                    watchedRecords: watchedRecords
                }
            };
        }
    }
};

export const actions = {
    async login(state, user){
        if (user){
            try {
                let response = await client.login(user.name, user.password);
                if (!response.error) {
                    this.commit("users/clearMessages");
                    this.commit("users/login", response);
                }
                else {
                    this.commit("users/clearUserData");
                    this.commit("users/setError", {
                        field:"login",
                        message:response.error.response.data.error
                    });
                }
            }
            catch(e){
                this.commit("users/setError", {field: "login", message: e.message})
            }
        }
        else {
            let user = localStorage.getItem('user');
            if (user){
                let userData = JSON.parse(user);
                if (validateToken(userData.credentials.tokenValidity)){
                    this.commit("users/autoLogin");
                }
                else {
                    this.commit("users/setError", {
                        field: "login",
                        message: "You session has expired. Please log in again."
                    });
                    this.commit("users/clearUserData");
                }
            }
        }
    },
    async oauthLogin(state, user){
        let userResponse = await client.getUser(user.jwt);
        state.commit("login", {
            username: userResponse.username,
            jwt: user.jwt,
            expiry: user.expiry
        })
    },
    async logout(state){
        try {
            await client.logout(state.state.user().credentials.token);
            this.commit("users/logout");
        }
        catch(e){
            this.commit("users/setError", {field: "logout", message: e.message});
        }
    },
    async getUser(state){
        try {
            const userMetadata = await client.getUser(state.state.user().credentials.token);
            if (userMetadata.error) {
                this.commit("users/setError", {
                    field: "getUser",
                    message: userMetadata.error.response.data.error
                });
                this.commit("users/clearUserData");
            }
            else {
                getUserQuery.queryParam.id = userMetadata.id;
                graphClient.setHeader(state.state.user().credentials.token);
                const userRecords = await graphClient.executeQuery(getUserQuery);
                graphClient.initalizeHeader();
                if (userRecords.error) {
                    this.commit("users/setError", {
                        field: "getUser",
                        message: userRecords.error.response.data.error
                    });
                    this.commit("users/clearUserData");
                }
                else {
                    this.commit('users/setUser', {
                        metadata: userMetadata,
                        records: userRecords
                    });
                }
            }
        }
        catch(e){
            this.commit("users/setError", {
                field: "getUser",
                message: e.message
            });
            this.commit("users/clearUserData");
        }
    },
    async getPublicUser(state, userId) {
        getPublicUserQuery.queryParam.id = parseInt(userId);
        const publicUser = await graphClient.executeQuery(getPublicUserQuery);
        return publicUser;
    },
    async getUserMeta(state){
        try {
            let metadata = await client.getUser(state.state.user().credentials.token);
            if (metadata.error) {
                this.commit("users/setError", {
                    field: "getUser",
                    message: metadata.error
                });
            }
            else {
                this.commit('users/setUserMeta', metadata);
            }
        }
        catch(e){
            this.commit("users/setError", {
                field: "getUser",
                message: e.message
            })
        }
    },
    async updateUser(state, user){
        try {
            let response = await client.editUser(user, state.state.user().credentials.token);
            if (response.error){
                this.commit("users/setError", {
                    field: "updateProfile",
                    message: response.error.response.data.errors
                })
            }
            else {
                this.commit("users/setMessage", {
                    field: "updateProfile",
                    message: "Update successful !"
                })
            }
        }
        catch(e) {
            this.commit("users/setError", {field: "updateProfile", message: e.message})
        }
    },
    async updateWatchedRecords(state, user) {
        let response = await client.editUser(user, state.state.user().credentials.token);
        return response;
    },
    async resetPwd(state, query){
        try {
            let resetPwd = await client.resetPassword(query);
            if (resetPwd.error){
                this.commit("users/setError", {
                    field: "resetPassword",
                    message: resetPwd.error.response.data.errors
                })
            }
            else {
                this.commit('users/setMessage', {
                    field: "resetPassword",
                    message: resetPwd
                });
                this.commit("users/setMessage", {
                    field: "login",
                    message: "Password change successful. Please log back in."
                });
            }
        }
        catch(e) {
            this.commit('users/setError', {
                field: "resetPassword",
                message: e.message
            })
        }
    },
    async resetPwdWithoutToken(state, user){
        try {
            let response = await client.resetPasswordWithoutToken(state.state.user().credentials.token, user);
            if (response.error){
                this.commit("users/setError", {
                    field: "resetPassword",
                    message: response.error.response.data.errors
                })
            }
            else {
                this.commit("users/logout");
                this.commit("users/setMessage", {
                    field: "login",
                    message: "Password change successful. Please log back in."
                });
            }
        }
        catch(e){
            this.commit("users/setError", {field: "resetPassword", message: e.message})
        }
    },
    async validateUserToken(state){
        let validity = await client.validateToken(state.state.user().credentials.token);
        if (!validity.success){
            this.commit("users/logout");
            this.commit("users/setError", {
                field: "getUser",
                message: validity
            });
        }
    },
    setError(state, error){
        this.commit("users/setError", {
            field: error.field,
            message: error.message
        })
    },
    setMessage(state, message){
        this.commit("users/setMessage", message);
    }
};

let currentUser = {
    namespaced: true,
    state: {
        user: function(){
            return initUserDataState()
        },
        messages: function(){
            return initStateMessages();
        }
    },
    mutations: mutations,
    actions: actions,
    getters: {},
    modules: {}
};

export default currentUser;
