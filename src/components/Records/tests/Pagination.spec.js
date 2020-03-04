import Pagination from "../Pagination";
import {shallowMount} from "@vue/test-utils";

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
            }
        });
    });

    it('Sets the page parameter to one on creation when receiving no values or undefined', () => {
        $route.query.page = undefined;
        anotherWrapper = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            }
        });
        expect(anotherWrapper.vm.currentPage).toBe(1);
    });

    it('Sets the page parameter to the given input on creation', () => {
        $route.query ={page:"120"};
        anotherWrapper2 = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            }
        });
        expect(anotherWrapper2.vm.currentPage).toBe(120);
    });

    it('can react to changes in the URL query and/or name', () => {
        wrapper.vm.$route.name = "Search";
        wrapper.vm.$route.query =  {};
        expect(wrapper.vm.currentPage).toBe(1);
    });

    it('Has a paginate() method that sets the current page in the URL query', () => {
        $route.name="Standards";
        $route.query.page=12;

        wrapper.vm.currentPage = 2;
        wrapper.vm.$route.query.page = "3";
        wrapper.vm.paginate(3);
        expect(wrapper.vm.currentPage).toBe(3);
        wrapper.vm.paginate(3);
        expect(wrapper.vm.currentPage).toBe(3);
        expect(wrapper.vm.$route.name).toBe("Standards");
        expect(wrapper.vm.$route.query.page).toBe("3");
    });

    it('Has a first() method that always redirect to the first page', () => {

        wrapper.vm.currentPage = 10;
        wrapper.vm.$route.query.page = "1";

        wrapper.vm.$router.push = push;
        wrapper.vm.first();
        wrapper.vm.$route.query.page = "1";

        expect(wrapper.vm.currentPage).toBe(1);
        expect(wrapper.vm.$route.query.page).toBe("1");

        // call the first Function again and it is not working due to router.page number is already the same
        wrapper.vm.$router.push = push;
        wrapper.vm.first();
        expect($router.push).toHaveBeenCalledTimes(1);
    });

    it('Has a last() method that always redirect to the last page', () => {

        wrapper.vm.currentPage = wrapper.vm.totalPages;
        wrapper.vm.$route.query.page = wrapper.vm.totalPages;

        wrapper.vm.$router.push = push;
        wrapper.vm.last();
        wrapper.vm.$route.query.page = wrapper.vm.totalPages;

        expect(wrapper.vm.currentPage).toBe(wrapper.vm.totalPages);
        expect(wrapper.vm.$route.query.page).toBe(wrapper.vm.totalPages);

        // call the first Function again and it is not working due to router.page number is already the same
        wrapper.vm.$router.push = push;
        wrapper.vm.last();
        expect($router.push).toHaveBeenCalledTimes(1);


    });



});
