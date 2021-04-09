import {shallowMount} from "@vue/test-utils";
import StringSearch from "@/components/Records/Search/Input/StringSearch"
import Vuetify from "vuetify"

const $router = {
    push: jest.fn()
};
let $route = { path: "/", query:{} };

let vuetify = new Vuetify();

describe("StringSearch.vue", () => {
    let wrapper = shallowMount(StringSearch, {
        mocks: {$router,$route},
        vuetify
    });
    let wrapper2 = shallowMount(StringSearch, {
        mocks: {$router,$route},
        vuetify
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

    it("can pass the search term to the correct route for homePage searchBox function", () => {
        wrapper.vm.registries = [{label: 'standards', value: 'standard'}, {label: 'databases', value: 'database'}
            , {label: 'policies', value: 'policy'}, {label: 'collections', value: 'collection'}
        ];
        wrapper.vm.selectedRegistries = [{label: 'standards', value: 'standard'}, {
            label: 'databases',
            value: 'database'
        }
            , {label: 'policies', value: 'policy'}, {label: 'collections', value: 'collection'}
        ];

        wrapper.vm.searchTerm = '';
        wrapper.vm.searchStringHomePage();
        expect($router.push).toHaveBeenCalledTimes(1);

        wrapper.vm.searchTerm = 'testStringHome';
        wrapper.vm.searchStringHomePage();
        expect($router.push).toHaveBeenCalledTimes(2);
        expect($router.push).toHaveBeenCalledWith({
            path: "/search",
            query: {q: "testStringHome"}
        });

        wrapper2.vm.searchTerm = 'testStringHome';
        wrapper2.vm.selectedRegistries = [{label: 'standards', value: 'standard'}];
        wrapper2.vm.searchStringHomePage();
        expect($router.push).toHaveBeenCalledTimes(3);
        expect($router.push).toHaveBeenCalledWith({
            path: "/search",
            query: {q: "testStringHome", fairsharingRegistry: "standard", searchAnd: false}
        });
    });

});
