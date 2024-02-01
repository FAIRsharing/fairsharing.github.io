import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getDomains from "@/lib/GraphClient/queries/getDomains.json";

const CLIENT = new GraphClient(),
  SEARCH_DOMAINS = JSON.parse(JSON.stringify(getDomains));

const state = {
  searchDomains: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchDomains({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_DOMAINS.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_DOMAINS);
    //Only label/name is passed to field so that while clicking on the Edit Advanced Search button the field should be pre-filled with the selection
    if (response["searchDomains"] && response["searchDomains"].length) {
      const domainsList = response["searchDomains"].map(({ label }) => label);
      commit("setSearchDomains", domainsList);
    }

    commit("setLoadingStatus", false);
  },
  resetSearchDomains({ commit }) {
    commit("resetDomainsSearch");
  },
};

const mutations = {
  setSearchDomains(state, searchDomains) {
    state.searchDomains = searchDomains;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetDomainsSearch(state) {
    state.searchDomains = [];
  },
};

const getters = {
  getSearchDomains(state) {
    return state.searchDomains;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const domainsSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default domainsSearch;
