import {shallowMount} from "@vue/test-utils";
import Community from "./Community.vue";

describe("Community.vue", function(){
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Community, {});
  });

  it("renders", function(){
    expect(wrapper.vm.greet()).toBe(0);
  })
});
