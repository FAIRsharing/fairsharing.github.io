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
        $store.state.searchFilters.filterButtons = [
            {
                data:
                    [
                        {active: true, filterName: 'isMaintained', title: 'All'},
                        {active: false, filterName: 'isMaintained', title: 'MAINTAINED', value: true},
                    ],
                curator_only: true
            }
        ];
        wrapper.vm.selectFilter(selectedItem);
        expect($router.push).toHaveBeenCalledTimes(1);
        expect($router.push).toHaveBeenCalledWith({"name": "search", "query": {"isMaintained": "true", page: 1}});
        expect($store.state.searchFilters.filterButtons[0].data[1].active).toBe(true);
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
                doubleItems: true,
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

        anotherWrapper.vm.$route.query = {active: false, filterName: 'isMaintained', title: 'All'};
        selectedItem = {active: false, filterName: 'isMaintained', title: 'All'};
        anotherWrapper.vm.applyFilters(selectedItem);
    });

    it('sets button labels correctly via the checkCurrentParameters function', () => {
        wrapper.vm.checkCurrentParameters('all', null, undefined);
        expect(wrapper.vm.itemModified.active).toEqual(true);
        wrapper.vm.checkCurrentParameters('ismaintained', "true", undefined);
        expect(wrapper.vm.itemModified.active).toEqual(false);
        wrapper.vm.checkCurrentParameters('ismaintained', "true", true);
        expect(wrapper.vm.itemModified.active).toEqual(true);
    });

});
