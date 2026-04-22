import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getUserDefinedTags from "@/lib/GraphClient/queries/getUserDefinedTags.json";

const CLIENT = new GraphClient(),
  SEARCH_USERDEFINEDTAGS = JSON.parse(JSON.stringify(getUserDefinedTags));

const state = {
  searchUserDefinedTags: [],
  loadingStatus: false,
};

const actions = {
  async fetchSearchUserDefinedTags({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    SEARCH_USERDEFINEDTAGS.queryParam = {
      q: queryParams,
    };
    let response = await CLIENT.executeQuery(SEARCH_USERDEFINEDTAGS);
    //Only label/name is passed to field so that while clicking on the Edit Advanced Search button the field should be pre-filled with the selection
    if (
      response["searchUserDefinedTags"] &&
      response["searchUserDefinedTags"].length
    ) {
      const userDefinedTagsList = response["searchUserDefinedTags"].map(
        ({ label }) => label,
      );
      commit("setSearchUserDefinedTags", userDefinedTagsList);
    }

    commit("setLoadingStatus", false);
  },
  resetUserDefinedTags({ commit }) {
    commit("resetUserDefinedTagsSearch");
  },
};

const mutations = {
  setSearchUserDefinedTags(state, searchUserDefinedTags) {
    state.searchUserDefinedTags = searchUserDefinedTags;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetUserDefinedTagsSearch(state) {
    state.searchUserDefinedTags = [];
  },
};

const getters = {
  getSearchUserDefinedTags(state) {
    return state.searchUserDefinedTags;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
};
const userDefinedTagsSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default userDefinedTagsSearch;
