import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import sinon from "sinon"
import Client from "@/components/Client/RESTClient.js"
import EditProfile from "@/views/Users/EditProfile.vue"
import userStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(Vuex);

/*
userStore.state.user = {
    userLoggedIn: false
};*/

const $store = new Vuex.Store({
    modules: {
        users: userStore
    }
});

describe("UserProfileMenu.vue", () => {

    let wrapper;
    let restStub;

    beforeAll(() => {
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {
                user: {
                    error: true,
                    message: "Success !"
                }
            }
        });
    });
    afterAll(() => {
        restStub.restore();
    });

    beforeEach(async() => {
        wrapper = await shallowMount(EditProfile, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        const title = "EditProfile";
        expect(wrapper.name()).toMatch(title);
    });

    it('can post the new user', async () => {
        await wrapper.vm.updateProfile();
        expect(wrapper.vm.message.message).toBe("Success !");
        expect(wrapper.vm.error).toBe(null);
    });

    it ('can raise errors correctly', async () => {
        //restStub.restore();
        restStub.withArgs(sinon.match.any).returns({
            data: {
                error: {
                    message: "Error !"
                },
            }
        });
        await wrapper.vm.updateProfile();
        expect(wrapper.vm.message.message).toBe("Error !");
        expect(wrapper.vm.error).toBe(true);
    })

});
