import {createLocalVue, shallowMount} from "@vue/test-utils";
import UsersList from "@/views/Users/UsersList"
import Vuetify from "vuetify"
import Vuex from "vuex";
import usersStore from "@/store/users";
import sinon from "sinon";
import Client from "@/lib/Client/RESTClient";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore,
    },
});

describe("UsersList.vue", function () {
    let wrapper;
    let restStub;

    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: [{name: "Terazus"}]
    });

    beforeEach( () => {
        wrapper =  shallowMount(UsersList, {
            vuetify,
            localVue,
            mocks: {$store},
        })
    });

    afterEach(() => {
        wrapper.destroy();
    });

    afterAll(() => {
        restStub.restore();
    })

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("UsersList");
    });

});
