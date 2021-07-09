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
userStore.state.currentPublicUser = {preferences:{}}
let $store = new Vuex.Store({
    modules: {
        users: userStore
    }
});

describe("EditPublicProfile.vue", function () {
    let wrapper,restStub;

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

    beforeEach( () => {
        wrapper =  shallowMount(EditPublicProfile, {
            vuetify,
            localVue,
            mocks:{$store,$route}
        })
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditPublicProfile");
    });

    it("can check if there is no preference in the received data", () => {
        delete $store.state.users.currentPublicUser.preferences
        const wrapper2 =  shallowMount(EditPublicProfile, {
            vuetify,
            localVue,
            mocks:{$store,$route}
        })
        expect(wrapper2.name()).toMatch("EditPublicProfile");
    });

    it("can check updatePublicProfile method", async () => {
        await wrapper.vm.updatePublicProfile()
        expect(wrapper.vm.loading).toBe(false);
    });

    it("can check updatePublicProfile method", async () => {
        await wrapper.vm.deleteAccount()
        expect(wrapper.vm.loading).toBe(false);
    });

});
