import Pagination from "@/components/Records/Search/Header/Pagination";
import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"

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
    // Set up the wrapper
    let wrapper;
    let anotherWrapper;
    let anotherWrapper2;
    beforeEach(() => {
        wrapper = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify
        });
    });

    it('Sets the page parameter to one on creation when receiving no values or undefined', () => {
        $route.query.page = undefined;
        anotherWrapper = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify
        });
        expect(anotherWrapper.vm.currentPage).toBe(1);
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Pagination");
    });

    it('can react to changes in the URL query and/or name', () => {
        wrapper.vm.$route.name = "Search";
        wrapper.vm.$route.query = {};
        expect(wrapper.vm.currentPage).toBe(1);
    });

    it('Sets the page parameter to the given input on creation', () => {
        $route.query = {page: "120"};
        anotherWrapper2 = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            },
            vuetify
        });
        expect(anotherWrapper2.vm.currentPage).toBe(120);
    });

    it('Has a paginate() method that sets the current page in the URL query', async () => {
        wrapper.vm.allowPaginate = true;
        wrapper.vm.$router.push = push;
        await wrapper.vm.paginate(2);
        expect(push).toHaveBeenCalledWith({"name": "Search", "query": {"page": 2}});
        expect(wrapper.vm.$route.name).toBe("Search");
    });

    it('can define whether it is testing or development environment',()=>{
        wrapper.vm.disableThrottle(false);
        expect(wrapper.vm.allowPaginate).toBe(false);
        wrapper.vm.disableThrottle(true);
        expect(wrapper.vm.allowPaginate).toBe(true);
    });

    it('can check whether paginate works if it is not allowed',()=>{
        wrapper.vm.allowPaginate=false;
        wrapper.vm.paginate(2);
        expect(wrapper.vm.currentPage).not.toBe(2);
    });



});
