import { jsonToGraphQLQuery } from "json-to-graphql-query";
import {isBoolean} from "lodash";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import advancedQuery from "@/lib/GraphClient/queries/getAdvancedSearch.json";
import { uniqueValues } from "@/utils/advancedSearchUtils";

const CLIENT = new GraphClient(),
  ADVANCED_TAGS = JSON.parse(JSON.stringify(advancedQuery));

const state = {
  advancedSearchText: "",
  advancedSearch: {},
  editAdvancedSearch: {},
  advancedSearchQuery: {
    operator: "",
    fields: [],
  },
  advancedSearchResponse: [],
  loadingStatus: false,
  errorStatus: false,
  editDialogStatus: false,
  advancedSearchDialogStatus: false,
};

const actions = {
  async fetchAdvancedSearchResults({ commit }, advancedSearchTerm) {
    commit("setLoadingStatus", true);
    state.advancedSearchQuery["operator"] =
      state.advancedSearch["operatorIdentifier"];
    /* istanbul ignore next */
    if (
      state.advancedSearch["children"] &&
      state.advancedSearch["children"].length
    ) {
      state.advancedSearch["children"].forEach((item) => {
        if (item["children"] && item["children"].length) {
          let fieldsObj = {};
          let fieldValue = [] || Boolean;
          let fieldTypeValue = [];
          fieldsObj["operator"] = item["operatorIdentifier"];
          const mergedValues = uniqueValues(item["children"]);

          mergedValues.forEach((params) => {
            let fieldKey = params["identifier"];

            //Changing databasetype/standardtype/policytype keyname to 'type'
            //to pass as a required key for advancedSearch query
            if (
              fieldKey === "databasetype" ||
              fieldKey === "standardtype" ||
              fieldKey === "policytype"
            ) {
              fieldKey = "type";
              fieldTypeValue.push(params["value"]);
              fieldTypeValue = fieldTypeValue.flatMap((value) => value);
              fieldValue = fieldTypeValue;
            } else {

              if (Array.isArray(params["value"])) {
                fieldValue = params["value"];
              }
              else if (isBoolean(params["value"])) {
                fieldValue = params["value"];
              }
              else if (params["value"]) {
                //When string is boolean value, convert to boolean format
                if((params["value"] === "true") || (params["value"] === "false")) {
                  fieldValue = JSON.parse(params["value"]);
                } else {
                  fieldValue = [params["value"]];
                }

              }
            }
            if (fieldValue && fieldValue.length) {
              fieldValue = fieldValue.map((e) => e.toLowerCase());
              fieldsObj[fieldKey] = fieldValue;
            }
            else if(isBoolean(fieldValue)) {
              fieldsObj[fieldKey] = fieldValue;
            }
          });
          state.advancedSearchQuery["fields"].push(fieldsObj);
        }
      });
    }

    commit("setAdvancedSearchQuery", state.advancedSearchQuery);

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
      commit("setAdvancedSearchText", advancedSearchTerm);
      ADVANCED_TAGS.queryParam = {
        q: state.advancedSearchText,
        where: whereObj,
      };
    } else {
      commit("setAdvancedSearchText", "");
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
  setAdvancedSearchText(state, advancedSearchText) {
    state.advancedSearchText = advancedSearchText;
  },
  setAdvancedSearch(state, advancedSearch) {
    state.advancedSearch = advancedSearch;
  },
  setEditAdvancedSearch(state, editAdvancedSearch) {
    state.editAdvancedSearch = editAdvancedSearch;
  },
  setAdvancedSearchResponse(state, advancedSearchResponse) {
    state.advancedSearchResponse = advancedSearchResponse;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetAdvancedSearch(state) {
    state.advancedSearch = {};
    state.editAdvancedSearch = {};
    state.advancedSearchQuery = {
      operator: "",
      fields: [],
    };
    state.advancedSearchResponse = [];
  },
  setError(state, errorStatus) {
    state.errorStatus = errorStatus;
  },
  setAdvancedSearchQuery(state, advancedSearchQuery) {
    state.advancedSearchQuery = {
      operator: advancedSearchQuery["operator"],
      fields: advancedSearchQuery["fields"],
    };
  },

  setEditDialogStatus(state, editDialogStatus) {
    state.editDialogStatus = editDialogStatus;
  },
  setAdvancedSearchDialogStatus(state, advancedSearchDialogStatus) {
    state.advancedSearchDialogStatus = advancedSearchDialogStatus;
  },
};

const getters = {
  getAdvancedSearchText(state) {
    return state.advancedSearchText;
  },
  getAdvancedSearch(state) {
    return state.advancedSearch;
  },
  getEditAdvancedSearch(state) {
    return state.editAdvancedSearch;
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
  getAdvancedSearchQuery(state) {
    return state.advancedSearchQuery;
  },
  getEditDialogStatus(state) {
    return state.editDialogStatus;
  },
  getAdvancedSearchDialogStatus(state) {
    return state.advancedSearchDialogStatus;
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
