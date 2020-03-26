import RESTClient from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import getUserQuery from "@/components/GraphClient/queries/getUserMeta.json"

let client = new RESTClient();
let graphClient = new GraphClient();

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
            localStorage.clear();
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
        state.errors = null;
        state.userLoggedIn = false;
        state.currentUserID = null;
        state.currentUserToken = null;
        state.tokenValidity = null;
        localStorage.clear();
    },
    setUserRecords(state, record){
        state.userRecords = record.user;
    },
    setUserMeta(state, user){
        state.user = user;
    },
    setResetPwdMessage(state, message){
        state.userResetPwdMessage = message
    }
};

export const actions = {
    async login(state, user){
        if (!localStorage.jwt){
            if (user){
                try {
                    let response = await client.login(user.name, user.password);
                    this.commit("users/login", {
                        user: response,
                        pwd: user.password
                    });
                }
                catch(e){
                    //
                }
            }
        }
        else {
            try {
                if (validateToken(state.tokenValidity)) {
                    this.commit("users/autoLogin");
                } else {
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
            catch(e){
                //
            }
        }
    },
    async logout(state){
        try {
            await client.logout(state.state.currentUserToken);
            this.commit("users/logoutUser");
        }
        catch(e){
            //
        }
    },
    async getUser(state){
        let metadata = await client.getUser(state.state.currentUserToken);
        getUserQuery.queryParam.id = metadata.id;
        this.commit('users/setUserRecords', await await graphClient.executeQuery(getUserQuery));
        this.commit('users/setUserMeta', metadata);
    },
    async getUserMeta(state){
        let metadata = await client.getUser(state.state.currentUserToken);
        this.commit('users/setUserMeta', metadata);
    },
    async resetPwd(state){
        let resetPwd = await client.requestResetPwd(state.state.user.email);
        this.commit('users/setResetPwdMessage', resetPwd)
    },
    async resetPwdWithoutToken(state, user){
        try {
            let response = await client.resetPasswordWithoutToken(state.state.currentUserToken, user);
            if (response.error){
                state.state.errors = response.error;
            }
            else {
                this.commit("users/logoutUser");
            }
        }
        catch(e){
            state.state.errors = e.message
        }
    }
};

let currentUser = {
    namespaced: true,
    state: {
        userLoggedIn: false,
        currentUserID: null,
        currentUserToken: null,
        tokenValidity: null,
        errors: null,
        userRecords: null,
        user: null,
        userResetPwdMessage: null
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
