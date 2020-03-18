import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import sinon from "sinon"
import ConfirmAccount from "@/views/Users/ConfirmAccount.vue"
import Client from "@/components/Client/RESTClient.js"

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

const $route = {
    path: "/hhh",
    query: {
        token: "imatoken"
    }
};

describe('ConfirmAccount.vue', () => {
    let wrapper;
    let stub;

    beforeAll( () => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: 'Hello !'
        });
    });
    afterAll(() => {
        stub.restore()
    });

    it("can instantiate without token", () => {
        wrapper = shallowMount(ConfirmAccount, {
            localVue,
            router,
        });
        const title = "ConfirmAccount";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.message.message).toBe("No token")
    });

    it("can validate a token", async () => {
        const secondLocalVue = createLocalVue()
        wrapper = await shallowMount(ConfirmAccount, {
            mocks: {$route},
            secondLocalVue,
            router
        });
        expect(wrapper.vm.message).toStrictEqual({message: null});
    });

});
