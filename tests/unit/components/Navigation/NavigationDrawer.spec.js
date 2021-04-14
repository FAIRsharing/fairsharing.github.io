import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import NavDrawer from "@/components/Navigation/NavigationDrawer.vue"
import Vuetify from 'vuetify'
import userStore from "@/store/users.js";
import Vuex from "vuex";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const router = new VueRouter();
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        users: userStore
    }
});


describe("NavigationDrawer.vue", () => {
    it("can be instantiated", async () => {
        const wrapper = shallowMount(NavDrawer, {
            localVue,
            vuetify,
            router,
            mocks: {$store}
        });
        expect(wrapper.name()).toMatch("NavigationDrawer");
        await wrapper.vm.goTo({
            path: "collections",
            query: {}
        });
        expect(wrapper.vm.$route.path).toBe('/collections');
        await wrapper.vm.goTo({
            path: "collections",
            query: {}
        });
        expect(wrapper.vm.$route.path).toBe('/collections');
        await wrapper.vm.goToLogin();
        expect(wrapper.vm.$route.path).toBe('/accounts/login');
        await wrapper.vm.goToLogin();
        expect(wrapper.vm.$route.path).toBe('/accounts/login');
        wrapper.vm.makeActiveButton({path: "/search", query: {
            fairsharingRegistry: "Database"
        }});
        expect(wrapper.vm.buttons[0].active).toBe(false);
        expect(wrapper.vm.buttons[1].active).toBe(true);
    })
});
