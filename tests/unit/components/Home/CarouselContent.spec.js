import { shallowMount } from "@vue/test-utils";
import CarouselContent from "@/components/Home/CarouselContent"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("TabContent.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CarouselContent, {
            vuetify,
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CarouselContent");
    });

});
