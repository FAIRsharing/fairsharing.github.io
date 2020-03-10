import RESTClient from "@/components/Client/RESTClient.js"

let client = new RESTClient();

let currentUser = {
    namespaced: true,
    state: {
        userLoggedIn: false,
        currentUserID: null,
        currentUserToken: null,
        autoLogin: true,
    },
    mutations: {
        /*
        TODO: store password in cookies instead of the localstorage to mitigate XSS attacks.
        */
        loginUser(state, user){
            state.userLoggedIn = true;
            state.currentUserID = user.user.username;
            state.currentUserToken = user.user["jwt"];

            localStorage.username = user.user.username;
            localStorage.jwt = user.user.jwt;
            localStorage.pwd = user.pwd;
        },
        autologin(state){
            state.userLoggedIn = true;
            state.currentUserToken = localStorage["jwt"];
            state.currentUserID = localStorage.username;
    },
        logoutUser(state){
            state.userLoggedIn = false;
            state.currentUserID = null;
            state.currentUserToken = null;
            state.autoLogin = false;
            localStorage.clear();
    }
    },
    actions: {
        async login(state, user){
            if (!localStorage.jwt){
                if (user){
                    let response = await client.login(user.name, user.password);
                    this.commit("users/loginUser", {
                        user: response,
                        pwd: user.password
                    });
                }
            }
            else {
                this.commit("users/autologin");
            }
        },
        logout(){
            this.commit("users/logoutUser")
        }
    },
    getters: {},
    modules: {}
};

export default currentUser;
