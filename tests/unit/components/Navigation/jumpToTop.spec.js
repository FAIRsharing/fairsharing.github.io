import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/Navigation/jumpToTop.vue"
const vuetify = new Vuetify();
import VueScrollTo from "vue-scrollto";

const localVue = createLocalVue();
localVue.use(VueScrollTo,{})

describe("jumpToTop.vue", function () {
    let wrapper;
    wrapper = shallowMount(jumpToTop, {
        vuetify,
        directives: {
            scrollTo() { /* stub */ }
        }
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch('JumpToTop');
    });

});
