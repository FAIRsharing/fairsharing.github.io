import Pagination from "@/components/Records/Search/Header/Pagination";
import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";
import records from "@/store/recordSearch.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        records: records
    }
});

$store.state.records.currentPage = 1;

const vuetify = new Vuetify();
let $route = {
    name: "Standards",
    query: {
        page: 12,
        type: Number
    }
};

const push = jest.fn();
const $router = {
    push: jest.fn(),
};


describe("Pagination.vue", () => {

    it("can be instantiated", () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        expect(wrapper.name()).toMatch("Pagination");
    });

    it('Sets the page parameter to one on creation when receiving no values or undefined', () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        wrapper.vm.$route.name = "Search";
        wrapper.vm.$route.query = {};

        expect(wrapper.vm.currentPageLocal).toBe(1);
        expect(wrapper.vm.page).toBe(1);
    });

    it("can set the current page to a new value when route changes", () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        wrapper.vm.$route.query = {page: "2"};
        expect(wrapper.vm.currentPageLocal).toBe(2);
        expect(wrapper.vm.page).toBe(2);
    });

    it('can react to changes in the URL query and/or name', () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        wrapper.vm.$route.name = "Search";
        wrapper.vm.$route.query = {};
        expect(wrapper.vm.currentPageLocal).toBe(1);
    });

    it('Sets the page parameter to the given input on creation', () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        $route.query = {page: "120"};
        expect(wrapper.vm.currentPageLocal).toBe(120);
    });

    it('Has a paginate() method that sets the current page in the URL query', async () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        wrapper.vm.allowPaginate = true;
        wrapper.vm.$router.push = push;
        await wrapper.vm.paginate(2);
        expect(push).toHaveBeenCalledWith({"name": "Search", "query": {"page": 2}});
        expect(wrapper.vm.$route.name).toBe("Search");
    });

    it('can define whether it is testing or development environment', () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        wrapper.vm.disableThrottle(false);
        expect(wrapper.vm.allowPaginate).toBe(false);
        wrapper.vm.disableThrottle(true);
        expect(wrapper.vm.allowPaginate).toBe(true);
    });

    it('can check whether paginate works if it is not allowed', () => {
        const wrapper = shallowMount(Pagination, {
            mocks: {$route, $router, $store},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify,
            localVue
        });
        wrapper.vm.allowPaginate = false;
        wrapper.vm.paginate(2);
        expect(wrapper.vm.currentPageLocal).not.toBe(2);
    });

});
