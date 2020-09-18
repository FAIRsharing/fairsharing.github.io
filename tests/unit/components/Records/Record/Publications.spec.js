import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Publications from "@/components/Records/Record/Publications.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    publications: [
        {title: "Publication One"},
        {title: "Publication Two"}
    ]
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Publications.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Publications, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Publications");
        expect(wrapper.vm.getField('publications')[0].title).toMatch("Publication One");
        expect(wrapper.vm.getField('publications')[1].title).toMatch("Publication Two");
    });

    it("correctly handles dodgy pubmed and doi links", () => {
        expect(wrapper.vm.checkLinkValue("some text")).toBe(true);
        expect(wrapper.vm.checkLinkValue("MISSING")).toBe(false);
        expect(wrapper.vm.checkLinkValue("0")).toBe(false);
        expect(wrapper.vm.checkLinkValue(0)).toBe(false);
        expect(wrapper.vm.checkLinkValue(null)).toBe(false);
        expect(wrapper.vm.checkLinkValue(undefined)).toBe(false);
    });


});