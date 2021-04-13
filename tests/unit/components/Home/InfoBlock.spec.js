import {createLocalVue, RouterLinkStub, shallowMount} from "@vue/test-utils";
import InfoBlock from "@/components/Home/InfoBlock"
import Vuetify from "vuetify";
import icons from "@/plugins/icons";
const vuetify = new Vuetify({'icons':icons});
const localVue = new createLocalVue()
import Vuex from "vuex";
import searchFiltersStore from "@/store/searchFilters.js";

localVue.use(vuetify);
localVue.use(Vuex);

const $store = new Vuex.Store({
    modules: {
        searchFilters: searchFiltersStore,
    }
});

searchFiltersStore.state.filtersStatistic = {
    fairsharing_registry: {
        buckets: [{key: 'standard', doc_count: 5}, {key: 'database', doc_count: 10}, {key: 'policy', doc_count: 15}]
    },
    record_type: {
        buckets: [
            {key: 'terminology_artefact', doc_count: 5}, {key: 'model_and_format', doc_count: 10},
            {key: 'reporting_guideline', doc_count: 15}, {key: 'identifier_schema', doc_count: 15},
            {key: 'funder', doc_count: 15}, {key: 'journal', doc_count: 15}, {key: 'society', doc_count: 15}
        ]
    },
    subjects: {
        buckets: [
            {key: 'natural science', doc_count: 5}, {key: 'engineering science', doc_count: 10},
            {key: 'humanities', doc_count: 15}, {key: 'social science', doc_count: 15},
        ]
    }
}

describe("BlockInfo.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(InfoBlock, {
            vuetify,
            mocks:{$store},
            stubs: {
                RouterLink: RouterLinkStub
            }
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("InfoBlock");
    });

});
