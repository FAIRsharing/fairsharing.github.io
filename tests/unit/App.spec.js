import {createLocalVue,shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import App from "@/App.vue";
import introspection from "@/store/introspector.js"
import uiControllerStore from "@/store/uiController.js";

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
        wrapper.vm.loading = false
        expect(wrapper.vm.$options.name).toMatch(title);
    });
});
