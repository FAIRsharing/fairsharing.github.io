import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import accessPoints from "@/components/Editor/AdditionalInformation/AccessPoints"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();


describe("AccessPoints", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(accessPoints, {
            localVue,
            vuetify
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AccessPoints");
    });
});