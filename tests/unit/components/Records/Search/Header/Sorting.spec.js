import {shallowMount} from "@vue/test-utils";

import Sorting from "@/components/Records/Search/Header/Sorting";

const $router = {
    push: jest.fn(),
};

describe("Sorting.vue", () => {
    // Set up the wrapper
    let wrapper;
    beforeEach(() => {

    });

    it('can be mounted', () => {
        let $route = {
            name: "Standards",
            query: {
                orderBy: 'name,asc',
            }
        };
        wrapper = shallowMount(Sorting, {
            mocks: {$route, $router},
        });
        expect(wrapper.vm.$options.name).toBe("Sorting");
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("Sorting");
    });

    it('can check applySortQuery', async () => {
        let $route = {
            name: "Standards",
            query: {
                orderBy: 'name,asc',
            }
        };
        wrapper = shallowMount(Sorting, {
            mocks: {$route, $router},
        });
        await wrapper.vm.applySortQuery('name', 'desc');
        expect($router.push).toHaveBeenCalledTimes(1);
        await wrapper.vm.applySortQuery('name', 'asc');
        expect($router.push).toHaveBeenCalledTimes(1);

    });

    it('can set default orderBy', async () => {
        const $route = {
            name: "Standards",
            query: {}
        };
        let anotherWrapper = shallowMount(Sorting, {
            mocks: {$route, $router}
        });
        expect(anotherWrapper.vm.$options.name).toBe("Sorting");
        expect(anotherWrapper.vm['activeFilter']).toBe("_score,asc")
    })

});
