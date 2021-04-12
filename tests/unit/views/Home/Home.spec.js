import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home/Home"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Home.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Home");
    });

});
