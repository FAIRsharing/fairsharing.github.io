import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import OutputGrid from "./SearchOutputGrid.vue";
import records from "../../store/records";
import Client from "../../components/GraphClient/GraphClient.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({
    modules: {
        records: records
    },
});

// MISSING AXIOS MOCK !!!

describe("SearchOutputGrid.vue", function(){
    let wrapper;
    let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeEach(() => {
        stub.withArgs(sinon.match.object).returns({
            searchFairsharingRecords: {
                records: [
                    1
                ]
            }
        });
        wrapper = shallowMount(OutputGrid, {
            mocks: {$store},
            localVue
        });
    });

    afterAll( () => {
        Client.prototype.executeQuery.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchOutputGrid");
    });

});

