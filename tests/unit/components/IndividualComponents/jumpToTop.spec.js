import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/IndividualComponents/jumpToTop.vue"

const vuetify = new Vuetify();

describe("jumpToTop.vue", function () {
    let wrapper;
    wrapper = shallowMount(jumpToTop, {
        vuetify,
        propsData: {
            targetObject: 'fake-div'
        }
    });


    beforeEach(() => {
        wrapper.vm.myDiv.scrollTo = () => {}
    })

    it("can scroll to top", () => {

        wrapper.vm.scrollToTop(true);

        wrapper.vm.scrollToTop(true);
        expect(wrapper.vm.scrolledCorrectly).toBe(true);
        wrapper.vm.scrollToTop(false);
        expect(wrapper.vm.scrolledCorrectly).toBe(true);

    });
});
