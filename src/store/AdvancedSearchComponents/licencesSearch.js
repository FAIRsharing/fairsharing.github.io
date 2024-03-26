import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getLicences from "@/lib/GraphClient/queries/getLicences.json";

const CLIENT = new GraphClient(),
  SEARCH_LICENCES = JSON.parse(JSON.stringify(getLicences));

const state = {
  searchLicences: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchLicences({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_LICENCES.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_LICENCES);

    //Only label/name is passed to field so that while clicking on the Edit Advanced Search button the field should be pre-filled with the selection
    if (response["searchLicences"] && response["searchLicences"].length) {
      const licencesList = response["searchLicences"].map(({ name }) => name);
      commit("setSearchLicences", licencesList);
    }

    commit("setLoadingStatus", false);
  },
  resetSearchLicences({ commit }) {
    commit("resetLicencesSearch");
  },
};

const mutations = {
  setSearchLicences(state, searchLicences) {
    state.searchLicences = searchLicences;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetLicencesSearch(state) {
    state.searchLicences = [];
  },
};

const getters = {
  getSearchLicences(state) {
    return state.searchLicences;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const licencesSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default licencesSearch;
