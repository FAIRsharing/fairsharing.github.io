import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import sinon from "sinon"
import ResetPassword from "@/views/Users/ResetPassword.vue"
import Client from "@/components/Client/RESTClient.js"

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

const $route = {
    path: "/",
    query: {
        reset_password_token: "imatoken"
    }
};

describe('ConfirmAccount.vue', () => {
    let wrapper;
    let stub;

    beforeAll(() => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: 'Hello !'
        });
    });
    afterAll(() => {
        stub.restore()
    });

    it("can instantiate without token", async () => {
        wrapper = await shallowMount(ResetPassword, {
            localVue,
            router,
        });
        const title = "ResetPassword";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.message).toBe("Missing token")
    });

    it("can reset a password", async () => {
        const secondLocalVue = createLocalVue();
        wrapper = await shallowMount(ResetPassword, {
            mocks: {$route},
            secondLocalVue,
            router
        });
        wrapper.vm.formData = {
            password: 123,
            password_confirmation: 123,
            reset_password_token: 123
        };
        await wrapper.vm.submitPassword();
        expect(wrapper.vm.message).toBe("Hello !");
        stub.restore();
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {error: 'I am an error'}
        });
        await wrapper.vm.submitPassword();
        expect(wrapper.vm.error).toBe(true);
        expect(wrapper.vm.message).toBe('I am an error');
    });

});
