import Vue from "vue";
import Vuex from "vuex";

import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import countriesSearch from "@/store/AdvancedSearchComponents/countriesSearch";
import domainsSearch from "@/store/AdvancedSearchComponents/domainsSearch";
import licencesSearch from "@/store/AdvancedSearchComponents/licencesSearch";
import organisationSearch from "@/store/AdvancedSearchComponents/organisationSearch";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";
import subjectSearch from "@/store/AdvancedSearchComponents/subjectSearch";
import taxonomiesSearch from "@/store/AdvancedSearchComponents/taxonomiesSearch";
import userDefinedTagsSearch from "@/store/AdvancedSearchComponents/userDefinedTagsSearch";
import saveSearch from "@/store/saveSearch";

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
    organisationSearch,
    userDefinedTagsSearch,
    domainsSearch,
    taxonomiesSearch,
    licencesSearch,
    countriesSearch,
    saveSearch
  },
});
