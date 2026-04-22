import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import RecordStatus from "@/components/Records/Shared/RecordStatus.vue";
import light from "@/plugins/theme";

let vuetify = createVuetify({
  theme: {
    defaultTheme: "fairSharingTheme",
    themes: { fairSharingTheme: light },
  },
});

describe("RecordStatus.vue", function () {
  let wrapper;

  wrapper = shallowMount(RecordStatus, {
    vuetify,
    props: { record: { status: "ready", type: "collection" } },
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can check either record state as props is passed or not ", async () => {
    await wrapper.setProps({
      record: { status: undefined, type: "collection" },
    });
    expect(wrapper.vm.statusStyles[wrapper.vm.record.status]).toStrictEqual({
      title: "?",
      tooltip: "Undefined",
      backColor: "background: linear-gradient(red, red)",
    });
  });
});
