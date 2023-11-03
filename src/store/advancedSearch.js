import GraphClient from "@/lib/GraphClient/GraphClient.js";
import advancedQuery from "@/lib/GraphClient/queries/getAdvancedSearch.json";

const CLIENT = new GraphClient(),
  ADVANCED_TAGS = JSON.parse(JSON.stringify(advancedQuery));

const state = {
  advancedSearch: [],
  advancedSearchQuery: {
    _and: [],
    _or: [],
  },
  error: false,
  loadingStatus: false,
};

const actions = {
  /* istanbul ignore next */
  async fetchAdvancedSearchResults({ commit }, advancedSearchTerm) {
    // eslint-disable-next-line no-console
    if (state.advancedSearch && state.advancedSearch.length) {
      commit("setLoadingStatus", true);
      // eslint-disable-next-line no-console
      console.log("state.advancedSearch::", state.advancedSearch);
      state.advancedSearch.forEach((item) => {
        let obj = { key: item["operator"], value: item["value"] };
        if (item["rule"] === "_and") {
          state.advancedSearchQuery["_and"].push(obj);
        } else if (item["rule"] === "_or") {
          state.advancedSearchQuery["_or"].push(obj);
        }
      });
      console.log("state.advancedSearchQuery::", state.advancedSearchQuery);

      ADVANCED_TAGS.queryParam = {
        q: advancedSearchTerm,
        where: state.advancedSearchQuery,
      };
      console.log("ADVANCED_TAGS.queryParam::", ADVANCED_TAGS);
      let response = await CLIENT.executeQuery(ADVANCED_TAGS);
      console.log("response:", response);
      // commit("setVariableResponse", response["advancedQuery"].data);
      commit("setLoadingStatus", false);
    }
  },
  resetVariableTags({ commit }) {
    commit("resetVariableResponse");
  },
};

const mutations = {
  setAdvancedQuery(state, advancedSearch) {
    state.advancedSearch = advancedSearch;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetVariableResponse(state) {
    state.variableResponse = [];
  },
};
const advancedSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default advancedSearch;
