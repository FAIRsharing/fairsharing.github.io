import { createLocalVue,shallowMount } from "@vue/test-utils"
import sinon from "sinon"

import Client from "@/lib/Client/RESTClient.js"
import RequestNewPassword from "@/views/Users/RequestNewPassword.vue"

const localVue = createLocalVue();

describe('ConfirmAccount.vue', () => {
    let wrapper;
    let stub;

    beforeAll(() => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {
                success: true,
                message: "Hello"
            }
        });
    });
    afterAll(() => {
        stub.restore()
    });
    beforeEach( async () => {
        wrapper = await shallowMount(RequestNewPassword, {
            localVue
        });
    });

    it("can instantiate without token", async () => {
        const title = "NewPassword";
        expect(wrapper.vm.$options.name).toMatch(title);
    });

    it("can send a reset password email", async () => {
        wrapper.vm.formData = {
          email: "123@test.com"
        };
        wrapper.vm.formValid = true
        await wrapper.vm.sendEmail();
        expect(wrapper.vm.message).toMatch("Hello");
        expect(wrapper.vm.success).toBe(true);

        wrapper.vm.formValid = false
        let response = await wrapper.vm.sendEmail()
        expect(response).toBeFalsy()
    });
});
