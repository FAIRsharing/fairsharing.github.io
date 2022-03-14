import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditPublicProfile from "@/views/Users/EditPublicProfile"
import Vuetify from "vuetify"
import Vuex from "vuex";
const vuetify = new Vuetify();
const localVue = createLocalVue();
import userStore from "@/store/users";
import sinon from "sinon"
import Client from "@/lib/Client/RESTClient.js"
import VueScrollTo from "vue-scrollto";

localVue.use(Vuex);
localVue.use(VueScrollTo,{})
let $route = { params: {id: 123} };
let $router = {
    push: jest.fn()
};
userStore.state.user = function() {
    return {
        metadata: {
            preferences: {
                hide_email: true,
            },
            profile_type: "profile 1",
            role: 'user'
        },
        credentials: {
            username: "username",
            token: 123
        }
    }
};
userStore.state.currentPublicUser = {preferences:{}}
let $store = new Vuex.Store({
    modules: {
        users: userStore
    }
});
$router.go = jest.fn();

describe("EditPublicProfile.vue", function () {
    let wrapper, restStubProfile, restStubRole, restStubUser;

    beforeAll(() => {
        restStubProfile = sinon.stub(Client.prototype, "getProfileTypes");
        restStubRole = sinon.stub(Client.prototype, "getUserRoles");
        restStubUser = sinon.stub(Client.prototype, "getPublicUser");
        restStubProfile.returns([
              "profile 1",
              "profile 2"
        ]);
        restStubRole.returns([
                {
                    id: 1,
                    name: 'user'
                }
        ]);
        restStubUser.returns({
              id: 1,
              username: 'user',
              email: 'user@user.com'
        });
    });
    afterAll(() => {
        restStubRole.restore();
        restStubProfile.restore();
    });

    beforeEach( async () => {
        wrapper =  await shallowMount(EditPublicProfile, {
            vuetify,
            localVue,
            mocks:{$store,$route,$router}
        })
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditPublicProfile");
        expect(wrapper.vm.pageLoad).toBe(false);
    });

    it("can check if there is no preference in the received data", () => {
        delete $store.state.users.currentPublicUser.preferences
        const wrapper2 =  shallowMount(EditPublicProfile, {
            vuetify,
            localVue,
            mocks:{$store, $route}
        })
        expect(wrapper2.name()).toMatch("EditPublicProfile");
    });

    it("can check updatePublicProfile method", async () => {
        let updatePublicUser = jest.spyOn(wrapper.vm, "updatePublicUser");
        wrapper.vm.formData.role = 'user';
        await wrapper.vm.updatePublicProfile()
        expect(updatePublicUser).toHaveBeenCalled();
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.pageLoad).toBe(false);
    });

    it("can delete a user", async () => {
        await wrapper.vm.deleteAccount()
        expect(wrapper.vm.loading).toBe(false);
        expect($router.go).toHaveBeenCalled();
    });

    it("disables the email edit field for third party users", () => {
        expect(wrapper.vm.isDisabled('email')).toBe(false);
        $store.state.users.currentPublicUser.third_party = true;
        expect(wrapper.vm.isDisabled('email')).toBe(true);
    });

});
