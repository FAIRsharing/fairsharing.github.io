import { shallowMount } from "@vue/test-utils";
import Community from "./Community.vue";

describe("Community.vue", () => {

  it("renders", () => {

    let wrapper = shallowMount(Community, {});
    expect(wrapper.vm.greet()).toBe(0);

  })

});
