import { shallowMount } from "@vue/test-utils";
import Jumbotron from "@/components/Home/Jumbotron"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Jumbotron.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Jumbotron, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Jumbotron");
    });

});
