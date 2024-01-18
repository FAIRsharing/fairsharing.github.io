import GraphClient from "@/lib/GraphClient/GraphClient.js";
import searchSubjects from "@/lib/GraphClient/queries/getSubjects.json";

const CLIENT = new GraphClient(),
  SEARCH_SUBJECTS = JSON.parse(JSON.stringify(searchSubjects));

const state = {
  searchSubjects: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchSubjects({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_SUBJECTS.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_SUBJECTS);

    let subjectListArr = [];
    response["searchSubjects"].forEach(({ label, children }) => {
      subjectListArr.push(label);
      if (children && children.length) {
        children.forEach(({ label }) => {
          subjectListArr.push(label);
        });
      }
    });
    const subjectList = [...new Set(subjectListArr)];
    commit("setSearchSubjects", subjectList);

    commit("setLoadingStatus", false);
  },
};

const mutations = {
  setSearchSubjects(state, searchSubjects) {
    state.searchSubjects = searchSubjects;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
};

const getters = {
  getSearchSubjects(state) {
    return state.searchSubjects;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const subjectSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default subjectSearch;
