import { shallowMount } from "@vue/test-utils";
import Privacy from "@/views/Static/Privacy/Privacy"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Privacy.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Privacy, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Privacy");
    });

});
