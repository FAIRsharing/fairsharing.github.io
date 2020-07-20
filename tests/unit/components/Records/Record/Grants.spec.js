import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Grants from "@/components/Records/Record/Grants.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    grants: [
        {name: "Grant One"},
        {name: "Grant Two"}
    ]
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Grants.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Grants, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Grants");
        expect(wrapper.vm.getField('grants')[0].name).toMatch("Grant One");
        expect(wrapper.vm.getField('grants')[1].name).toMatch("Grant Two");
    });


});