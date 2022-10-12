import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Static/Timeline/Timeline"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("Timeline.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Timeline");
    });

});
