import Vue from "vue"
import Vuex from "vuex"
import searchFilters from "./searchFilters.js"
import records from "./recordSearch.js"
import record from "./recordData.js"
import introspection from "./introspector.js"
import users from './users.js'
import uiController from "./uiController";
import editor from "./editor"
import messages from "./messages"
import ontologyBrowser from "./ontologyBrowser"

Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    modules: {
        searchFilters,
        records,
        record,
        introspection,
        users,
        uiController,
        editor,
        messages,
        ontologyBrowser: ontologyBrowser
    }
})

