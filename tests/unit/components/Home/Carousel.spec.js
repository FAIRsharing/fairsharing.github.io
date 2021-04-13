import { shallowMount } from "@vue/test-utils";
import Carousel from "@/components/Home/Carousel"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("BlockSearch.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Carousel, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Carousel");
    });

    it("can cycle through tabs", () => {
        jest.useFakeTimers();
        expect(wrapper.vm.tabsData.selectedTab).toBe(0);
        wrapper.vm.tabsData.selectedTab = 6;
        wrapper.vm.cycleTabs();
        jest.advanceTimersByTime(5000);
        expect(wrapper.vm.tabsData.selectedTab).toBe(0);
        wrapper.vm.cycleTabs();
        jest.advanceTimersByTime(5000);
        expect(wrapper.vm.tabsData.selectedTab).toBe(2);
    })

});
