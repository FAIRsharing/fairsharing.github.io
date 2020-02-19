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

    beforeEach(() => {
        wrapper = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            }
        });
    });

    it('testing created() branches', () => {
        expect(wrapper.vm.currentQuery.page).toBe(12);

        $route.query.page = undefined;
        let anotherWrapper = shallowMount(Pagination, {
            mocks: {$route, $router},
            propsData: {
                totalPages: 10,
                default: 0
            }
        });
        expect(anotherWrapper.vm.currentQuery.page).toBe(1);
    });

    it('watcher 1', () => {
        wrapper.vm.$route.name = "Policies";
        expect(wrapper.vm.$route.name).toBe("Policies");

    });
    it('watcher 2', () => {
        wrapper.vm.$route.name = "Search";
        wrapper.vm.$route.query =  {};
        expect(wrapper.vm.currentQuery.page).toBe(1);
        wrapper.vm.$route.query =  {page: 123};
        expect(wrapper.vm.currentQuery.page).toBe(1);
    });
    it('checking paginate function', () => {
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

    it('checking First function', () => {

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

    it('checking Last function', () => {

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
