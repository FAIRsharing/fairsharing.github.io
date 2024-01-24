import GraphClient from "@/lib/GraphClient/GraphClient.js";
import allRecordsTypes from "@/lib/GraphClient/queries/getAllRecordTypes.json";

const CLIENT = new GraphClient();

const state = {
  allRecordTypes: [],
  loadingData: false,
};

const actions = {
  async fetchAllRecordTypes({ commit }) {
    commit("setLoadingData", true);
    let response = await CLIENT.executeQuery(allRecordsTypes);
    commit("setAllRecordTypes", response["recordTypes"].records);
    commit("setLoadingData", false);
  },
};

const mutations = {
  setAllRecordTypes(state, allRecordTypes) {
    state.allRecordTypes = allRecordTypes;
  },
  setLoadingData(state, loadingData) {
    state.loadingData = loadingData;
  },
};

const getters = {
  getRecordTypes(state) {
    return state.allRecordTypes;
  },
};
const recordTypes = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default recordTypes;
