import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import ObjectTypesStore from "@/store/AdvancedSearchComponents/objectTypes";

import ObjectTypesData from "../../../fixtures/getObjectTypes.json";

describe("ObjectTypes store methods", () => {
  const { actions, mutations, getters } = ObjectTypesStore;
  const returnedVal = ObjectTypesData;
  let state = {
    objectTypes: [],
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

  it("can check fetchObjectTypes actions", () => {
    const commit = jest.fn();
    actions.fetchObjectTypes({ commit }, "type");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check fetchObjectTypes actions with no value objectTypes array in response ELSE", () => {
    const returnedValElse = {
      objectTypes: [],
    };
    stub.returns(returnedValElse);
    const commit = jest.fn();
    actions.fetchObjectTypes({ commit }, "type");

    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetObjectTypes actions", () => {
    const commit = jest.fn();
    actions.resetRecords({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setObjectTypes mutations", () => {
    const typesList = ["test", "test1", "test2"];
    mutations.setObjectTypes(state, typesList);
    expect(state.objectTypes).toBe(typesList);
  });

  it("can check setLoadingData mutations", () => {
    const loadingData = true;
    mutations.setLoadingData(state, loadingData);
    expect(state.loadingData).toBe(true);
  });

  it("can check resetObjectTypes mutations", () => {
    mutations.resetObjectTypes(state);
    expect(state.objectTypes).toStrictEqual([]);
  });

  it("can check getObjectTypes getters", () => {
    const getObjectsResult = {
      objectTypes: {
        records: ["test", "test1", "test2"],
      },
    };
    const builtData = getters.getObjectTypes(getObjectsResult);
    expect(builtData).toStrictEqual(getObjectsResult["objectTypes"]);
  });

  it("can check getLoadingData getters", () => {
    const getSearchResult = {
      loadingData: true,
    };
    const builtData = getters.getLoadingData(getSearchResult);
    expect(builtData).toStrictEqual(getSearchResult["loadingData"]);
  });
});
