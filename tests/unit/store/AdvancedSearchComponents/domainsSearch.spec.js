import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import DomainsSearchStore from "@/store/AdvancedSearchComponents/domainsSearch";

import DomainsSearchData from "../../../../tests/fixtures/getDomainsSearch.json";

describe("DomainsSearch store methods", () => {
  const { actions, mutations, getters } = DomainsSearchStore;
  const returnedVal = DomainsSearchData;
  let state = {
    searchDomains: [],
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

  it("can check fetchSearchDomains actions", () => {
    const commit = jest.fn();
    actions.fetchSearchDomains({ commit }, "domains");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchDomains actions with no value searchDomains array in response ELSE", () => {
    const returnedValElse = {
      searchDomains: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchDomains({ commit }, "domains");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetSearchDomains actions", () => {
    const commit = jest.fn();
    actions.resetSearchDomains({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchDomains mutations", () => {
    const domainsList = ["test", "test1", "test2"];
    mutations.setSearchDomains(state, domainsList);
    expect(state.searchDomains).toBe(domainsList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetDomainsSearch mutations", () => {
    mutations.resetDomainsSearch(state);
    expect(state.searchDomains).toStrictEqual([]);
  });

  it("can check getSearchDomains getters", () => {
    const getDomainsResult = {
      searchDomains: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchDomains(getDomainsResult);
    expect(builtData).toStrictEqual(getDomainsResult["searchDomains"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });
});
