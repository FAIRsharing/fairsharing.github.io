import { createLocalVue, shallowMount } from "@vue/test-utils";
import Error from "@/views/Errors/403.vue";

const localVue = createLocalVue();

let $route = {
    path: "/error/403",
    query: {
        source: '"/#/random/test"'
    }
};

describe("403 unauthorized page", () => {
    let wrapper;

    it("can mount", () => {
        wrapper = shallowMount(Error, {
            mocks: {$route},
            localVue
        });
        expect(wrapper.name()).toBe("Error403");
    });

    it('can get the source of the error', () => {
        wrapper = shallowMount(Error, {
            mocks: {$route},
            localVue
        });
        expect(wrapper.vm.getSource).toBe('localhost/#/random/test')
    });

});
