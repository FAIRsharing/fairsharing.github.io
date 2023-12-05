import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"

import PreservationPolicy from "@/views/Static/PreservationPolicy/PreservationPolicy.vue"

const vuetify = new Vuetify();

describe("PreservationPolicy.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(PreservationPolicy, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("PreservationPolicy");
    });

});
