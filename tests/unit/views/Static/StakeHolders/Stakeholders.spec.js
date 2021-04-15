import { shallowMount } from "@vue/test-utils";
import Stakeholders from "@/views/Static/Stakeholders/Stakeholders"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Stakeholders.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Stakeholders, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Stakeholders");
    });

});
