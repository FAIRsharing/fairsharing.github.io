import Vue from "vue"
import Vuex from "vuex"
import searchFilters from "./searchFilters.js"
import records from "./recordSearch.js"
import record from "./recordData.js"
import introspection from "./introspector.js"
import users from './users.js'
import uiController from "./uiController";
import editor from "./editor"


Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    modules: {
        searchFilters: searchFilters,
        records: records,
        record: record,
        introspection: introspection,
        users: users,
        uiController: uiController,
        editor: editor
    }
})

