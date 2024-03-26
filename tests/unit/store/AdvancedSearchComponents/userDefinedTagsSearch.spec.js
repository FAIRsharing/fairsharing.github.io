import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import UserDefinedTagsSearchStore from "@/store/AdvancedSearchComponents/userDefinedTagsSearch";

import UserDefinedTagsSearchData from "../../../../tests/fixtures/getUserDefinedTagsSearch.json";

describe("TaxonomiesSearchStore store methods", () => {
  const { actions, mutations, getters } = UserDefinedTagsSearchStore;
  const returnedVal = UserDefinedTagsSearchData;
  let state = {
    searchUserDefinedTags: [],
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

  it("can check fetchSearchUserDefinedTags actions", () => {
    const commit = jest.fn();
    actions.fetchSearchUserDefinedTags({ commit }, "userdefinedtags");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchUserDefinedTags actions with no value searchUserDefinedTags array in response ELSE", () => {
    const returnedValElse = {
      searchUserDefinedTags: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchUserDefinedTags({ commit }, "userdefinedtags");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetUserDefinedTags actions", () => {
    const commit = jest.fn();
    actions.resetUserDefinedTags({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchUserDefinedTags mutations", () => {
    const userDefinedTagsList = ["test", "test1", "test2"];
    mutations.setSearchUserDefinedTags(state, userDefinedTagsList);
    expect(state.searchUserDefinedTags).toBe(userDefinedTagsList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetUserDefinedTagsSearch mutations", () => {
    mutations.resetUserDefinedTagsSearch(state);
    expect(state.searchUserDefinedTags).toStrictEqual([]);
  });

  it("can check getSearchUserDefinedTags getters", () => {
    const getUserDefinedTagsResult = {
      searchUserDefinedTags: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchUserDefinedTags(
      getUserDefinedTagsResult
    );
    expect(builtData).toStrictEqual(
      getUserDefinedTagsResult["searchUserDefinedTags"]
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
