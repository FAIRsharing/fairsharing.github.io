import {createLocalVue, shallowMount} from "@vue/test-utils";
import New from "@/views/Static/New/New"
import Vuetify from "vuetify"
import VueSanitize from "vue-sanitize";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueSanitize)

describe("New.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(New, {
            vuetify,
            localVue
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("New");
    });

});
