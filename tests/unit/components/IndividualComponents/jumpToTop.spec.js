import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/IndividualComponents/jumpToTop.vue"

const vuetify = new Vuetify();

describe("jumpToTop.vue", function () {
    let wrapper;
    const title = "JumpToTop";

    wrapper = shallowMount(jumpToTop, {
        vuetify,
        propsData: {
            targetObject: 'fake-div'
        }
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch(title);
    });

});
