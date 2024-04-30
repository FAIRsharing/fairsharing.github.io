const state = {
  saveSearchStepper: false,
  saveSearchResult: [],
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
};
const saveSearch = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default saveSearch;
