import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import OrganisationSearchStore from "@/store/AdvancedSearchComponents/organisationSearch";

import OrganisationSearchData from "../../../../tests/fixtures/getOrganisationsSearch.json";

describe("OrganisationSearchStore store methods", () => {
  const { actions, mutations, getters } = OrganisationSearchStore;
  const returnedVal = OrganisationSearchData;
  let state = {
    searchOrganisations: [],
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

  it("can check fetchSearchOrganisations actions", () => {
    const commit = jest.fn();
    actions.fetchSearchOrganisations({ commit }, "organisations");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchOrganisations actions with no value searchOrganisations array in response ELSE", () => {
    const returnedValElse = {
      searchOrganisations: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchOrganisations({ commit }, "organisations");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetOrganisations actions", () => {
    const commit = jest.fn();
    actions.resetOrganisations({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchOrganisations mutations", () => {
    const organisationList = ["test", "test1", "test2"];
    mutations.setSearchOrganisations(state, organisationList);
    expect(state.searchOrganisations).toBe(organisationList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetOrganisationSearch mutations", () => {
    mutations.resetOrganisationSearch(state);
    expect(state.searchOrganisations).toStrictEqual([]);
  });

  it("can check getSearchOrganisations getters", () => {
    const getOrganisationsResult = {
      searchOrganisations: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchOrganisations(getOrganisationsResult);
    expect(builtData).toStrictEqual(
      getOrganisationsResult["searchOrganisations"]
    );
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });
});
