import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getCountries from "@/lib/GraphClient/queries/getCountries.json";

const CLIENT = new GraphClient(),
  SEARCH_COUNTRIES = JSON.parse(JSON.stringify(getCountries));

const state = {
  searchCountries: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchCountries({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_COUNTRIES.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_COUNTRIES);

    //Only label/name is passed to field so that while clicking on the Edit Advanced Search button the field should be pre-filled with the selection
    if (response["searchCountries"] && response["searchCountries"].length) {
      const countriesList = response["searchCountries"].map(({ name }) => name);
      commit("setSearchCountries", countriesList);
    }

    commit("setLoadingStatus", false);
  },
  resetSearchCountries({ commit }) {
    commit("resetCountriesSearch");
  },
};

const mutations = {
  setSearchCountries(state, searchCountries) {
    state.searchCountries = searchCountries;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetCountriesSearch(state) {
    state.searchCountries = [];
  },
};

const getters = {
  getSearchCountries(state) {
    return state.searchCountries;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const countriesSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default countriesSearch;
