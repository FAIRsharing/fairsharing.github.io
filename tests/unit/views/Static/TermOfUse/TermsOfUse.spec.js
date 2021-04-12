import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Static/TermOfUse/TermsOfUse"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("TermsOfUse.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("TermsOfUse");
    });

});
