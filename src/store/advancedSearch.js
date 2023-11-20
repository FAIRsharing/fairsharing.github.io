import { jsonToGraphQLQuery } from "json-to-graphql-query";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import advancedQuery from "@/lib/GraphClient/queries/getAdvancedSearch.json";

const CLIENT = new GraphClient(),
  ADVANCED_TAGS = JSON.parse(JSON.stringify(advancedQuery));

const state = {
  advancedSearch: {},
  advancedSearchQuery: {
    operator: "",
    fields: [],
  },
  advancedSearchResponse: [],
  error: false,
  loadingStatus: false,
};

const actions = {
  /* istanbul ignore next */

  async fetchAdvancedSearchResults({ commit }, advancedSearchTerm) {
    commit("setLoadingStatus", true);
    state.advancedSearchQuery["operator"] =
      state.advancedSearch["operatorIdentifier"];

    if (
      state.advancedSearch["children"] &&
      state.advancedSearch["children"].length
    ) {
      state.advancedSearch["children"].forEach((item) => {
        let fieldsObj = {};
        let fieldValue;
        fieldsObj["operator"] = item["operatorIdentifier"];
        item["children"].forEach((params) => {
          let fieldKey = params["identifier"];

          if (Array.isArray(params["value"])) {
            fieldValue = params["value"];
          } else {
            fieldValue = [params["value"]];
          }

          fieldsObj[fieldKey] = fieldValue;
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

    ADVANCED_TAGS.queryParam = {
      q: advancedSearchTerm,
      where: whereObj,
    };
    let response = await CLIENT.executeQuery(ADVANCED_TAGS);
    console.log("response:", response["advancedSearch"]);
    commit("setAdvancedSearchResponse", response["advancedSearch"]);
    commit("setLoadingStatus", false);
  },

  resetAdvancedSearch({ commit }) {
    commit("resetAdvancedQuery");
  },
};

const mutations = {
  setAdvancedQuery(state, advancedSearch) {
    state.advancedSearch = advancedSearch;
  },
  setAdvancedSearchResponse(state, advancedSearchResponse) {
    state.advancedSearchResponse = advancedSearchResponse;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetAdvancedQuery(state) {
    state.advancedSearch = {};
  },
};
const advancedSearch = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default advancedSearch;
