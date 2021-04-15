import { shallowMount, createLocalVue } from "@vue/test-utils"
import sinon from "sinon"
import ConfirmAccount from "@/views/Users/ConfirmAccount.vue"
import Client from "@/lib/Client/RESTClient.js"

const localVue = createLocalVue();

let $route = {
    path: "/users/confirmation",
    query: {}
};

describe('ConfirmAccount.vue', () => {
    let wrapper;
    let stub;

    beforeAll( () => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {
                success: true
            }
        });
    });
    afterAll(() => {
        stub.restore()
    });

    it("can instantiate without token", () => {
        wrapper = shallowMount(ConfirmAccount, {
            localVue,
            mocks: { $route },
        });
        const title = "ConfirmAccount";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.message).toStrictEqual({Confirmation_token: "missing"})
    });

    it("can validate a token", async () => {
        $route.query.confirmation_token = "imatoken";
        wrapper = await shallowMount(ConfirmAccount, {
            mocks: {$route},
            localVue
        });
        await wrapper.vm.validateToken();
        expect(wrapper.vm.error).toBe(false);
        expect(wrapper.vm.message).toBe("you can now login using your credentials.");
    });

    it("can properly raise errors from response", async () => {
        $route.query.confirmation_token = "imatoken";
        stub.restore();
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {
                success: false,
                field: "error 1"
            }
        });
        wrapper = await shallowMount(ConfirmAccount, {
            mocks: {$route},
            localVue
        });
        await wrapper.vm.validateToken();
        expect(wrapper.vm.error).toBe(true);
        expect(wrapper.vm.message).toStrictEqual({"field": "error 1", "success": false});
    });

});
