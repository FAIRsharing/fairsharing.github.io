import { shallowMount } from "@vue/test-utils";
import BlockHero from "@/components/Home/BlockHero"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Jumbotron.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(BlockHero, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Jumbotron");
    });

});
