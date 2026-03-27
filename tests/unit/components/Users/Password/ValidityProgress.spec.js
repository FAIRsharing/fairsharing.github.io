import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";

import ValidityProgress from "@/components/Users/Password/ValidityProgress";
import Client from "@/lib/Client/RESTClient.js";

let stub;

describe("ValidityProgress.vue", () => {
  it("can be mounted", () => {
    let wrapper = shallowMount(ValidityProgress, {});
    expect(wrapper.vm.$options.name).toBe("ValidityProgress");
    expect(wrapper.vm["passwordValidity"]).toBe(0);
    expect(wrapper.vm["passwordColor"]).toBe("red");
  });

  it("can react to password change", async () => {
    stub = sinon.stub(Client.prototype, "verifyPassword");
    stub.returns({
      percent: 0,
    });
    const anotherWrapper = await shallowMount(ValidityProgress, {
      props: {
        password: "Great password 123!?",
      },
    });
    await anotherWrapper.vm.verifyPwd();
    expect(anotherWrapper.vm.passwordColor).toBe("red");
    expect(anotherWrapper.vm.passwordValidity).toBe(0);
    stub.restore();
  });
});
