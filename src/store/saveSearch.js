const state = {
  saveSearchStepper: false,
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
  resetSaveSearchStepper(state) {
    state.saveSearchStepper = false;
  },
};

const getters = {
  getSaveSearchStepper(state) {
    return state.saveSearchStepper;
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
