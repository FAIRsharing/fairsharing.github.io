import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import sinon from "sinon"
import Client from "@/lib/Client/RESTClient.js"
import EditProfile from "@/views/Users/EditProfile.vue"
import userStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(Vuex);
userStore.state.user = function() {
    return {
        metadata: {
            preferences: {
                hide_email: true,
            },
            profile_type: "profile 1"
        },
        credentials: {
            username: "username"
        }
    }
};

let $router = {
    push: jest.fn()
};

let $store = new Vuex.Store({
    modules: {
        users: userStore
    }
});


describe("UserProfileMenu.vue", () => {

    let wrapper,
        restStub;

    beforeAll(() => {
        restStub = sinon.stub(Client.prototype, "executeQuery");
        restStub.returns({
            data: [
                "profile 1",
                "profile 2"
            ]
        })
    });
    afterAll(() => {
        restStub.restore();
    });

    beforeEach(async() => {
        wrapper = await shallowMount(EditProfile, {
            localVue,
            mocks: {$store, $router}
        });
    });

    it("can be instantiated", () => {
        const title = "EditProfile";
        expect(wrapper.name()).toMatch(title);
    });

    it('can post the new user', async () => {
        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {
                modification: "failure"
            }
        });
        await wrapper.vm.updateProfile();
        expect($router.push).toHaveBeenCalledWith( {"path": "/accounts/profile"});
        expect(wrapper.vm.messages().getUser.message).toBe("Your profile was updated successfully.");

        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({data: {error:
            {response: {data: {errors: {
                field: 'test', message: 'error'
            }}}}
        }});
        await wrapper.vm.updateProfile();
        expect(wrapper.vm.messages().updateProfile).toStrictEqual({
            message: { field: 'test', message: 'error' },
            error: true
        });

        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery");
        restStub.returns({
            data: [
                "profile 1",
                "profile 2"
            ]
        });
    });

    it("can process errors", async () => {
        userStore.state.user = function() {return {metadata: {}}};
        $store = new Vuex.Store({modules: {users: userStore}});
        let anotherWrapper = await shallowMount(EditProfile, {
            localVue,
            mocks: {$store, $router}
        });
        expect(anotherWrapper.vm.formData).toBe(null);
    });
});
