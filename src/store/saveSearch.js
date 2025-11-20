import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordTypes from "@/lib/GraphClient/queries/getRecordsTypes.json";
import registryRecords from "@/lib/GraphClient/queries/getRegistryRecords.json";

const CLIENT = new GraphClient(),
  RECORD_TYPES = JSON.parse(JSON.stringify(recordTypes)),
  REGISTRY_RECORDS = JSON.parse(JSON.stringify(registryRecords));

const state = {
  loadingStatus: false,
  saveSearchStepperDialog: false,
  showStepper: true,
  policySelected: [],
  policyRecords: [],
  organisationSelected: [],
  userSelected: [],
  saveSearchStatus: false,
  saveSearchResult: [],
};

const actions = {
  async fetchPolicyRecords({ commit }) {
    commit("setLoadingStatus", true);

    let response = await CLIENT.executeQuery(RECORD_TYPES);
    const policyRecord = response.fairsharingRegistries["records"].filter(
      (item) => item["name"] === "Policy",
    );
    let policyRecordId = policyRecord[0].id;

    REGISTRY_RECORDS.queryParam = {
      id: policyRecordId,
    };
    let policyRecordResponse = await CLIENT.executeQuery(REGISTRY_RECORDS);
    commit(
      "setPolicyRecords",
      policyRecordResponse.fairsharingRegistry["fairsharingRecords"],
    );

    commit("setLoadingStatus", false);
  },

  resetSaveSearchDialog({ commit }) {
    commit("resetSaveSearchStepper");
  },
};

const mutations = {
  setSaveSearchStepperDialog(state, stepper) {
    state.saveSearchStepperDialog = stepper;
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
  setUserSelected(state, userSelected) {
    state.userSelected = userSelected;
  },
  resetSaveSearchStepper(state) {
    (state.loadingStatus = false),
      (state.saveSearchStepperDialog = false),
      (state.saveSearchResult = []),
      (state.organisationSelected = []),
      (state.policySelected = []),
      (state.policyRecords = []),
      (state.userSelected = []),
      (state.saveSearchStatus = false),
      (state.showStepper = true);
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  setSaveSearchStatus(state, saveSearchStatus) {
    state.saveSearchStatus = saveSearchStatus;
  },
  setShowStepper(state, showStepper) {
    state.showStepper = showStepper;
  },
};

const getters = {
  getSaveSearchStepperDialog(state) {
    return state.saveSearchStepperDialog;
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
  getUserSelected(state) {
    return state.userSelected;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
  getSaveSearchStatus(state) {
    return state.saveSearchStatus;
  },
  getShowStepper(state) {
    return state.showStepper;
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
