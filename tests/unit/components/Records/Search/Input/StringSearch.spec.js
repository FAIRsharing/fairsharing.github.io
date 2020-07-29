import { shallowMount } from "@vue/test-utils";
import StringSearch from "@/components/Records/Search/Input/StringSearch"

const $router = {
    push: jest.fn()
};

describe("StringSearch.vue", () => {
    let wrapper = shallowMount(StringSearch, {
        mocks: {$router}
    });
    it("can mount", () => {
        expect(wrapper.name()).toBe('StringSearch')
    });

    it("can pass the search term to the correct route", () => {
        wrapper.vm.searchString();
        expect($router.push).toHaveBeenCalledTimes(0);
        wrapper.vm.searchTerm = 'testString';
        wrapper.vm.searchString();
        expect($router.push).toHaveBeenCalledTimes(1);
        expect($router.push).toHaveBeenCalledWith({
            path: "search",
            query: {q: "testString"}
        })
    })
});
