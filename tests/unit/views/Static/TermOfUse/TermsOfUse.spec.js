import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"

import Home from "@/views/Static/TermOfUse/TermsOfUse"

const vuetify = new Vuetify();

describe("TermsOfUse.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("TermsOfUse");
    });

});
