import {shallowMount} from "@vue/test-utils";
import License from "@/views/Static/License/License"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("License.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(License, {
            vuetify,
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("License");
    });
});
