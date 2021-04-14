import { shallowMount, createLocalVue } from "@vue/test-utils"
import sinon from "sinon"
import RequestNewPassword from "@/views/Users/RequestNewPassword.vue"
import Client from "@/lib/Client/RESTClient.js"

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
        expect(wrapper.name()).toMatch(title);
    });

    it("can send a reset password email", async () => {
        wrapper.vm.formData = {
          email: "123@test.com"
        };
        await wrapper.vm.sendEmail();
        expect(wrapper.vm.message).toMatch("Hello");
        expect(wrapper.vm.success).toBe(true);
    });
});
