import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import FilterButton from "@/components/Records/Search/Input/FilterButton.vue"
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


describe("FilterButton.vue", function () {
    let wrapper;
    let anotherWrapper;

    wrapper = shallowMount(FilterButton, {
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

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("FilterButton");
    });

    it("can check selectFilter method", () => {
        let selectedItem = {active: false, filterName: 'isMaintained', title: 'MAINTAINED', value: true};

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

    it('can check applyFilter function', () => {

        anotherWrapper = shallowMount(FilterButton, {
            localVue,
            vuetify,
            propsData: {
                item: {active: true, filterName: 'isMaintained', title: 'All'},
                isFirstItem: false,
                mdScreens: false,
                itemParentIndex: 0,
                multipleItems: false,
            },
            mocks: {$store, $router, $route}
        });
        anotherWrapper.vm.$route.query = {isMaintained: 'false'};
        let selectedItem = {active: false, filterName: 'isMaintained', title: 'Maintained', value: true};
        anotherWrapper.vm.applyFilters(selectedItem);

        anotherWrapper.vm.$route.query = {isMaintained: 'true'};
        selectedItem = {active: false, filterName: 'isMaintained', title: 'Maintained', value: true};
        anotherWrapper.vm.applyFilters(selectedItem);

        selectedItem = {active: false, filterName: 'isMaintained', title: 'All'};
        anotherWrapper.vm.applyFilters(selectedItem);

    })
});
