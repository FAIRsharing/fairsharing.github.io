import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getTaxonomies from "@/lib/GraphClient/queries/getTaxonomies.json";

const CLIENT = new GraphClient(),
  SEARCH_TAXONOMIES = JSON.parse(JSON.stringify(getTaxonomies));

const state = {
  searchTaxonomies: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchTaxonomies({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_TAXONOMIES.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_TAXONOMIES);

    //Only label/name is passed to field so that while clicking on the Edit Advanced Search button the field should be pre-filled with the selection
    if (response["searchTaxonomies"] && response["searchTaxonomies"].length) {
      const taxonomiesList = response["searchTaxonomies"].map(
        ({ label }) => label
      );
      commit("setSearchTaxonomies", taxonomiesList);
    }

    commit("setLoadingStatus", false);
  },
  resetSearchTaxonomies({ commit }) {
    commit("resetTaxonomiesSearch");
  },
};

const mutations = {
  setSearchTaxonomies(state, searchTaxonomies) {
    state.searchTaxonomies = searchTaxonomies;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetTaxonomiesSearch(state) {
    state.searchTaxonomies = [];
  },
};

const getters = {
  getSearchTaxonomies(state) {
    return state.searchTaxonomies;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const taxonomiesSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default taxonomiesSearch;
