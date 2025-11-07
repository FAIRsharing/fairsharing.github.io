import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import CountriesSearchStore from "@/store/AdvancedSearchComponents/countriesSearch";

import CountriesSearchData from "../../../fixtures/getCountriesSearch.json";

describe("CountriesSearch store methods", () => {
  const { actions, mutations, getters } = CountriesSearchStore;
  const returnedVal = CountriesSearchData;
  let state = {
    searchCountries: [],
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

  it("can check fetchSearchCountries actions", () => {
    const commit = jest.fn();
    actions.fetchSearchCountries({ commit }, "country");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchCountries actions with no value searchCountries array in response ELSE", () => {
    const returnedValElse = {
      searchCountries: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchCountries({ commit }, "country");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetSearchCountries actions", () => {
    const commit = jest.fn();
    actions.resetSearchCountries({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchCountries mutations", () => {
    const countriesList = ["test", "test1", "test2"];
    mutations.setSearchCountries(state, countriesList);
    expect(state.searchCountries).toBe(countriesList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetCountriesSearch mutations", () => {
    mutations.resetCountriesSearch(state);
    expect(state.searchCountries).toStrictEqual([]);
  });

  it("can check getSearchCountries getters", () => {
    const getCountriesResult = {
      searchCountries: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchCountries(getCountriesResult);
    expect(builtData).toStrictEqual(getCountriesResult["searchCountries"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });
});
