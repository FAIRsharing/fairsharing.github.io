import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editLicences from "@/components/Editor/EditLicences.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        licences: [
            {
                name: "name"
            },
            {
                name: "name1"
            }
        ]

    }
};
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        users: userStore,
        record: recordStore
    }
});
let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };

let graphStub;

describe("EditLicences.vue", function() {
    let wrapper;

    beforeEach(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchLicences: []
        });
        wrapper = shallowMount(editLicences, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    afterEach( () => {
        graphStub.restore()
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditLicences");
    });

    it("can remove an item", () => {
        wrapper.vm.removeItem({
            name: "name"
        });
    });

});
