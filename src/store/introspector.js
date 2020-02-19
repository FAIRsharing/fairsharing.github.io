import Client from "../components/GraphClient/GraphClient.js"
import introspectionQuery from "../components/GraphClient/queries/introspection.json"
let client = new Client();

export default {
    namespaced: true,
    state: {
        errors: String,
        searchQueryParameters: {}
    },
    mutations: {
        setParameters(state, data){
            try {
                if (Object.prototype.hasOwnProperty.call(data, "errors")){
                    state.error = data.errors[0].message
                }
                let queryParams = data.data["__schema"]["types"].filter(param => param.name === "Query")[0];
                state.searchQueryParameters = queryParams.fields.filter(param => param.name === "searchFairsharingRecords")[0];

            }
            catch (e) {
                state.error = "Can't initialize application"
            }

        }
    },
    actions: {
        async fetchParameters(){
            let data = await client.getData(introspectionQuery);
            this.commit("introspection/setParameters", data.data);
        }
    },
    modules: {
    },
    getters: {
        buildQueryParameters: (state) => (params) => {
            let queryParameters = {};
            Object.keys(params[1]).forEach(function(param){
                let currentParam = state.searchQueryParameters.args.filter(arg => arg.name === param)[0];
                const expectedTypeObject = currentParam.type;

                if (expectedTypeObject.kind !== "LIST"){
                    queryParameters[param] = parseParam(expectedTypeObject, params[1][param]);
                }

                else {
                    const currentVal = params[1][param];
                    const expectedType = expectedTypeObject["ofType"]["ofType"].name;
                    queryParameters[param] = [];
                    if (currentVal.indexOf(",") > 0){
                        currentVal.split(",").forEach(function(val){
                            queryParameters[param].push(decodeURIComponent(parseParam(expectedType, val)))
                        });
                    }
                    else {
                        queryParameters[param] = decodeURIComponent(parseParam(expectedType, currentVal))
                    }
                }
            });
            if (params[0] !== "Search"){
                queryParameters["fairsharingRegistry"] = params[0];
            }
            return queryParameters;
        }
    }
}

const parseParam = function(param, paramVal){
    if (param.name === "Int"){
        return parseFloat(paramVal)
    }
    else if (param.name === "Boolean"){
       return JSON.parse(paramVal)
    }
    return paramVal
};