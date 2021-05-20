import { shallowMount } from "@vue/test-utils";
import Educational from "@/views/Static/Educational/Educational"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Privacy.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Educational, {
            vuetify,
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Educational");
    });

});
