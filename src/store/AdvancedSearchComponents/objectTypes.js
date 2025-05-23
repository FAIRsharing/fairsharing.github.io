import GraphClient from "@/lib/GraphClient/GraphClient.js";
import objectTypesQuery from "@/lib/GraphClient/queries/getObjectTypes.json";

const CLIENT = new GraphClient();

const state = {
  objectTypes: [],
  loadingData: false,
};

const actions = {
  async fetchObjectTypes({ commit }) {
    commit("setLoadingData", true);
    let response = await CLIENT.executeQuery(objectTypesQuery);
    commit("setObjectTypes", response["objectTypes"].records);
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
