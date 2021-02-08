import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Footer from "@/components/Navigation/Footer.vue"
import Vuetify from 'vuetify'
import VueScrollTo from "vue-scrollto";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueScrollTo,{})
const router = new VueRouter();


describe("Footer.vue", () => {
    it("can be instantiated", () => {
        const wrapper = shallowMount(Footer, {
            localVue,
            vuetify,
            router,
            directives: {
                scrollTo() { /* stub */ }
            }
        });
        expect(wrapper.name()).toMatch("Footer");
    })
});
