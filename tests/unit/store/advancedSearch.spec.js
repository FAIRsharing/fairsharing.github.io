import sinon from "sinon";

import Client from "@/lib/GraphClient/GraphClient";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import AdvancedSearchStore from "@/store/advancedSearch.js";

import AdvancedSearchData from "../../../tests/fixtures/getAdvancedSearch.json";

describe("AdvancedSearch store methods", () => {
  const { actions, mutations, getters } = AdvancedSearchStore;
  const returnedVal = AdvancedSearchData;
  let state = {
    advancedSearch: {},
    advancedSearchQuery: {
      operator: "",
      fields: [],
    },
    advancedSearchResponse: [],
    errorStatus: false,
    loadingStatus: false,
  };
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });

  it("can check fetchAdvancedSearchResults actions", () => {
    const commit = jest.fn();
    actions.fetchAdvancedSearchResults({ commit }, "searchTerm");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchAdvancedSearchResults actions without advanceSearchTerm", () => {
    const commit = jest.fn();
    actions.fetchAdvancedSearchResults({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchAdvancedSearchResults actions with Error response", async () => {
    const commit = jest.fn();
    stub.returns({
      error: "error",
    });

    await actions.fetchAdvancedSearchResults({ commit });
    expect(commit).toHaveBeenCalledWith("setError", true);
  });

  it("can check resetAdvancedSearchResponse actions", () => {
    const commit = jest.fn();
    actions.resetAdvancedSearchResponse({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setAdvancedQuery mutations", () => {
    const searchedObj = {
      operatorIdentifier: "_and",
      children: [
        {
          operatorIdentifier: "_and",
          children: [
            {
              identifier: "registry",
              value: ["database", "standard"],
            },
          ],
        },
      ],
    };
    mutations.setAdvancedQuery(state, searchedObj);
    expect(state.advancedSearch).toBe(searchedObj);
  });

  it("can check setAdvancedSearchResponse mutations", () => {
    const searchResponse = [
      {
        id: 1,
        name: "Abc",
        registry: "xyz",
        status: "active",
        type: "any",
      },
    ];
    mutations.setAdvancedSearchResponse(state, searchResponse);
    expect(state.advancedSearchResponse).toBe(searchResponse);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetAdvancedSearch mutations", () => {
    mutations.resetAdvancedSearch(state);
    expect(state.advancedSearch).toStrictEqual({});
    expect(state.advancedSearchQuery["operator"]).toStrictEqual("");
    expect(state.advancedSearchQuery["fields"]).toStrictEqual([]);
    expect(state.advancedSearchResponse).toStrictEqual([]);
  });

  it("can check setError mutations", () => {
    const errorStatus = true;
    mutations.setError(state, errorStatus);
    expect(state.errorStatus).toBe(true);
  });

  it("can check getAdvancedSearch getters", () => {
    const getSearchResult = {
      advancedSearch: {
        operatorIdentifier: "_and",
        children: [
          {
            operatorIdentifier: "_and",
            children: [
              {
                identifier: "registry",
                value: ["database", "standard"],
              },
            ],
          },
        ],
      },
    };
    const builtData = getters.getAdvancedSearch(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["advancedSearch"]);
  });

  it("can check getAdvancedSearchResponse getters", () => {
    const getSearchResult = {
      advancedSearchResponse: {
        id: 1,
        name: "Abc",
        registry: "xyz",
        status: "active",
        type: "any",
      },
    };
    const builtData = getters.getAdvancedSearchResponse(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["advancedSearchResponse"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });

  it("can check getErrorStatus getters", () => {
    const getSearchResult = {
      errorStatus: true,
    };
    const builtData = getters.getErrorStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["errorStatus"]);
  });
});
