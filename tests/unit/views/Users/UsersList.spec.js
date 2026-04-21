import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import GraphClient from "@/lib/GraphClient/GraphClient";
import allUsersQuery from "@/lib/GraphClient/queries/getAllUsers.json";
import usersStore from "@/store/users";
import UsersList from "@/views/Users/UsersList";

const vuetify = createVuetify();
const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});

describe("UsersList.vue", function () {
  let wrapper;

  let graphStub;

  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  graphStub.withArgs(allUsersQuery).returns({
    allUsers: [{ id: 1, username: "one", email: "one@one.com" }],
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(() => {
    wrapper = shallowMount(UsersList, {
      vuetify,
      mocks: { $store },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  afterAll(() => {
    graphStub.restore();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("UsersList");
  });

  it("can get users", async () => {
    let spy = vi.spyOn(wrapper.vm, "getUsersList");
    await wrapper.setData({ searchString: "search string" });
    expect(spy).toHaveBeenCalled();
  });
});
