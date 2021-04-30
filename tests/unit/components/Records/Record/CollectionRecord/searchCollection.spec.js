import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import searchCollection from "@/components/Records/Record/CollectionRecord/SearchCollection"
import Vuetify from "vuetify"
import records from "@/store/recordSearch";
import record from "@/store/recordData";
import introspection from "@/store/introspector";
import uiController from "@/store/uiController";
import Client from "@/lib/GraphClient/GraphClient";
// import sinon from "sinon";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $route = {
    name: "Record",
    path: "/3449",
    query: {}
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

    let wrapper;
    // let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeAll(() => {
        // stub.withArgs(sinon.match.object).returns({searchFairsharingRecords: {records: [1]}});
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


    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchCollection");
    });


    it("can a", () => {
        wrapper.vm.$route.query = {fairsharingRegistry: "Collection"};
        //expect
        wrapper.vm.$route.query = {fairsharingRegistry: ''};
        //expect
    });



});
