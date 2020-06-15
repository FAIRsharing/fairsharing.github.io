import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editPublications from "@/components/Editor/EditPublications.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
// import RestClient from "../../../../src/components/Client/RESTClient.js"
import ExternalClient from "../../../../src/components/Client/ExternalClients.js"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        publications: [
            {
                name: "Hello",
                id: 1
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
//let restStub;
let fetchStub;

describe("EditLicences.vue", function() {
    let wrapper;

    beforeEach(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchLicences: []
        });
        wrapper = shallowMount(editPublications, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    afterEach( () => {
        graphStub.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditPublications");
    });

    it("can get a DOI and process related errors", async () => {
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({});
        wrapper.vm.search = 'amIaDoi?';
        fetchStub.restore();
    })

});
