import { shallowMount, createLocalVue } from "@vue/test-utils";
import CustomIcons from "@/components/customIcons/CustomIcons.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
const vuetify = new Vuetify();

describe("CustomIcons.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(CustomIcons, {
            localVue,
            vuetify,
        })
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("CustomIcons");
        wrapper.vm.getImgUrl('elixir.jpg');
    });

});
