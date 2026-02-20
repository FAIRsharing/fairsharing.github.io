import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import AdvancedSearchStore from "@/store/AdvancedSearchComponents/advancedSearch.js";

import AdvancedSearchData from "../../fixtures/getAdvancedSearch.json";

describe("AdvancedSearch store methods", () => {
  const { actions, mutations, getters } = AdvancedSearchStore;
  const returnedVal = AdvancedSearchData;
  let state = {
    advancedSearch: {},
    editAdvancedSearch: {},
    advancedSearchQuery: {
      operator: "",
      fields: [],
    },
    advancedSearchResponse: [],
    errorStatus: false,
    loadingStatus: false,
    editDialogStatus: false,
    advancedSearchDialogStatus: false,
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
    expect(commit).toHaveBeenCalledTimes(3);
  });

  it("can check fetchAdvancedSearchResults actions without advanceSearchTerm", () => {
    const commit = jest.fn();
    actions.fetchAdvancedSearchResults({ commit });
    expect(commit).toHaveBeenCalledTimes(3);
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

  it("can check setAdvancedSearchText mutations", () => {
    const searchText = "test";
    mutations.setAdvancedSearchText(state, searchText);
    expect(state.advancedSearchText).toBe(searchText);
  });

  it("can check setAdvancedSearch mutations", () => {
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
    mutations.setAdvancedSearch(state, searchedObj);
    expect(state.advancedSearch).toBe(searchedObj);
  });

  it("can check setEditAdvancedSearch mutations", () => {
    const editSearchedObj = {
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
    mutations.setEditAdvancedSearch(state, editSearchedObj);
    expect(state.editAdvancedSearch).toBe(editSearchedObj);
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

  it("can check setAdvancedSearchQuery mutations", () => {
    const advancedSearchQuery = {
      operator: "_and",
      fields: [
        {
          operator: "_and",
          registry: ["test", "abc"],
        },
      ],
    };
    mutations.setAdvancedSearchQuery(state, advancedSearchQuery);
    expect(state.advancedSearchQuery["operator"]).toBe(
      advancedSearchQuery["operator"],
    );
    expect(state.advancedSearchQuery["fields"]).toBe(
      advancedSearchQuery["fields"],
    );
  });

  it("can check setEditDialogStatus mutations", () => {
    const editDialogStatus = true;
    mutations.setEditDialogStatus(state, editDialogStatus);
    expect(state.editDialogStatus).toBe(true);
  });
  it("can check setAdvancedSearchDialogStatus mutations", () => {
    const advancedSearchDialogStatus = true;
    mutations.setAdvancedSearchDialogStatus(state, advancedSearchDialogStatus);
    expect(state.advancedSearchDialogStatus).toBe(true);
  });

  it("can check getAdvancedSearchText getters", () => {
    const getSearchResult = {
      advancedSearchText: "test",
    };
    const builtData = getters.getAdvancedSearchText(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["advancedSearchText"]);
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

  it("can check getEditAdvancedSearch getters", () => {
    const getSearchResult = {
      editAdvancedSearch: {
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
    const builtData = getters.getEditAdvancedSearch(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["editAdvancedSearch"]);
  });

  it("can check getAdvancedSearchQuery getters", () => {
    const getSearchResult = {
      advancedSearchQuery: {
        operator: "_and",
        fields: [
          {
            operator: "_and",
            registry: ["test", "abc"],
          },
        ],
      },
    };
    const builtData = getters.getAdvancedSearchQuery(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["advancedSearchQuery"]);
  });

  it("can check getEditDialogStatus getters", () => {
    const getSearchResult = {
      editDialogStatus: true,
    };
    const builtData = getters.getEditDialogStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["editDialogStatus"]);
  });

  it("can check getAdvancedSearchDialogStatus getters", () => {
    const getSearchResult = {
      advancedSearchDialogStatus: true,
    };
    const builtData = getters.getAdvancedSearchDialogStatus(getSearchResult);
    expect(builtData).toStrictEqual(
      getSearchResult["advancedSearchDialogStatus"],
    );
  });
});
