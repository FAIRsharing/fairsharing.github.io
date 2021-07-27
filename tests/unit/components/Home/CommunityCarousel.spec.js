import { shallowMount } from "@vue/test-utils";
import CommunityCarousel from "@/components/Home/CommunityCarousel"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("CommunityCarousel", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CommunityCarousel, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CommunityCarousel");
    });

});
