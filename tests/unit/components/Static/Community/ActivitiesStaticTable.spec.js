import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import ActivitiesStaticTable from "@/components/Static/Community/ActivitiesStaticTable";

describe("ActivitiesStaticTable.vue", function () {
  let wrapper;
  const vuetify = createVuetify();
  beforeEach(() => {
    wrapper = shallowMount(ActivitiesStaticTable, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ActivitiesStaticTable");
  });
});
