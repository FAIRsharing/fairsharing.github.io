import { shallowMount } from "@vue/test-utils";
import Educational from "@/views/Static/Educational/Educational"
import Vuetify from "vuetify"

const vuetify = new Vuetify();
let $route = {
    name: "Community",
    hash:'#governance'
};

describe("Privacy.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Educational, {
            vuetify,
            mocks: {$route},
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Educational");
        wrapper.vm.$route.hash = '#anotherAnchor'
        expect(wrapper.vm.applyCss).toBe(false);
    });

});
