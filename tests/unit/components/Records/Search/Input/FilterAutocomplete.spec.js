import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify";
import ExpansionPanel from "@/components/Records/Search/Input/FilterAutocomplete.vue"
import recordsStore from "@/store/records.js";
import getGrants from '../../../../../fixtures/getGrants.json'
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
    }
});

let $route = {
    name: "standards",
    query: {
        grants: '123'
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
            filter: {filterName: 'grants'}
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

        wrapper.vm.selectedValues = ['agrants'];
        wrapper.vm.applyFilters();

        wrapper.vm.$route.query = {grants: 'agrants'};
        wrapper.vm.selectedValues = [];
        wrapper.vm.applyFilters();

        wrapper.vm.$route.query = {grants: 'agrants,newGrants'};
        wrapper.vm.selectedValues = ['cGrants', 'agrants'];
        wrapper.vm.applyFilters();

        wrapper.vm.$route.query = {grants: 'agrants,newGrants'};
        wrapper.vm.selectedValues = ['agrants', 'newGrants'];
        wrapper.vm.applyFilters();

    });


});
