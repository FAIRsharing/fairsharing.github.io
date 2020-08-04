import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardColumn.vue"
import getRecord from '../../../../../fixtures/getRecord.json'
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(VueRouter);
const vuetify = new Vuetify();

describe("RecordsCardColumn.vue", function () {
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
        expect(wrapper.name()).toMatch("RecordsCardColumn");
    });

    it("can check changeActiveItem function", () => {
        const itemIndex = 0
        wrapper.vm.changeActiveItem(itemIndex);
        expect(wrapper.vm.buttons[itemIndex].active).toBe(true);
    });

    it("can check toggleChipActiveness function", () => {
        wrapper.vm.currentActiveChips = 'domains'
        const chip = {label: 'domains1', active: false}
        wrapper.vm.toggleChipActiveness(chip);
        expect(wrapper.vm.Chips[wrapper.vm.currentActiveChips][0].active).toBe(true);
    });

    it("can check getButtonLabel function in CardColumn", () => {
        let returnedValue = wrapper.vm.getButtonLabel('taxonomies');
        expect(returnedValue).toBe('species');
        returnedValue = wrapper.vm.getButtonLabel('userDefinedTags');
        expect(returnedValue).toBe('tags');
    });

});
