import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardStack.vue"
import getRecord from '../../../../../fixtures/getRecord.json'
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(VueRouter);
const vuetify = new Vuetify();

describe("RecordsCardStack.vue", function () {
    let wrapper;
    let record = getRecord;

    wrapper = shallowMount(RecordsCardStack, {
        localVue,
        vuetify,
        propsData: {
            record: record
        }
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("RecordsCardStack");
    });
    
    it("can check getButtonLabel function in CardStack", () => {
        let returnedValue = wrapper.vm.getButtonLabel('taxonomies');
        expect(returnedValue).toBe('species');
        returnedValue = wrapper.vm.getButtonLabel('userDefinedTags');
        expect(returnedValue).toBe('tags');
    });

    it("can generate correct link depending on doi presence", () => {
        expect(wrapper.vm.getRecordLink(wrapper.vm.record)).toEqual(wrapper.vm.record.id);
        let doi = 'FAIRsharing.wibble';
        wrapper.vm.record.doi = doi;
        expect(wrapper.vm.getRecordLink(wrapper.vm.record)).toEqual(doi);
    });

});
