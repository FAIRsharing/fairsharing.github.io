import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Support from "@/components/Records/Record/Support.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    metadata: {
        contacts: [
            {
                contact_name: "A Contact",
                contact_email: "contact@goatse.cx"
            },
        ]
    },
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Support.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Support, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Support");
        expect(wrapper.vm.getField('metadata')['contacts'][0].contact_name).toMatch("A Contact");
        expect(wrapper.vm.getField('metadata')['contacts'][0].contact_email).toMatch("contact@goatse.cx");
    });


});
