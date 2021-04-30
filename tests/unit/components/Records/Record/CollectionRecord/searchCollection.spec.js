import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import searchCollection from "@/components/Records/Record/CollectionRecord/SearchCollection"
import Vuetify from "vuetify"
import VueScrollTo from "vue-scrollto";
import records from "@/store/recordSearch";
import record from "@/store/recordData";
import introspection from "@/store/introspector";
import uiController from "@/store/uiController";
import Client from "@/lib/GraphClient/GraphClient";
import sinon from "sinon";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo,{})
const vuetify = new Vuetify();

const $route = {
    name: "Standards",
    path: "standard",
    query: {
        fairsharingRegistry: "Standard",
    }
};
const $store = new Vuex.Store({
    modules: {
        record: record,
        records: records,
        introspection: introspection,
        uiController: uiController
    },
});


describe("SearchCollection.vue", function(){

    let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeAll(() => {
        stub.withArgs(sinon.match.object).returns({searchFairsharingRecords: {records: [1]}});
    });

    afterAll(() => {
        Client.prototype.executeQuery.restore();
    });

    beforeEach(async () => {
        wrapper = await shallowMount(searchCollection, {
            mocks: {$route, $store},
            localVue,
            vuetify
        });
    });

    let wrapper;

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchCollection");
    });

});
