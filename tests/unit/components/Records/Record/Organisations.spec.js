import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Organisations from "@/components/Records/Record/Organisations.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    organisations: [
        {name: "Organisation One"},
        {name: "Organisation Two"}
    ]
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Organisations.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Organisations, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Organisations");
        expect(wrapper.vm.getField('organisations')[0].name).toMatch("Organisation One");
        expect(wrapper.vm.getField('organisations')[1].name).toMatch("Organisation Two");
    });


});