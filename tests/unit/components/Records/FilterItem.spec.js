import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import FilterItem from "@/components/Records/FilterItem.vue"
import routeDataStore from "@/store/routeData.js";
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
        routeData: routeDataStore,
        searchFilters: searchFiltersStore,
    }
});


describe("FilterItem.vue", function () {
    let wrapper;

    wrapper = shallowMount(FilterItem, {
        localVue,
        vuetify,
        propsData: {
            item: {active: false, filterName: 'isMaintained', title: 'Maintained', value: true},
            isFirstItem: false,
            mdScreens: false,
            itemParentIndex: 0,
            multipleItems: false,
        },
        mocks: {$store, $router, $route}
    });

    it("can check selectFilter method", () => {
        const selectedItem ={active: false, filterName: 'isMaintained', title: 'MAINTAINED', value: true};

            $store.state.searchFilters.filterButtons =
            [
                [
                    {active: true, filterName: 'isMaintained', title: 'All'},
                    {active: false, filterName: 'isMaintained', title: 'MAINTAINED', value: true},
                    {active: false, filterName: 'isMaintained', title: 'NOT MAINTAINED', value: false}
                ],
                [
                    {active: true, filterName: 'isApproved', title: 'All'},
                    {active: false, filterName: 'isApproved', title: 'APPROVED', value: true},
                    {active: false, filterName: 'isApproved', title: 'NOT APPROVED', value: false}
                ]
            ];


        const expectedData =
            [
                {active: false, filterName: 'isMaintained', title: 'All'},
                {active: true, filterName: 'isMaintained', title: 'MAINTAINED', value: true},
                {active: false, filterName: 'isMaintained', title: 'NOT MAINTAINED', value: false}
            ]

        wrapper.vm.selectFilter(selectedItem);

        expect($store.state.searchFilters.filterButtons[wrapper.vm.itemParentIndex]).toStrictEqual(expectedData);
    });
});
