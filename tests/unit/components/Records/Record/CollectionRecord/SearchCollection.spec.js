/* eslint-env jest */

import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import searchCollection from "@/components/Records/Record/CollectionRecord/SearchCollection";
import Client from "@/lib/GraphClient/GraphClient";
import introspection from "@/store/introspector";
import record from "@/store/recordData";
import Record from "@/store/recordData";
import records from "@/store/recordSearch";
import uiController from "@/store/uiController";
import userStore from "@/store/users";

import fakeIntrospection from "../../../../../fixtures/fakeIntrospection.json";

const sinon = require("sinon");
const axios = require("axios");

const vuetify = createVuetify();

const $route = {
  name: "Record",
  path: "/3449",
  query: {},
};

userStore.state.user = function () {
  return {
    metadata: {
      preferences: {
        hide_email: true,
      },
      profile_type: "profile 1",
    },
    credentials: {
      username: "username",
      token: "123",
    },
  };
};

const $store = new Vuex.Store({
  modules: {
    record: record,
    records: records,
    introspection: introspection,
    uiController: uiController,
    users: userStore,
  },
});

Record.state.currentRecord["fairsharingRecord"] = {
  name: "EOSC-Life",
  recordAssociations: [
    {
      linkedRecord: {
        id: 1,
        name: "a name",
        registry: "Standard",
        type: "terminology_artifact",
      },
      recordAssocLabel: "collects",
    },
    {
      linkedRecord: {
        id: 3,
        name: "a name 3",
        registry: "Database",
        type: "journal",
      },
      recordAssocLabel: "collects",
    },
    {
      linkedRecord: {
        id: 4,
        name: "a name 4",
        registry: "Collection",
        type: "collection",
      },
      recordAssocLabel: "collects",
    },
  ],
  registry: "Collection",
};

describe("SearchCollection.vue", function () {
  let wrapper;
  let stub = sinon.stub(Client.prototype, "executeQuery");

  beforeAll(() => {
    stub
      .withArgs(sinon.match.object)
      .returns({ searchFairsharingRecords: { records: [{ name: "name A" }] } });
  });

  afterAll(() => {
    try {
      Client.prototype.executeQuery.restore();
    } catch {
      // eslint-disable-next-line no-empty
    }
  });

  beforeEach(async () => {
    $route.query = {};
    //-- making a mock div element
    const element = document.createElement("div");
    element.id = "topElement";
    document.body.appendChild(element);
    //------

    wrapper = await shallowMount(searchCollection, {
      mocks: { $route, $store },
      vuetify,
      attachTo: element,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SearchCollection");
  });

  it("can check the mocked html element is correctly added", () => {
    const byId = document.getElementById("topElement");
    expect(byId.id).toBe("topElement");
  });

  it("can check changeListType function", () => {
    wrapper.vm.changeListType(true);
    expect(wrapper.vm.isColumnList).toBe(true);
  });

  it("can correctly raise an error", async () => {
    Client.prototype.executeQuery.restore();
    sinon
      .stub(axios, "post")
      .withArgs(sinon.match.any)
      .returns({
        data: {
          errors: [{ message: "Error" }],
        },
      });
    await expect(wrapper.vm.prepareCollectionData()).rejects;
    axios.post.restore();
  });

  it("can react to router changes", async () => {
    $route.query = { fairsharingRegistry: "Collection", page: "2" };
    const wrapper2 = await shallowMount(searchCollection, {
      mocks: { $route, $store },
      vuetify,
    });
    expect(wrapper2.vm.currentPath).toStrictEqual([
      "Collection",
      { fairsharingRegistry: "Collection", page: "2" },
    ]);
    $route.query = { fairsharingRegistry: "" };
    expect(wrapper.vm.currentPath).toStrictEqual(["Collection", {}]);
    wrapper.vm.testEnvironment = true;
  });

  it("can check mounted life cycle properly loads data", async () => {
    $route.query = {
      page: "2",
    };
    let returnedVal = {
      data: {
        data: fakeIntrospection.data,
      },
      headers: {
        maintenance: "false",
      },
    };
    sinon
      .stub(Client.prototype, "getData")
      .withArgs(sinon.match.any)
      .returns(returnedVal);
    await wrapper.vm.$store.dispatch("introspection/fetchParameters");
    Client.prototype.getData.restore();

    const wrapperWithQuery = await shallowMount(searchCollection, {
      mocks: { $route, $store },
      vuetify,
    });
    let queryParameters = await wrapperWithQuery.vm.$store.getters[
      "introspection/buildQueryParameters"
    ](wrapperWithQuery.vm.currentPath);
    expect(queryParameters).toStrictEqual({
      page: "2",
    });
  });

  it("can react when no recordAssociation available", async () => {
    Record.state.currentRecord["fairsharingRecord"] = {
      name: "EOSC-Life",
      registry: "Collection",
    };
    expect(await wrapper.vm.prepareCollectionData()).toBe(false);
  });

  it("can reset the records store when destroyed", () => {
    wrapper.unmount();
    expect(wrapper.vm.$store.state.records.facets).toStrictEqual([]);
    expect(wrapper.vm.$store.state.records.records).toStrictEqual([]);
    expect(wrapper.vm.$store.state.records.loading).toBe(false);
    const otherStates = ["hits", "totalPages", "perPage"];
    otherStates.forEach((state) => {
      expect(wrapper.vm.$store.state.records[state]).toBe(null);
    });
  });
});
