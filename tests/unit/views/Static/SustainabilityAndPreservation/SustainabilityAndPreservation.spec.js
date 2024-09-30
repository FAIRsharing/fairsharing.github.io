import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"

import PreservationPolicy from "@/views/Static/SustainabilityAndPreservation/SustainabilityAndPreservation.vue"

const vuetify = new Vuetify();

describe("SustainabilityAndPreservation.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(PreservationPolicy, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("SustainabilityAndPreservation");
    });

});
