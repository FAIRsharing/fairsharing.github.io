import RESTClient from "@/components/Client/RESTClient.js"

let client = new RESTClient();

let currentUser = {
    namespaced: true,
    state: {
        userLoggedIn: false,
        currentUserID: null,
        currentUserToken: null,
        tokenValidity: null,
        errors: null
    },
    mutations: {
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
                console.log(user.user.error.response.data.error);
                state.errors = user.user.error.response.data.error;
            }

        },
        autoLogin(state){
            state.userLoggedIn = true;
            state.currentUserToken = localStorage["jwt"];
            state.currentUserID = localStorage.username;
            state.tokenValidity = localStorage.tokenValidity;
            console.log(new Date(1000*state.tokenValidity));
        },
        logoutUser(state){
            state.userLoggedIn = false;
            state.currentUserID = null;
            state.currentUserToken = null;
            state.tokenValidity = null;
            localStorage.clear();
        }
    },
    actions: {
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
                if (validateToken(state.state.tokenValidity)){
                    this.commit("users/autoLogin");
                }
                else {
                    console.log("Token invalid, regenerating");
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
        logout(){
            this.commit("users/logoutUser")
        }
    },
    getters: {},
    modules: {}
};

export default currentUser;

const validateToken = function(tokenExpiry){
    const today = new Date();
    return today - tokenExpiry > 0;
};
