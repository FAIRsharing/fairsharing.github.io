import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/Navigation/jumpToTop.vue"
const vuetify = new Vuetify();

describe("jumpToTop.vue", function () {
    let wrapper;
    window.scrollTo = jest.fn();
    wrapper = shallowMount(jumpToTop, {
        vuetify,
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch('JumpToTop');
    });

    it("can check scrollToTop function", () => {
        wrapper.vm.scrollToTop();
        expect(window.scrollTo).toHaveBeenCalledTimes(1);
    });

});
