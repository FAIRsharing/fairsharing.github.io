import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex";
import sinon from "sinon"
import ResetPassword from "@/views/Users/ResetPassword.vue"
import Client from "@/lib/Client/RESTClient.js"
import usersStore from "@/store/users";


const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    }
});

const $route = {
    path: "/",
    query: {
        reset_password_token: "imatoken"
    }
};

describe('ResetPassword.vue', () => {
    let wrapper;
    let stub;

    beforeAll(() => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {message: 'Hello !'}
        });
    });
    afterAll(() => {
        stub.restore()
    });

    it("raises an error when no token and no logged in user", async () => {
        wrapper = await shallowMount(ResetPassword, {
            localVue,
            router,
            mocks: {$store}
        });
        const title = "ResetPassword";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.messages().resetPassword).toStrictEqual({
            error: true,
            message: "Missing Token"
        })
    });

    it("can reset a password of a user", async () => {
        const secondLocalVue = createLocalVue();
        const $router = {
            push: jest.fn()
        };
        wrapper = await shallowMount(ResetPassword, {
            mocks: {$route, $store, $router},
            secondLocalVue,
            router
        });

        wrapper.vm.formData = {
            password: 123,
            password_confirmation: 123,
            reset_password_token: 123
        };
        await wrapper.vm.submitPassword();
        expect(wrapper.vm.messages().login).toStrictEqual({
            message: 'Password change successful. Please log back in.',
            error: false
        });

        stub.restore();
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {error: {response: {data: {errors: 'I am an error'}}}}
        });
        await wrapper.vm.submitPassword();
        expect(wrapper.vm.messages().resetPassword).toStrictEqual({
            message: 'I am an error',
            error: true
        });

        wrapper.vm.formData = {
            password: 123,
            password_confirmation: 123,
            oldPwd: 123
        };
        await wrapper.vm.submit(true);

        stub.restore();
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {message: 'Hello'}
        });
        await wrapper.vm.submit(true);
        expect(wrapper.vm.messages().login).toStrictEqual({
            message: 'Password change successful. Please log back in.',
            error: false
        });



    });
});
