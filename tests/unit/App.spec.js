import {shallowMount, createLocalVue} from "@vue/test-utils";
import App from "@/App.vue";
import Vuetify from "vuetify"
import uiControllerStore from "@/store/uiController.js";
import introspection from "@/store/introspector.js"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let $route = { path: "/", name: "Home"};
const $store = new Vuex.Store({
    modules: {
        uiController: uiControllerStore,
        introspection: introspection
    }
});

describe("App.vue", () => {
    let wrapper;
    const vuetify = new Vuetify();
    $store.state.uiController.UIGeneralStatus = {
        drawerVisibilityState: false,
    };

    it("can be instantiated", async () => {
        const title = "App";
        wrapper = await shallowMount(App, {
            localVue,
            vuetify,
            mocks: {$store, $route},
            stubs: ['router-link', 'router-view']
        });
        expect(wrapper.name()).toMatch(title);
    });

});
