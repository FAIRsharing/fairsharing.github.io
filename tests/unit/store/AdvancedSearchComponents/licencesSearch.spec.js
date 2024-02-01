import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import LicenceSearchStore from "@/store/AdvancedSearchComponents/licencesSearch";

import LicencesSearchData from "../../../../tests/fixtures/getLicencesSearch.json";

describe("LicencesSearch store methods", () => {
  const { actions, mutations, getters } = LicenceSearchStore;
  const returnedVal = LicencesSearchData;
  let state = {
    searchLicences: [],
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

  it("can check fetchSearchLicences actions", () => {
    const commit = jest.fn();
    actions.fetchSearchLicences({ commit }, "licences");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchLicences actions with no value searchLicences array in response ELSE", () => {
    const returnedValElse = {
      searchLicences: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchLicences({ commit }, "licences");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetSearchLicences actions", () => {
    const commit = jest.fn();
    actions.resetSearchLicences({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchLicences mutations", () => {
    const licenceList = ["test", "test1", "test2"];
    mutations.setSearchLicences(state, licenceList);
    expect(state.searchLicences).toBe(licenceList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetLicencesSearch mutations", () => {
    mutations.resetLicencesSearch(state);
    expect(state.searchLicences).toStrictEqual([]);
  });

  it("can check getSearchLicences getters", () => {
    const getLicencesResult = {
      searchLicences: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchLicences(getLicencesResult);
    expect(builtData).toStrictEqual(getLicencesResult["searchLicences"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });
});
