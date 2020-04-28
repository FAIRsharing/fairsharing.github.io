import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import NavBar from "../../../../src/components/Navigation/NavbarTop.vue"
import users from "@/store/users.js"


const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const router = new VueRouter();

const $store = new Vuex.Store({
    modules: {
        users: users
    },
});


describe("NavbarTop.vue", () => {

    let wrapper;

    beforeAll(() => {
        wrapper = shallowMount(NavBar, {
            mocks: {$store, router},
            localVue,
        });
    });

    it("can be instantiated", () => {
        const title = "NavbarTop";
        expect(wrapper.name()).toMatch(title);
    })
});
