import {shallowMount} from "@vue/test-utils";
import StringSearch from "@/components/Records/Search/Input/StringSearch"
import Vuetify from "vuetify"

const $router = {
    push: jest.fn()
};

let vuetify = new Vuetify();

describe("StringSearch.vue", () => {
    let wrapper = shallowMount(StringSearch, {
        mocks: {$router},
        vuetify,
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
            path: "/search",
            query: {q: "testString"}
        })
    });

    it("can check responsiveHeight", () => {
        vuetify.framework.breakpoint.mdAndDown = true;
        expect(wrapper.vm.responsiveHeight).toStrictEqual({
            'style-sm-xs': true,
            'style-md': true,
            'style-lg': false,
            'style-xl': false,
        });
    });

    it("can check responsiveHeightTextBox", () => {
        vuetify.framework.breakpoint.xlOnly = true;
        expect(wrapper.vm.responsiveHeightTextBox).toBe(50);
    });

});
