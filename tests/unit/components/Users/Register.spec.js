/* eslint-env jest */

import { mount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import { createVuetify } from "vuetify";

import Register from "@/components/Users/Register.vue";
import Client from "@/lib/Client/RESTClient.js";

const router = new VueRouter();
const vuetify = createVuetify();

describe("Register.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Register, {
      router,
      vuetify,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("can be instantiated", () => {
    const title = "Register";
    expect(wrapper.vm.$options.name).toMatch(title);
  });

  it("can create new accounts", async () => {
    let stub = sinon.stub(Client.prototype, "createAccount");
    stub.withArgs(sinon.match.any).returns({
      data: "Hello World",
    });
    wrapper.vm.loginData = {
      name: "Terazus",
      email: "test@test.com",
      password: "test",
      repeatPwd: "test",
    };
    await wrapper.vm.register();
    expect(wrapper.vm.message).toBe(
      "Account created, please verify your email address test@test.com",
    );
    expect(wrapper.vm.$refs["registerForm"]).toBeTruthy();
  });

  it("can process errors", async () => {
    let stub = sinon.stub(Client.prototype, "createAccount");
    stub.withArgs(sinon.match.any).returns({
      error: {
        response: {
          data: {
            errors: {
              email: ["missing"],
            },
          },
        },
      },
    });
    wrapper.vm.loginData = {
      name: "Terazus",
      email: "test@test.com",
      password: "test",
      repeatPwd: "test",
    };
    await wrapper.vm.register();
    expect(wrapper.vm.errors).toStrictEqual(["email missing"]);
  });
});
