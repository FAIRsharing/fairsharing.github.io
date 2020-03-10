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
        loginUser(state, user){
            if (user.username && user["jwt"]){
                state.userLoggedIn = true;
                state.currentUserID = user.username;
                state.currentUserToken = user["jwt"];
            }
        },
        logoutUser(state){
            state.userLoggedIn = false;
            state.currentUserID = null;
            state.currentUserToken = null;
            state.autoLogin = false;
        }
    },
    actions: {
        async login(state, user){
            let response = await client.login(user.name, user.password);
            this.commit("users/loginUser", response);
        },
        logout(){
            this.commit("users/logoutUser")
        }
    },
    getters: {},
    modules: {}
};

export default currentUser;