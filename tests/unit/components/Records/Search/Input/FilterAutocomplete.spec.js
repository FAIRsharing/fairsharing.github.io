import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify";
import ExpansionPanel from "@/components/Records/Search/Input/FilterAutocomplete.vue"
import recordsStore from "@/store/recordSearch.js";
import uiController from "@/store/uiController.js";
import getGrants from '../../../../../fixtures/getGrants.json'
import Vuex from "vuex";

jest.useFakeTimers();
const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
        uiController: uiController,
    }
});

let $route = {
    name: "standards",
    query: {
        grants: '123',
        page:'1'
    }
};

const $router = {
    push: jest.fn()
};

describe("FilterAutocomplete.vue", function () {

    // complex fake data needs to be moved to fixtures/
    let wrapper;
    let fake_GetFilter_Grants_Response = getGrants;
    wrapper = shallowMount(ExpansionPanel, {
        localVue,
        vuetify,
        mocks: {$store, $route, $router},
        propsData: {
            filter: {
                filterName: 'grants',
            },
            lastItem: true
        }
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("FilterAutocomplete");
    });

    it("check getValues computed", () => {
        $store.state.records.facets.push(fake_GetFilter_Grants_Response);
        const filterNameLocal = 'grants';
        wrapper.vm.getFilter(filterNameLocal);
    });

    it("can check cleanString returns properly", () => {
        let term = 'hosein_mirian';
        let returnedValue;

        returnedValue = wrapper.vm.cleanString(term);
        expect(returnedValue).toBe('hosein mirian');

        term = 'hoseinmirian';
        returnedValue = wrapper.vm.cleanString(term);
        expect(returnedValue).toBe('hoseinmirian');
    });

    it("can reset searchBox ", () => {
        let selectedItem = {filterSelected: {grants: 'a'}};
        wrapper.vm.reset(selectedItem);
        expect(selectedItem.filterSelected).toStrictEqual({});
    });

    it("can check applyFilters", () => {
        wrapper.vm.$route.name = "search";
        wrapper.vm.$route.query = {};
        wrapper.vm.applyFilters();
        expect($router.push).toHaveBeenCalledTimes(0);

        wrapper.vm.selectedValues = ['value1'];
        wrapper.vm.applyFilters();
        expect($router.push).toHaveBeenCalledTimes(1);
        expect($router.push).toHaveBeenCalledWith({
            name: "search",
            query: {grants: "value1", page:1}
        });

        wrapper.vm.selectedValues = ["value 2", "value 3"];
        wrapper.vm.applyFilters();
        expect($router.push).toHaveBeenCalledTimes(2);
        expect($router.push).toHaveBeenCalledWith({
            name: "search",
            query: {grants: "value%202,value%203",page:1}
        });

        wrapper.vm.$route.query = {grants: 'value1'};
        wrapper.vm.selectedValues = [];
        wrapper.vm.applyFilters();
        expect($router.push).toHaveBeenCalledTimes(3);
        expect($router.push).toHaveBeenCalledWith({
            name: "search",
            query: {page:1}
        });

        wrapper.vm.$route.query = {grants: 'value1,value%202'};
        wrapper.vm.selectedValues = ['val3', 'value1'];
        wrapper.vm.applyFilters();
        expect($router.push).toHaveBeenCalledTimes(4);
        expect($router.push).toHaveBeenCalledWith({
            name: "search",
            query: {grants: 'value1,value%202,val3', page:1}
        });

        wrapper.vm.$route.query = {grants: 'agrants,newGrants'};
        wrapper.vm.selectedValues = ['agrants', 'newGrants'];
        wrapper.vm.applyFilters();
        expect($router.push).toHaveBeenCalledTimes(4);

    });

});
