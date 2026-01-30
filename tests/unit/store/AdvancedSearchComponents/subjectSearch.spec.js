import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import SubjectSearchStore from "@/store/AdvancedSearchComponents/subjectSearch";

import SubjectSearchData from "../../../fixtures/getSubjectSearch.json";

describe("SubjectSearch store methods", () => {
  const { actions, mutations, getters } = SubjectSearchStore;
  const returnedVal = SubjectSearchData;
  let state = {
    searchSubjects: [],
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

  it("can check fetchSearchSubjects actions", () => {
    const commit = jest.fn();
    actions.fetchSearchSubjects({ commit }, "subject");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchSearchSubjects actions with no children in response", () => {
    const returnedValElse = {
      searchSubjects: [
        {
          id: 585,
          label: "Genetics",
          parents: [
            {
              id: 812,
              label: "Biology",
            },
          ],
          children: [],
          fairsharingRecords: [
            {
              id: 2779,
              name: "BioGRID Open Repository of CRISPR Screens",
            },
          ],
        },
      ],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchSearchSubjects({ commit }, "Genetics");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetSubjects actions", () => {
    const commit = jest.fn();
    actions.resetSubjects({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSearchSubjects mutations", () => {
    const subjectList = ["test", "test1", "test2"];
    mutations.setSearchSubjects(state, subjectList);
    expect(state.searchSubjects).toBe(subjectList);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetSubjectSearch mutations", () => {
    mutations.resetSubjectSearch(state);
    expect(state.searchSubjects).toStrictEqual([]);
  });

  it("can check getSearchSubjects getters", () => {
    const getSubjectResult = {
      searchSubjects: ["test", "test1", "test2"],
    };
    const builtData = getters.getSearchSubjects(getSubjectResult);
    expect(builtData).toStrictEqual(getSubjectResult["searchSubjects"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingStatus"]);
  });
});
