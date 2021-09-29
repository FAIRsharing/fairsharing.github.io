import {createLocalVue, shallowMount} from "@vue/test-utils";
import Educational from "@/views/Static/Educational/Educational"
import Vuetify from "vuetify"
import VueSanitize from "vue-sanitize";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueSanitize)

let $route = {
    name: "Community",
    hash:'#faq9-3'
};

describe("Privacy.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Educational, {
            localVue,
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
