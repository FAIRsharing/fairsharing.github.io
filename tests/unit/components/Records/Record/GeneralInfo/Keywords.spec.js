import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Keywords from "@/components/Records/Record/GeneralInfo/Keywords.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
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
        record:Record
    }});

describe("Keywords.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Keywords, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Keywords");
        expect(wrapper.vm.getField('taxonomies')[0].label).toMatch("Turdus turdus");
        expect(wrapper.vm.getField('subjects')[0].label).toMatch("Javascript Fun");
        expect(wrapper.vm.getField('domains')[0].label).toMatch("Deneb");
        expect(wrapper.vm.getField('userDefinedTags').length).toEqual(1);
    });


});
