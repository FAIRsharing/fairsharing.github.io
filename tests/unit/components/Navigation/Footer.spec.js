import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Footer from "@/components/Navigation/Footer.vue"
import Vuetify from 'vuetify'

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();


describe("Footer.vue", () => {
    it("can be instantiated", () => {
        const wrapper = shallowMount(Footer, {
            localVue,
            vuetify,
            router
        });
        expect(wrapper.name()).toMatch("Footer");
    })
});
