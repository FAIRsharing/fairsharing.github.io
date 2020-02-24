import Vue from "vue"
import Vuex from "vuex"
import searchFilters from "./searchFilters.js"
import records from "./records.js"
import introspection from "./introspector.js"


Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    modules: {
        searchFilters: searchFilters,
        records: records,
        introspection: introspection
    }
})
