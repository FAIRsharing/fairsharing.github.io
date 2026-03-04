import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import CuratorNotes from "@/components/Records/Record/CuratorNotes";
import Record from "@/store/recordData.js";
import users from "@/store/users";

const vuetify = createVuetify();

const $store = new Vuex.Store({
  modules: {
    record: Record,
    users: users,
  },
});

$store.state.users.user().is_curator = true;
$store.state.record.currentRecord["fairsharingRecord"] = {
  curatorNotes: "some description",
};

describe("CuratorNotes.vue", function () {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(CuratorNotes, {
      vuetify,
      mocks: { $store },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CuratorNotes");
  });

  it("can add newlines", () => {
    expect(wrapper.vm.prepareNotes("this\nthat")).toEqual("this<br>that");
  });
});
