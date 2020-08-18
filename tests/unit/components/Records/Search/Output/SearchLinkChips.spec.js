import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips.vue"
import VueRouter from "vue-router";


describe("SearchLinkChips.vue", function () {
    let wrapper;
    const vuetify = new Vuetify();
    const localVue = createLocalVue();
    localVue.use(VueRouter);

    beforeEach(() => {
        wrapper = shallowMount(SearchLinkChips, {
            localVue,
            vuetify,
            propsData: {
                type: 'domains',
                chips: [
                    {
                        label: 'first chip',
                        active: false
                    }
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchLinkChips");
    });

    it("can check toggleChipActiveness function", () => {
        expect(wrapper.vm.chips[0].active).toBe(false);
        wrapper.vm.toggleChipActiveness(wrapper.vm.chips[0]);
        expect(wrapper.vm.chips[0].active).toBe(true);
    });

    it("generates correct search link", () => {
       expect(wrapper.vm.chipUrl('test_string')).toBe("/search?domains=test_string");
    });

});