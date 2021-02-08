import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Maintainers from "@/components/Records/Record/Maintainers.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    maintainers: [
        {
            contact_name: "Maintainer One",
            id: 100
        },
    ],
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[]
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Maintainers.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Maintainers, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Maintainers");
        expect(wrapper.vm.getField('maintainers')[0].contact_name).toMatch("Maintainer One");
        expect(wrapper.vm.getField('maintainers')[0].id).toEqual(100);
    });


});
