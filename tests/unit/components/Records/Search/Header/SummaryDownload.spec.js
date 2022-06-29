import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import SummaryDownload from "@/components/Records/Search/Header/SummaryDownload.vue"
import RestClient from "@/lib/Client/RESTClient.js";
import recordsStore from "@/store/recordSearch.js";

const sinon = require("sinon");
const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let restStub;

const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
    },
    // TODO: Despite this, tests persist in returning:
    // TypeError: this.$store.getters.introspection/buildQueryParameters is not a function
    // ...if wrapper.vm.commenceDownload() is run.
    // Nevertheless, all appears to be fine when the same code is called in Records.spec.js.
    getters: {
        "introspection/buildQueryParameters": function(data) {
            return data;
        }
    }
});

const $route = {
    name: "Standards",
    path: "standard",
    query: {
        fairsharingRegistry: "Standard",
        grants: "string",
        publications: null,
        isRecommended: "false",
        registry: "[abc,def]",
        licences: 123
    }
};


describe("SummaryDownload.vue", function () {
    let wrapper;

    beforeAll(() => {
        window.scrollTo = jest.fn();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: ['this', 'that']
        })
    });
    afterAll(() => {
        restStub.restore();
    });

    wrapper = shallowMount(SummaryDownload, {
        localVue,
        vuetify,
        mocks: {$store, $route}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SummaryDownload");
    });

    it('can calculate the current path', () => {
        expect(wrapper.vm.currentPath[0]).toBe("Standard");
    });


});
