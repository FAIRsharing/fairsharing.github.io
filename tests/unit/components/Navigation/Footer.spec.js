import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Footer from "../../../../src/components/Navigation/Footer.vue"

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();


describe("Footer.vue", () => {
    it("can be instantiated", () => {
        const title = "Footer";
        const wrapper = shallowMount(Footer, {
            localVue,
            router
        });
        expect(wrapper.name()).toMatch(title);
    })
})
