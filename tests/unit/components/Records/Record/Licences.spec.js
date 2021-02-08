import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Licences from "@/components/Records/Record/Licences.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    licences: [
        {name: "Licence One"},
        {name: "Licence Two"}
    ],
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

// Name written as 'Licence' rather than 'License' to conform with API:
// https://oed.com/view/Entry/107943?rskey=cOk1xY&result=1&isAdvanced=false#eid
describe("Licences.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Licences, {
            localVue,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Licences");
        expect(wrapper.vm.getField('licences')[0].name).toMatch("Licence One");
        expect(wrapper.vm.getField('licences')[1].name).toMatch("Licence Two");
    });


});
