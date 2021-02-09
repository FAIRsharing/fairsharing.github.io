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

    it("can generate correct link depending on doi presence", () => {
        expect(wrapper.vm.getRecordLink(wrapper.vm.record)).toEqual(wrapper.vm.record.id);
        let doi = 'FAIRsharing.wibble';
        wrapper.vm.record.doi = doi;
        expect(wrapper.vm.getRecordLink(wrapper.vm.record)).toEqual(doi);
    });

    it("can check getMaxItemShow computed property", () => {
        vuetify.framework.breakpoint.lgOnly = true;
        vuetify.framework.breakpoint.mdAndDown = false;
        expect(wrapper.vm.getMaxItemShown).toBe(2);
        vuetify.framework.breakpoint.lgOnly = false;
        vuetify.framework.breakpoint.xlOnly = true;
        expect(wrapper.vm.getMaxItemShown).toBe(3);
    });

    it("can check organizeChips method", () => {
        record['subjects'] = undefined
        expect(wrapper.vm.organizeChips(record, 'subjects', 3)).toBe(false);
        expect(wrapper.vm.organizeChips(record, 'userDefinedTags', 3)).toBe(true);
    });

});
