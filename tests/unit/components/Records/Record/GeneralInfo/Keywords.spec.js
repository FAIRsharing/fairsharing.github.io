import { createLocalVue,shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";

import Keywords from "@/components/Records/Record/GeneralInfo/Keywords.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);

let $route = {params: {id: "123"}};
const router = new VueRouter();
const $router = { push: jest.fn() };

let editor = {
    namespaced: true,
    state: {
        recordTooltips: {
            subjects: "subject tooltip.",
            domains: "domain tooltip.",
            taxonomies: "taxonomy tooltip",
            user_defined_tags: "user_defined tooltip"
        }
    }
}

Record.state.currentRecord["fairsharingRecord"] = {
    taxonomies: [
        {label: "Turdus turdus"},
    ],
    subjects: [
        {label: "Javascript Fun"},
    ],
    domains: [
        {label: "Deneb"},
    ],
    userDefinedTags:[{label:'a'}],
};
const $store = new Vuex.Store({
    modules: {
        record: Record,
        editor: editor
    }});

describe("Keywords.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Keywords, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("Keywords");
        expect(wrapper.vm.getField('taxonomies')[0].label).toMatch("Turdus turdus");
        expect(wrapper.vm.getField('subjects')[0].label).toMatch("Javascript Fun");
        expect(wrapper.vm.getField('domains')[0].label).toMatch("Deneb");
        expect(wrapper.vm.getField('userDefinedTags').length).toEqual(1);
    });

    it("returns to the search page when a chip is clicked", () => {
        wrapper.vm.returnToSearch('subjects', 'citizens');
        expect($router.push).toHaveBeenCalledWith({"name": "search", "query": { "subjects": "citizens" }});
    });

});
