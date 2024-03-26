import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import TaxonomiesSearchStore from "@/store/AdvancedSearchComponents/taxonomiesSearch";

import TaxonomiesSearchData from "../../../../tests/fixtures/getTaxonomiesSearch.json";

describe("TaxonomiesSearchStore store methods", () => {
  const { actions, mutations, getters } = TaxonomiesSearchStore;
  const returnedVal = TaxonomiesSearchData;
  let state = {
    searchTaxonomies: [],
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

  it("can check fetchSearchTaxonomies actions", () => {
    const commit = jest.fn();
    actions.fetchSearchTaxonomies({ commit }, "taxonomies");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchTaxonomies actions with no value searchTaxonomies array in response ELSE", () => {
    const returnedValElse = {
      searchTaxonomies: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchTaxonomies({ commit }, "taxonomies");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetSearchTaxonomies actions", () => {
    const commit = jest.fn();
    actions.resetSearchTaxonomies({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchTaxonomies mutations", () => {
    const taxonomiesList = ["test", "test1", "test2"];
    mutations.setSearchTaxonomies(state, taxonomiesList);
    expect(state.searchTaxonomies).toBe(taxonomiesList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetTaxonomiesSearch mutations", () => {
    mutations.resetTaxonomiesSearch(state);
    expect(state.searchTaxonomies).toStrictEqual([]);
  });

  it("can check getSearchTaxonomies getters", () => {
    const getTaxonomiesResult = {
      searchTaxonomies: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchTaxonomies(getTaxonomiesResult);
    expect(builtData).toStrictEqual(getTaxonomiesResult["searchTaxonomies"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });
});
