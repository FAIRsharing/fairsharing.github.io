import {shallowMount, createLocalVue} from "@vue/test-utils"
import VueRouter from "vue-router"
import NavBar from "./NavbarTop.vue"

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();


describe("NavbarTop.vue", () => {
    it("can be instantiated", () => {
        const title = "NavbarTop";
        const wrapper = shallowMount(NavBar, {
            localVue,
            router
        });
        expect(wrapper.name()).toMatch(title);
    })
})
