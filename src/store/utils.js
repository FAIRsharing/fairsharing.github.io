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
        records: {},
        is_curator: false,
        role: null
    }
};

export const validateToken = function(tokenExpiry){
    let now = new Date();
    return now.getTime() - tokenExpiry*1000 < 0;
};

export function initEditorSections(data, sectionsNames){
    const schema = {
        generalInformation: {
            type: data.type,
            status: data.status,
            countries: data.countries,
            metadata: data.metadata,
            domains: data.domains,
            subjects: data.subjects,
            taxonomies: data.taxonomies,
            userDefinedTags: data.userDefinedTags,
            deprecation_reason: data.metadata.deprecation_reason || ""
        }
    };
    let sections = {};
    sectionsNames.forEach(name => {
        let copy = (schema[name]) ? JSON.parse(JSON.stringify(schema[name])) : null;
        sections[name] = {
            message: null,
            error: false,
            data: schema[name],
            changes: 0,
            initialData: copy
        }
    });
    return sections;
}
