import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import SearchInput from "@/components/Records/Search/Input/SearchInput"
import searchFiltersStore from "@/store/searchFilters.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let $route = {
    name: "search",
    query: {}
};

const $router = {
    push: jest.fn(),
};

const $store = new Vuex.Store({
    modules: {
        searchFilters: searchFiltersStore,
    }
});

describe("FilterPanel.vue", function () {
    let wrapper;

    wrapper = shallowMount(SearchInput, {
        localVue,
        vuetify,
        mocks: {$store, $router, $route}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchInput");
    });

    it("can check setup function", () => {
        $store.state.searchFilters.filters.push({filterName: 'filterNameTest', filterLabel: 'filterLabelTest'});
        wrapper.vm.setPanel();
        wrapper.vm.createIndexForFilters();
    });

    it("can check resetPanel", () => {
        wrapper.vm.resetPanel();
        expect(wrapper.vm.panel).toStrictEqual([])
    })
});
