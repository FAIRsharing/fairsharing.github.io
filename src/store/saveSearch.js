import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordTypes from "@/lib/GraphClient/queries/getRecordsTypes.json";
import registryRecords from "@/lib/GraphClient/queries/getRegistryRecords.json";

const CLIENT = new GraphClient(),
  RECORD_TYPES = JSON.parse(JSON.stringify(recordTypes)),
  REGISTRY_RECORDS = JSON.parse(JSON.stringify(registryRecords));

const state = {
  loadingStatus: false,
  saveSearchStepper: false,
  saveSearchResult: [],
  organisationSelected: [],
  policySelected: [],
  policyRecords: [],
};

const actions = {
  async fetchPolicyRecords({ commit }) {
    commit("setLoadingStatus", true);

    let response = await CLIENT.executeQuery(RECORD_TYPES);
    const policyRecord = response.fairsharingRegistries["records"].filter(
      (item) => item["name"] === "Policy"
    );
    let policyRecordId = policyRecord[0].id;

    REGISTRY_RECORDS.queryParam = {
      id: policyRecordId,
    };
    let policyRecordResponse = await CLIENT.executeQuery(REGISTRY_RECORDS);
    commit(
      "setPolicyRecords",
      policyRecordResponse.fairsharingRegistry["fairsharingRecords"]
    );

    commit("setLoadingStatus", false);
  },

  resetFiltersSelected({ commit }) {
    commit("resetSaveSearchStepper");
  },
};

const mutations = {
  setSaveSearchStepper(state, stepper) {
    state.saveSearchStepper = stepper;
  },
  setSaveSearchResult(state, saveSearchResult) {
    state.saveSearchResult.push(saveSearchResult);
  },
  setPolicyRecords(state, policyRecords) {
    state.policyRecords = policyRecords;
  },
  setPolicySelected(state, policySelected) {
    state.policySelected = policySelected;
  },
  setOrganisationSelected(state, organisationSelected) {
    state.organisationSelected = organisationSelected;
  },
  resetSaveSearchStepper(state) {
    state.saveSearchStepper = false;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
};

const getters = {
  getSaveSearchStepper(state) {
    return state.saveSearchStepper;
  },
  getSaveSearchResult(state) {
    return state.saveSearchResult;
  },
  getPolicyRecords(state) {
    return state.policyRecords;
  },
  getPolicySelected(state) {
    return state.policySelected;
  },

  getOrganisationSelected(state) {
    return state.organisationSelected;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const saveSearch = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default saveSearch;
