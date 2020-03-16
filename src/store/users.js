import RESTClient from "@/components/Client/RESTClient.js"

let client = new RESTClient();

export const mutations = {
    /*
    TODO: store password in cookies instead of the localstorage to mitigate XSS attacks.
    */
    login(state, user){
        state.errors = null;
        if (!user.user.error){
            state.userLoggedIn = true;
            state.currentUserID = user.user.username;
            state.currentUserToken = user.user["jwt"];
            state.tokenValidity = user.user.expiry;
            localStorage.username = user.user.username;
            localStorage.jwt = user.user.jwt;
            localStorage.pwd = user.pwd;
            localStorage.tokenValidity = user.user.expiry;
        }
        else {
            state.errors = user.user.error.response.data.error;
        }

    },
    autoLogin(state){
        state.userLoggedIn = true;
        state.currentUserToken = localStorage["jwt"];
        state.currentUserID = localStorage.username;
        state.tokenValidity = localStorage.tokenValidity;
    },
    logoutUser(state){
        state.userLoggedIn = false;
        state.currentUserID = null;
        state.currentUserToken = null;
        state.tokenValidity = null;
        localStorage.clear();
    }
};

export const actions = {
    async login(state, user){
        if (!localStorage.jwt){
            if (user){
                let response = await client.login(user.name, user.password);
                this.commit("users/login", {
                    user: response,
                    pwd: user.password
                });
            }
        }
        else {
            if (validateToken(state.tokenValidity)){
                this.commit("users/autoLogin");
            }
            else {
                const user = {
                    name: localStorage.username,
                    password: localStorage.pwd
                };
                let response = await client.login(user.name, user.password);
                this.commit("users/login", {
                    user: response,
                    pwd: user.password
                });
            }
        }
    },
    async logout(state, token){
        await client.logout(token);
        this.commit("users/logoutUser");
    }
};

let currentUser = {
    namespaced: true,
    state: {
        userLoggedIn: false,
        currentUserID: null,
        currentUserToken: null,
        tokenValidity: null,
        errors: null
    },
    mutations: mutations,
    actions: actions,
    getters: {},
    modules: {}
};

export default currentUser;

const validateToken = function(tokenExpiry){
    const today = new Date();
    return today - tokenExpiry >= 0;
};
