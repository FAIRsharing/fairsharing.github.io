import Client from "../lib/GraphClient/GraphClient.js"
import introspectionQuery from "../lib/GraphClient/queries/introspection.json"
import {isEqual} from 'lodash'

let client = new Client();
export const mutations = {
    setParameters(state, data) {
        try {
            if (Object.keys(data).includes("errors")) {
                state.error = data.errors[0].message
            }
            else {
                localStorage.introspectionQuery = JSON.stringify(data);
                let queryParams = data.data["__schema"]["types"].filter(param => param.name === "Query")[0];
                state.searchQueryParameters = queryParams.fields.filter(param => param.name === "searchFairsharingRecords")[0];
                if (!localStorage.searchQueryParameters) {
                    localStorage.searchQueryParameters = JSON.stringify(state.searchQueryParameters);
                }
                else {
                    if (!isEqual(JSON.parse(localStorage.searchQueryParameters), JSON.parse(JSON.stringify(state.searchQueryParameters)))) {
                        localStorage.searchQueryParameters = JSON.stringify(state.searchQueryParameters);
                    }
                    else {
                        state.searchQueryParameters = JSON.parse(localStorage.searchQueryParameters);
                    }
                }
            }
        }
        catch (e) {
            state.error = "Can't initialize application"
        }
    },
    setLocalStorageExpiryTime: function () {
        let now = new Date();
        localStorage.expiryDate = now;
        return now;
    },
    setMaintenanceMode(state){
        state.maintenanceMode = true;
    },
    setReadOnlyMode(state){
        state.readOnlyMode = true;
    }
};

export const actions = {
    async fetchParameters(state, timer) {
        let expirationTimer = (timer) ? timer : 24;
        let data = await client.getData(introspectionQuery);
        if (localStorage.expiryDate) {
            const expiration = paramsAreExpired(localStorage.expiryDate, expirationTimer);
            if (expiration) {
                this.commit("introspection/setLocalStorageExpiryTime");
                this.commit("introspection/setParameters", data.data);
            }
            else {
                this.commit("introspection/setParameters", JSON.parse(localStorage.introspectionQuery));
            }
        }
        if (!localStorage.introspectionQuery) {
            this.commit("introspection/setLocalStorageExpiryTime");
            this.commit("introspection/setParameters", data.data);
        }
        if (data.headers['maintenance'] === "true") this.commit("introspection/setMaintenanceMode");
        if (data.headers['read-only'] === "true") this.commit("introspection/setReadOnlyMode");

        // temp!
        // this.commit("introspection/setMaintenanceMode");
        // this.commit("introspection/setReadOnlyMode");
    }
};
export const getters = {
    buildQueryParameters: (state) => (params) => {
        let queryParameters = {};
        Object.keys(params[1]).forEach(function (param) {
            let currentParam = state.searchQueryParameters.args.filter(arg => arg.name === param)[0];
            const expectedTypeObject = currentParam.type;

            if (expectedTypeObject.kind !== "LIST") {
                queryParameters[param] = parseParam(expectedTypeObject, params[1][param]);
            }
            else {
                const currentVal = params[1][param];
                const expectedType = expectedTypeObject["ofType"]["ofType"].name;
                queryParameters[param] = [];
                if (currentVal.indexOf(",") > 0) {
                    currentVal.split(",").forEach(function (val) {
                        queryParameters[param].push(decodeURIComponent(parseParam(expectedType, val)))
                    });

                }
                else {
                    queryParameters[param] = decodeURIComponent(parseParam(expectedType, currentVal))
                }
            }
        });
        if (params[0] !== "Search") {
            queryParameters["fairsharingRegistry"] = params[0];
        }
        return queryParameters;
    }
};

/**
 * The introspection store is related to the introspection query that let us know which fields/types are allowed by the searchFairsharingRecords query
 * @type {Object}
 * */
let introspectionStore = {
    namespaced: true,
    /**
     * @name states
     * @type {Object}
     * @property {String} errors - collects errors while introspecting.
     * @property {object} searchQueryParameters -  filters query parameters object coming from API.
     */
    state: {
        errors: String,
        searchQueryParameters: {},
        maintenanceMode: false,
        readOnlyMode: false
    },
    modules: {},
    mutations: mutations,
    actions: actions,
    getters: getters
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

    }
    else if (param.name === "Boolean") {
        return JSON.parse(paramVal)
    }
    return paramVal
};

/**
 * Compares the given date with now and returns true if it greater than the given timer
 * @param {Date} expiryDate - the date to compare
 * @param {Number} expirationTimer - the timer to determine if the date has been expired or not
 * @returns {boolean} - is the data expired or not
 */
export const paramsAreExpired = function (expiryDate, expirationTimer) {
    const limit = expirationTimer * 3600;
    const expiration = new Date(expiryDate);
    const now = new Date();
    return ((now - expiration) - limit) >= 0
};
