import Vue from "vue";
import Vuex from "vuex";

import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";
import subjectSearch from "@/store/AdvancedSearchComponents/subjectSearch";

import advancedSearch from "./advancedSearch";
import editor from "./editor";
import introspection from "./introspector.js";
import messages from "./messages";
import ontologyBrowser from "./ontologyBrowser";
import record from "./recordData.js";
import records from "./recordSearch.js";
import searchFilters from "./searchFilters.js";
import uiController from "./uiController";
import users from "./users.js";

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
    ontologyBrowser: ontologyBrowser,
    advancedSearch,
    subjectSearch,
    recordTypes,
  },
});
