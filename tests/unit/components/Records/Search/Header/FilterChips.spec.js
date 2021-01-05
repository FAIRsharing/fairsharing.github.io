import {shallowMount, createLocalVue} from "@vue/test-utils";
import FilterChips from "@/components/Records/Search/Header/FilterChips.vue"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const $route = {
    path: "/search",
    name: "search",
    query: {
        "grants": "ABCDEF",
        "publications": "pub1,pub2,pub3",
        "page": 1
    }
};

const push = jest.fn();
const $router = {
    push: jest.fn(),
};

describe("FilterChips.vue", () => {

    let wrapper;

    beforeEach(async () => {
        wrapper = shallowMount(FilterChips, {
            mocks: {$route, $router},
            localVue
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("FilterChips");
    });

    it("can remove a parameter value", async () => {
        wrapper.vm.$router.push = push;
        await wrapper.vm.removeParam("publications", "pub2");
        expect($router.push).toHaveBeenCalledTimes(1);
        let query = wrapper.vm.buildNewQuery("grants", "ABCDEF");
        expect(query).toStrictEqual({page: 1, publications: 'pub1,pub2,pub3'});
        query = wrapper.vm.buildNewQuery("publications", "pub4");
        expect(query).toStrictEqual({page: 1, grants: 'ABCDEF', publications: 'pub1,pub2,pub3'});
        await wrapper.vm.removeParam("publications", "pub3");
        expect($router.push).toHaveBeenCalledTimes(1);
        wrapper.vm.$route.query= {object:{}}
        expect(wrapper.vm.getChips).toStrictEqual([{"paramName": "object", "paramVal": {}}]);
    });

    it("can remove all parameters value", async () => {
        await wrapper.vm.removeAllParams();
        expect($router.push).toHaveBeenCalledTimes(2);
    });

});
