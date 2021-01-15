import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import SearchInput from "@/components/Records/Search/Input/SearchInput"
import searchFiltersStore from "@/store/searchFilters.js";
import uiControllerStore from "@/store/uiController.js";
import VueScrollStop from 'vue-scroll-stop';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollStop);
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
        uiController: uiControllerStore,
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

    it("sorts filterbuttons into the correct order", () => {
        $store.state.searchFilters.filters.push({filterName: 'grants', filterLabel: 'grantLabel', 'sortOrder': 2});
        $store.state.searchFilters.filters.push({filterName: 'domains', filterLabel: 'domainLabel', 'sortOrder': 1});
        $store.state.searchFilters.filters.push({filterName: 'subjects', filterLabel: 'subjectLabel', 'sortOrder': 0});
        expect($store.state.searchFilters.filters.length).toEqual(4);
        let sorted = wrapper.vm.getFilters.sort(wrapper.vm.compareLabels);
        expect(sorted[0]['filterName']).toEqual('subjects');
        expect(sorted[1]['filterName']).toEqual('domains');
        expect(sorted[2]['filterName']).toEqual('grants');
        expect(sorted[3]['filterName']).toEqual('filterNameTest');
    })

    it("can check scrollToBottom", () => {
        let testId = "scrollable-holder";
        let scrollableLeftPanel = document.createElement("div");
        scrollableLeftPanel.setAttribute("id", testId);
        document.body.appendChild(scrollableLeftPanel);
        wrapper.vm.scrollToBottom();
        expect(scrollableLeftPanel.scrollTop).toBe(scrollableLeftPanel.scrollHeight)
    })

});
