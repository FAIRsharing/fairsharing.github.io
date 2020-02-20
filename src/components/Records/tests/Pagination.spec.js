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

    it('Testing created() to see if it returns 1 instead of received undefined page value', () => {
        $route.query.page = undefined;
        anotherWrapper = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            }
        });
        expect(anotherWrapper.vm.currentQuery.page).toBe(1);
    });

    it('testing created() to see if converts received page string value to number', () => {
        $route.query ={page:"120"};
        anotherWrapper2 = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            }
        });
        expect(anotherWrapper2.vm.currentQuery.page).toBe(120);
    });


    it('Can check whether Router name changes correctly', () => {
        wrapper.vm.$route.name = "Policies";
        expect(wrapper.vm.$route.name).toBe("Policies");

    });

    it('Can check if query is empty, it returns page 1 and the other one checks if query not empty and contain page value', () => {
        wrapper.vm.$route.name = "Search";
        wrapper.vm.$route.query =  {};
        expect(wrapper.vm.currentQuery.page).toBe(1);
    });

    it('Can check paginate function', () => {
        $route.name="Standards";
        $route.query.page=12;

        wrapper.vm.currentQuery.page = 2;
        wrapper.vm.$route.query.page = "3";
        wrapper.vm.paginate(3);
        expect(wrapper.vm.currentQuery.page).toBe(3);
        wrapper.vm.paginate(3);
        expect(wrapper.vm.currentQuery.page).toBe(3);
        expect(wrapper.vm.$route.name).toBe("Standards");
        expect(wrapper.vm.$route.query.page).toBe("3");
    });

    it('Can check First function', () => {

        wrapper.vm.currentQuery.page = 10;
        wrapper.vm.$route.query.page = "1";

        wrapper.vm.$router.push = push;
        wrapper.vm.First();
        wrapper.vm.$route.query.page = "1";

        expect(wrapper.vm.currentQuery.page).toBe(1);
        expect(wrapper.vm.$route.query.page).toBe("1");

        // call the First Function again and it is not working due to router.page number is already the same
        wrapper.vm.$router.push = push;
        wrapper.vm.First();
        expect($router.push).toHaveBeenCalledTimes(1);
    });

    it('Can check Last function', () => {

        wrapper.vm.currentQuery.page = wrapper.vm.totalPages;
        wrapper.vm.$route.query.page = wrapper.vm.totalPages;

        wrapper.vm.$router.push = push;
        wrapper.vm.Last();
        wrapper.vm.$route.query.page = wrapper.vm.totalPages;

        expect(wrapper.vm.currentQuery.page).toBe(wrapper.vm.totalPages);
        expect(wrapper.vm.$route.query.page).toBe(wrapper.vm.totalPages);

        // call the First Function again and it is not working due to router.page number is already the same
        wrapper.vm.$router.push = push;
        wrapper.vm.Last();
        expect($router.push).toHaveBeenCalledTimes(1);


    });



});
