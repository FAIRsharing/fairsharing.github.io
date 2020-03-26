export const initStateMessages = function(){
    let states = [
        "login",
        "logout",
        "getUser",
        "resetPassword",
        "sendResetEmail",
        "changePassword",
        "updateProfile"
    ];
    let output = {};
    states.forEach(function(state){
        output[state] = {
            message: null,
            error: null
        }
    });
    return output;
};

export const initUserDataState = function(){
    return {
        isLoggedIn: false,
        credentials: {
            token: null,
            tokenValidity: null
        },
        metadata: {},
        records: {}
    }
};

export const validateToken = function(tokenExpiry){
    return new Date() - tokenExpiry >= 0;
};
