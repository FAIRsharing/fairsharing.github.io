import { jsonToGraphQLQuery } from "json-to-graphql-query";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import advancedQuery from "@/lib/GraphClient/queries/getAdvancedSearch.json";
import { uniqueValues } from "@/utils/advancedSearchUtils";

const CLIENT = new GraphClient(),
  ADVANCED_TAGS = JSON.parse(JSON.stringify(advancedQuery));

const state = {
  advancedSearch: {},
  advancedSearchQuery: {
    operator: "",
    fields: [],
  },
  advancedSearchResponse: [],
  loadingStatus: false,
  errorStatus: false,
};

const actions = {
  async fetchAdvancedSearchResults({ commit }, advancedSearchTerm) {
    state.advancedSearchQuery["fields"] = [];
    commit("setLoadingStatus", true);
    state.advancedSearchQuery["operator"] =
      state.advancedSearch["operatorIdentifier"];
    /* istanbul ignore next */
    if (
      state.advancedSearch["children"] &&
      state.advancedSearch["children"].length
    ) {
      state.advancedSearch["children"].forEach((item) => {
        let fieldsObj = {};
        let fieldValue = [];
        fieldsObj["operator"] = item["operatorIdentifier"];

        const mergedValues = uniqueValues(item["children"]);

        mergedValues.forEach((params) => {
          let fieldKey = params["identifier"];
          if (Array.isArray(params["value"])) {
            fieldValue = params["value"];
          } else if (params["value"]) {
            fieldValue = [params["value"]];
          }
          if (fieldValue && fieldValue.length) fieldsObj[fieldKey] = fieldValue;
        });
        state.advancedSearchQuery["fields"].push(fieldsObj);
      });
    }

    //Below is the format required for jsonToGraphQlQuery
    let parentQuery = {};
    parentQuery["query"] = {};
    parentQuery["__args"] = state.advancedSearchQuery;
    parentQuery.query["__args"] = {
      where: state.advancedSearchQuery,
    };
    let graphqlQuery = jsonToGraphQLQuery(parentQuery, {
      pretty: true,
    });

    graphqlQuery = graphqlQuery.match(/\(([^)]+)\)/)[1];

    let whereObj = graphqlQuery.replace("where:", "");

    if (advancedSearchTerm) {
      ADVANCED_TAGS.queryParam = {
        q: advancedSearchTerm,
        where: whereObj,
      };
    } else {
      ADVANCED_TAGS.queryParam = {
        where: whereObj,
      };
    }

    try {
      let response = await CLIENT.executeQuery(ADVANCED_TAGS);
      commit("setAdvancedSearchResponse", response["advancedSearch"]);
      if (!response["error"]) {
        commit("setError", false);
        commit("setAdvancedSearchResponse", response["advancedSearch"]);
      } else {
        commit("setError", true);
      }
    } catch (error) {
      /* istanbul ignore next */
      commit("setError", true);
    }
    commit("setLoadingStatus", false);
  },

  resetAdvancedSearchResponse({ commit }) {
    commit("resetAdvancedSearch");
  },
};

const mutations = {
  setAdvancedSearch(state, advancedSearch) {
    state.advancedSearch = advancedSearch;
  },
  setAdvancedSearchResponse(state, advancedSearchResponse) {
    state.advancedSearchResponse = advancedSearchResponse;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetAdvancedSearch(state) {
    state.advancedSearch = {};
    state.advancedSearchQuery = {
      operator: "",
      fields: [],
    };
    state.advancedSearchResponse = [];
  },
  setError(state, errorStatus) {
    state.errorStatus = errorStatus;
  },
};

const getters = {
  getAdvancedSearch(state) {
    return state.advancedSearch;
  },
  getAdvancedSearchResponse(state) {
    return state.advancedSearchResponse;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
  getErrorStatus(state) {
    return state.errorStatus;
  },
};
const advancedSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default advancedSearch;
