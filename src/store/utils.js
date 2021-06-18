export const initStateMessages = function(){
    let states = [
        "login",
        "logout",
        "getUser",
        "getPublicUser",
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
        id: null,
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
    let emptyData = {
        type: {},
        status: {},
        countries: [],
        metadata: {
            name: null,
            abbreviation: null,
            homepage: null,
            year_creation: null,
            description: null,
            deprecation_reason: ""
        },
        is_dataset: false
    };
    let sections = {};
    if (data) {
        const schema = {
            generalInformation: {
                type: data.type,
                status: data.status,
                countries: data.countries,
                metadata: data.metadata,
                registry: data.registry,
                name: data.name,
                domains: data.domains.map((obj) => {
                    obj.label = obj.label.toLowerCase();
                    return obj;
                }),
                subjects: data.subjects.map((obj) => {
                    obj.label = obj.label.toLowerCase();
                    return obj;
                }),
                taxonomies: data.taxonomies.map((obj) => {
                    obj.label = obj.label.toLowerCase();
                    return obj;
                }),
                userDefinedTags: data.userDefinedTags.map((obj) => {
                    obj.label = obj.label.toLowerCase();
                    return obj;
                }),
                is_dataset: false
            },
            additionalInformation: {
                ...JSON.parse(JSON.stringify(data.metadata)),
                type: JSON.parse(JSON.stringify(data.type))
            },
            publications: data.publications,
            organisations: data.organisationLinks,
            dataAccess: {
                support_links: (data.metadata.support_links) ? JSON.parse(JSON.stringify(data.metadata.support_links)): [],
                licences: data.licenceLinks
            },
            relations: {
                recordAssociations: data.recordAssociations,
                registry: JSON.parse(JSON.stringify(data.registry)),
                type: JSON.parse(JSON.stringify(data.type)),
                name: JSON.parse(JSON.stringify(data.name))
            }
        };
        schema.generalInformation.metadata.deprecation_reason = data.metadata.deprecation_reason || "";
        if (data.publications) {
            schema.publications.forEach((pub) => {
                pub.isCitation = !!data.metadata.citations.filter(obj => obj.publication_id === pub.id)[0];
            });
        }
        schema.dataAccess.support_links.forEach(supportLink => {
            if (supportLink.name) supportLink.url = {title : supportLink.name, url: supportLink.url};
        });
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
    }
    else {
        sections.generalInformation = {
            changes: 0,
            message: null,
            error: false,
            data: emptyData,
            initialData: emptyData
        };
    }
    return sections;
}
