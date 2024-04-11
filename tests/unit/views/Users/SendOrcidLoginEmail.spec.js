import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";

import Client from "@/lib/Client/RESTClient.js";
import SendOrcidLoginEmail from "@/views/Users/SendOrcidLoginEmail";

describe("SendOrcidLoginEmail.vue", function () {
  let wrapper;
  let restStub;
  const button = "Send Verification Email";
  const message = "Verification email sent successfully!";
  restStub = sinon.stub(Client.prototype, "sendOrcidVerification");

  const router = new VueRouter();
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  beforeEach(() => {
    wrapper = shallowMount(SendOrcidLoginEmail, {
      localVue,
      router,
    });
  });

  it("can be instantiated", () => {
    wrapper.vm.getURLQueryParams();
    wrapper.vm.uid = "0009-0009-7606-5584";
    wrapper.vm.identifier = "55324a98-4b8d-4d55-93a6-a37b55ce906c";
    expect(wrapper.vm.$options.name).toMatch("SendOrcidLoginEmail");
  });

  it("sends an email verification request and responds", async () => {
    restStub.returns({
      message: message,
    });
    wrapper.vm.$refs.emailRef = {
      reset: jest.fn().mockImplementation(() => true),
    };
    wrapper.vm.success = false;
    wrapper.vm.buttonDisabled = false;
    wrapper.vm.buttonMessage = button;
    wrapper.vm.email = "example@fairsharing.org";
    await wrapper.vm.sendVerificationRequest();
    expect(wrapper.vm.success).toBe(true);
    expect(wrapper.vm.emailId).toEqual("example@fairsharing.org");
  });

  it("does not sends an email verification request and encounters error", async () => {
    wrapper.vm.email = "example@fairsharing.org";
    restStub.returns({
      message: "Verification email failed",
    });
    await wrapper.vm.sendVerificationRequest();
    expect(wrapper.vm.error).toBe("Verification email not sent!");
  });
});
