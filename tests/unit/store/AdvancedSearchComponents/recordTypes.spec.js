import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import RecordTypesStore from "@/store/AdvancedSearchComponents/recordTypes";

import AllRecordsData from "../../../../tests/fixtures/getAllRecordsType.json";

describe("SubjectSearch store methods", () => {
  const { actions, mutations, getters } = RecordTypesStore;
  const returnedVal = AllRecordsData;
  let state = {
    allRecordTypes: [],
    loadingData: false,
  };
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });

  it("can check fetchAllRecordTypes actions", async () => {
    const commit = jest.fn();
    await actions.fetchAllRecordTypes({ commit });
    expect(commit).toHaveBeenCalledWith("setLoadingData", true);
  });

  it("can check resetRecords actions", () => {
    const commit = jest.fn();
    actions.resetRecords({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setAllRecordTypes mutations", () => {
    mutations.setAllRecordTypes(state, returnedVal);
    expect(state.allRecordTypes).toBe(returnedVal);
  });
  it("can check setLoadingData mutations", () => {
    const loadingData = true;
    mutations.setLoadingData(state, loadingData);
    expect(state.loadingData).toBe(true);
  });

  it("can check resetAllRecordTypes mutations", () => {
    mutations.resetAllRecordTypes(state);
    expect(state.allRecordTypes).toStrictEqual([]);
  });

  it("can check getRecordTypes getters", () => {
    const getAllRecordsResult = {
      allRecordTypes: [
        {
          id: 1,
          name: "test",
          fairsharingRegistry: {
            id: 2,
            name: "Database",
          },
        },
        {
          id: 2,
          name: "abc",
          fairsharingRegistry: {
            id: 2,
            name: "Database",
          },
        },
        {
          id: 3,
          name: "test",
          fairsharingRegistry: {
            id: 1,
            name: "Standard",
          },
        },
      ],
    };
    const builtData = getters.getRecordTypes(getAllRecordsResult);
    expect(builtData).toStrictEqual(getAllRecordsResult["allRecordTypes"]);
  });
});
