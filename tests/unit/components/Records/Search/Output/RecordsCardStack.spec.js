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

    it("can check changeActiveItem function in stack list ", () => {
        const itemIndex = 0
        wrapper.vm.changeActiveItem(itemIndex);
        expect(wrapper.vm.buttons[itemIndex].active).toBe(true);
    });

    it("can check toggleChipActiveness function", () => {
        wrapper.vm.currentActiveChips = 'domains';
        const chip = {label: 'domains1', active: false};
        wrapper.vm.toggleChipActiveness(chip);
        expect(wrapper.vm.Chips[wrapper.vm.currentActiveChips][0].active).toBe(true);
    });


});
