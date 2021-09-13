import {shallowMount} from "@vue/test-utils";
import Licence from "@/views/Static/Licence/Licence"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Licence.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Licence, {
            vuetify,
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Licence");
    });
});
