import sinon from "sinon";

import GraphClient from "@/lib/GraphClient/GraphClient.js";
import SaveSearchStore from "@/store/saveSearch.js";

import SaveSearchData from "../../../tests/fixtures/getSaveSearch.json";

describe("SaveSearch store methods", () => {
  const { actions, mutations, getters } = SaveSearchStore;
  const returnedVal = SaveSearchData;

  let state = {
    loadingStatus: false,
    saveSearchStepperDialog: false,
    showStepper: true,
    policySelected: [],
    policyRecords: [],
    organisationSelected: [],
    userSelected: [],
    saveSearchStatus: false,
    saveSearchResult: [],
  };
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });

  it("can check fetchPolicyRecords actions", () => {
    const commit = jest.fn();
    actions.fetchPolicyRecords({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetSaveSearchDialog actions", () => {
    const commit = jest.fn();
    actions.resetSaveSearchDialog({ commit });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSaveSearchStepperDialog mutations", () => {
    const stepper = true;
    mutations.setSaveSearchStepperDialog(state, stepper);
    expect(state.saveSearchStepperDialog).toBe(stepper);
  });

  it("can check setSaveSearchResult mutations", () => {
    const saveSearchResult = {
      id: 207,
      name: "Test",
      comments: "Test",
      url: "http://www.test.com",
      params: {
        operator: "_and",
        fields: [
          {
            operator: "_and",
            registry: ["policy"],
          },
        ],
      },
      creator_id: 7339,
      created_at: "2024-06-20T10:08:02.159Z",
      updated_at: "2024-06-20T10:08:02.159Z",
    };

    mutations.setSaveSearchResult(state, saveSearchResult);
    expect(state.saveSearchResult).toStrictEqual([saveSearchResult]);
  });

  it("can check setPolicyRecords mutations", () => {
    const policyRecords = [
      {
        id: 1,
        name: "Policy1",
      },
    ];
    mutations.setPolicyRecords(state, policyRecords);
    expect(state.policyRecords).toBe(policyRecords);
  });

  it("can check setPolicySelected mutations", () => {
    const policySelected = [
      {
        id: 1,
        name: "Policy1",
      },
    ];
    mutations.setPolicySelected(state, policySelected);
    expect(state.policySelected).toBe(policySelected);
  });

  it("can check setOrganisationSelected mutations", () => {
    const organisationSelected = [
      {
        id: 1,
        name: "Organisation1",
      },
    ];
    mutations.setOrganisationSelected(state, organisationSelected);
    expect(state.organisationSelected).toBe(organisationSelected);
  });

  it("can check setUserSelected mutations", () => {
    const userSelected = [
      {
        id: 1,
        name: "User1",
      },
    ];
    mutations.setUserSelected(state, userSelected);
    expect(state.userSelected).toBe(userSelected);
  });

  it("can check resetSaveSearchStepper mutations", () => {
    mutations.resetSaveSearchStepper(state);
    expect(state.loadingStatus).toStrictEqual(false);
    expect(state.saveSearchStepperDialog).toStrictEqual(false);
    expect(state.saveSearchResult).toStrictEqual([]);
    expect(state.organisationSelected).toStrictEqual([]);
    expect(state.policySelected).toStrictEqual([]);
    expect(state.policyRecords).toStrictEqual([]);
    expect(state.userSelected).toStrictEqual([]);
    expect(state.saveSearchStatus).toStrictEqual(false);
    expect(state.showStepper).toStrictEqual(true);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(loadingStatus);
  });

  it("can check setSaveSearchStatus mutations", () => {
    const saveSearchStatus = true;
    mutations.setSaveSearchStatus(state, saveSearchStatus);
    expect(state.saveSearchStatus).toBe(saveSearchStatus);
  });

  it("can check setShowStepper mutations", () => {
    const showStepper = true;
    mutations.setShowStepper(state, showStepper);
    expect(state.showStepper).toBe(showStepper);
  });

  it("can check getSaveSearchStepperDialog getters", () => {
    const getSaveSearchResult = {
      saveSearchStepperDialog: true,
    };
    const builtData = getters.getSaveSearchStepperDialog(getSaveSearchResult);
    expect(builtData).toStrictEqual(
      getSaveSearchResult["saveSearchStepperDialog"],
    );
  });

  it("can check getSaveSearchResult getters", () => {
    const getSaveSearchResult = {
      saveSearchResult: [
        {
          id: 207,
          name: "Test",
          comments: "Test",
          url: "http://www.test.com",
          params: {
            operator: "_and",
            fields: [
              {
                operator: "_and",
                registry: ["policy"],
              },
            ],
          },
          creator_id: 7339,
          created_at: "2024-06-20T10:08:02.159Z",
          updated_at: "2024-06-20T10:08:02.159Z",
        },
      ],
    };
    const builtData = getters.getSaveSearchResult(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["saveSearchResult"]);
  });

  it("can check getPolicyRecords getters", () => {
    const getSaveSearchResult = {
      policyRecords: [
        {
          id: 1,
          name: "Policy1",
        },
      ],
    };
    const builtData = getters.getPolicyRecords(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["policyRecords"]);
  });

  it("can check getPolicySelected getters", () => {
    const getSaveSearchResult = {
      policySelected: [
        {
          id: 1,
          name: "Policy1",
        },
      ],
    };
    const builtData = getters.getPolicySelected(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["policySelected"]);
  });

  it("can check getOrganisationSelected getters", () => {
    const getSaveSearchResult = {
      organisationSelected: [
        {
          id: 1,
          name: "Organisation1",
        },
      ],
    };
    const builtData = getters.getOrganisationSelected(getSaveSearchResult);
    expect(builtData).toStrictEqual(
      getSaveSearchResult["organisationSelected"],
    );
  });

  it("can check getUserSelected getters", () => {
    const getSaveSearchResult = {
      userSelected: [
        {
          id: 1,
          name: "User1",
        },
      ],
    };
    const builtData = getters.getUserSelected(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["userSelected"]);
  });

  it("can check getUserSelected getters", () => {
    const getSaveSearchResult = {
      userSelected: [
        {
          id: 1,
          name: "User1",
        },
      ],
    };
    const builtData = getters.getUserSelected(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["userSelected"]);
  });

  it("can check getLoadingStatus getters", () => {
    const getSaveSearchResult = {
      loadingStatus: true,
    };
    const builtData = getters.getLoadingStatus(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["loadingStatus"]);
  });

  it("can check getSaveSearchStatus getters", () => {
    const getSaveSearchResult = {
      saveSearchStatus: true,
    };
    const builtData = getters.getSaveSearchStatus(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["saveSearchStatus"]);
  });

  it("can check getShowStepper getters", () => {
    const getSaveSearchResult = {
      showStepper: true,
    };
    const builtData = getters.getShowStepper(getSaveSearchResult);
    expect(builtData).toStrictEqual(getSaveSearchResult["showStepper"]);
  });
});
