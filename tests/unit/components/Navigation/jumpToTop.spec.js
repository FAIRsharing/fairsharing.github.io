import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/Navigation/jumpToTop.vue"
const vuetify = new Vuetify();

describe("jumpToTop.vue", function () {
    let wrapper;
    wrapper = shallowMount(jumpToTop, {
        vuetify,
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch('JumpToTop');
    });

});
