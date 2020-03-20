import Vue from "vue"
import Vuex from "vuex"
import searchFilters from "./searchFilters.js"
import records from "./records.js"
import record from "./record.js"
import introspection from "./introspector.js"
import users from '../store/users.js'


Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    modules: {
        searchFilters: searchFilters,
        records: records,
        record: record,
        introspection: introspection,
        users: users
    }
})
