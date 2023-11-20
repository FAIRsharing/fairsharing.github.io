import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import AdvancedSearchStore from "@/store/advancedSearch.js";

import AdvancedSearchData from "../../../tests/fixtures/getAdvancedSearch.json";

describe("AdvancedSearch store methods", () => {
  const { actions, mutations } = AdvancedSearchStore;
  const returnedVal = AdvancedSearchData;
  let state = {
    advancedSearch: {},
    advancedSearchQuery: {
      operator: "",
      fields: [],
    },
    advancedSearchResponse: [],
    error: false,
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

  it("can check resetAdvancedSearch actions", () => {
    const commit = jest.fn();
    actions.resetAdvancedSearch({ commit });
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

  it("can check resetAdvancedQuery mutations", () => {
    mutations.resetAdvancedQuery(state);
    expect(state.advancedSearch).toStrictEqual({});
  });
});
