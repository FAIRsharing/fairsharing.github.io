import GraphClient from "@/lib/GraphClient/GraphClient.js";
import objectTypesQuery from "@/lib/GraphClient/queries/getObjectTypes.json";

const CLIENT = new GraphClient(),
  SEARCH_OBJECTTYPES = JSON.parse(JSON.stringify(objectTypesQuery));
const state = {
  objectTypes: [],
  loadingData: false,
};

const actions = {
  async fetchObjectTypes({ commit }, queryParams) {
    commit("setLoadingData", true);
    SEARCH_OBJECTTYPES.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_OBJECTTYPES);
    if (response["objectTypes"].records && response["objectTypes"].records.length) {
      const objectTypesList = response["objectTypes"].records.map(({ label }) => label);
      commit("setObjectTypes", objectTypesList);
    }

    commit("setLoadingData", false);
  },
  resetRecords({ commit }) {
    commit("resetObjectTypes");
  },
};

const mutations = {
  setObjectTypes(state, objectTypes) {
    state.objectTypes = objectTypes;
  },
  setLoadingData(state, loadingData) {
    state.loadingData = loadingData;
  },
  resetObjectTypes(state) {
    state.objectTypes = [];
  },
};

const getters = {
  getObjectTypes(state) {
    return state.objectTypes;
  },
  getLoadingData(state) {
    return state.loadingData;
  }
};
const objectTypes = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default objectTypes;
