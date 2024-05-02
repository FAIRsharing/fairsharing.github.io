const state = {
  saveSearchStepper: false,
  saveSearchResult: [],
  organisationSelected: [],
  policySelected: [],
};

const actions = {
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
  setOrganisationSelected(state, organisationSelected) {
    state.organisationSelected = organisationSelected;
  },
  setPolicySelected(state, policySelected) {
    state.policySelected = policySelected;
  },
  resetSaveSearchStepper(state) {
    state.saveSearchStepper = false;
  },
};

const getters = {
  getSaveSearchStepper(state) {
    return state.saveSearchStepper;
  },
  getSaveSearchResult(state) {
    return state.saveSearchResult;
  },

  getOrganisationSelected(state) {
    return state.organisationSelected;
  },
  getPolicySelected(state) {
    return state.policySelected;
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
