import Client from "../components/GraphClient/GraphClient.js"
import introspectionQuery from "../components/GraphClient/queries/introspection.json"

let client = new Client();

/**
 * The introspection store is related to the introspection query that let us know which fields/types are allowed by the searchFairsharingRecords query
 * @type {Object}
 * */
let introspectionStore = {
    namespaced: true,
    state: {
        errors: String,
        searchQueryParameters: {}
    },
    mutations: {
        setParameters(state, data) {
            try {
                if (Object.prototype.hasOwnProperty.call(data, "errors")) {
                    state.error = data.errors[0].message
                }
                let queryParams = data.data["__schema"]["types"].filter(param => param.name === "Query")[0];
                state.searchQueryParameters = queryParams.fields.filter(param => param.name === "searchFairsharingRecords")[0];
                // if local localStorage.searchQueryParameters not exists, then create it.
                if (!localStorage.searchQueryParameters) {
                    // console.log('created localStorage.searchQueryParameters');
                    localStorage.searchQueryParameters = JSON.stringify(state.searchQueryParameters);
                } else {
                    // if local localStorage.searchQueryParameters exists but the data arrived is new then update it
                    if (JSON.parse(localStorage.searchQueryParameters) !== JSON.parse(JSON.stringify(state.searchQueryParameters))) {
                        // console.log('update localStorage.searchQueryParameters with new data');
                        localStorage.searchQueryParameters = JSON.stringify(state.searchQueryParameters);
                    }
                    state.searchQueryParameters = JSON.parse(localStorage.searchQueryParameters);
                }

            } catch (e) {
                state.error = "Can't initialize application"
            }

        }
    },
    actions: {
        async fetchParameters() {
            // if local localStorage.intorspectionQuery not exists, then create it.
            if (!localStorage.intorspectionQuery) {
                // console.log(localStorage.intorspectionQuery);
                let data = await client.getData(introspectionQuery);
                localStorage.intorspectionQuery = JSON.stringify(data.data);
                this.commit("introspection/setParameters", data.data);
            } else {
                // Otherwise, read from localStorage.intorspectionQuery .
                // console.log(JSON.parse(localStorage.intorspectionQuery));
                this.commit("introspection/setParameters", JSON.parse(localStorage.intorspectionQuery));
            }
        }
    },
    modules: {},
    getters: {
        buildQueryParameters: (state) => (params) => {
            let queryParameters = {};
            Object.keys(params[1]).forEach(function (param) {
                let currentParam = state.searchQueryParameters.args.filter(arg => arg.name === param)[0];
                const expectedTypeObject = currentParam.type;

                if (expectedTypeObject.kind !== "LIST") {
                    queryParameters[param] = parseParam(expectedTypeObject, params[1][param]);
                } else {
                    const currentVal = params[1][param];
                    const expectedType = expectedTypeObject["ofType"]["ofType"].name;
                    queryParameters[param] = [];
                    if (currentVal.indexOf(",") > 0) {
                        currentVal.split(",").forEach(function (val) {
                            queryParameters[param].push(decodeURIComponent(parseParam(expectedType, val)))
                        });
                    } else {
                        queryParameters[param] = decodeURIComponent(parseParam(expectedType, currentVal))
                    }
                }
            });
            if (params[0] !== "Search") {
                queryParameters["fairsharingRegistry"] = params[0];
            }
            return queryParameters;
        }
    }
};
export default introspectionStore;

/**
 * Given a type and a value, parse the value with the expected type.
 * @param {Object} param - the parameter types allowed
 * @param {String} paramVal -  the value to be parsed
 * @returns {String | Number | Boolean} paramVal - the parse value
 * @example <caption> Example usage of parseParam </caption>
 *  parseParam({name: "Boolean"}, "true");
 *  // return True
 */
const parseParam = function (param, paramVal) {
    if (param.name === "Int") {
        return parseFloat(paramVal)
    } else if (param.name === "Boolean") {
        return JSON.parse(paramVal)
    }
    return paramVal
};