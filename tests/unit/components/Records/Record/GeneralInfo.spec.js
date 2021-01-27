import { shallowMount, createLocalVue } from "@vue/test-utils";
import GeneralInfo from "@/components/Records/Record/GeneralInfo.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
const vuetify = new Vuetify();

describe("GeneralInfo.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(GeneralInfo, {
            localVue,
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("GeneralInfo");
    });

    it("can call callRequestOwnership method", () => {
        wrapper.vm.callRequestOwnership();
        expect(wrapper.emitted().requestOwnership).toBeTruthy()
    });

});
