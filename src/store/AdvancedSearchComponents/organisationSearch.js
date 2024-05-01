import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getOrganisations from "@/lib/GraphClient/queries/Organisations/getOrganisations.json";

const CLIENT = new GraphClient(),
  SEARCH_ORGANISATIONS = JSON.parse(JSON.stringify(getOrganisations));

const state = {
  searchOrganisations: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchOrganisations({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_ORGANISATIONS.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_ORGANISATIONS);
    //Only label/name is passed to field so that while clicking on the Edit Advanced Search button the field should be pre-filled with the selection
    if (
      response["searchOrganisations"] &&
      response["searchOrganisations"].length
    ) {
      const organisationsList = response["searchOrganisations"].map(
        (organisation) => {
          let id = organisation.id,
            name = organisation.name;
          return { id, name };
        }
      );
      commit("setSearchOrganisations", organisationsList);
    }

    commit("setLoadingStatus", false);
  },
  resetOrganisations({ commit }) {
    commit("resetOrganisationSearch");
  },
};

const mutations = {
  setSearchOrganisations(state, searchOrganisations) {
    state.searchOrganisations = searchOrganisations;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetOrganisationSearch(state) {
    state.searchOrganisations = [];
  },
};

const getters = {
  getSearchOrganisations(state) {
    return state.searchOrganisations;
  },
  getSearchOrganisationNames(state) {
    return state.searchOrganisations.map(({ name }) => name);
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const organisationSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default organisationSearch;
