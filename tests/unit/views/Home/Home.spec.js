import { shallowMount, createLocalVue } from "@vue/test-utils";
import Home from "@/views/Home/Home"
import Vuetify from "vuetify"
import VueScrollTo from "vue-scrollto";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueScrollTo,{});

describe("Home.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            vuetify,
            localVue
        })
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Home");
    });

});
