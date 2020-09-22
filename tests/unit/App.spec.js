import {shallowMount, createLocalVue} from "@vue/test-utils";
import VueRouter from "vue-router";
import App from "@/App.vue";
import Vuetify from "vuetify"
import uiControllerStore from "@/store/uiController.js";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
let routes = [{ path: "/" }];
const router = new VueRouter({routes});
const $store = new Vuex.Store({
    modules: {
        uiController: uiControllerStore,
    }
});

describe("App.vue", () => {
    let wrapper;
    const vuetify = new Vuetify();
    $store.state.uiController.UIGeneralStatus = {
        bodyOverflowState: false,
        drawerVisibilityState: false,
        headerVisibilityState: true,
    };

    it("can be instantiated", () => {
        const title = "App";
        wrapper = shallowMount(App, {
            localVue,
            vuetify,
            router,
            mocks: {$store},
        });
        expect(wrapper.name()).toMatch(title);
    });

    it("can trigger watcher", () => {
        $store.commit("uiController/setUIStatus", {bodyOverflowState: true});
        expect(wrapper.vm._status).toBe(true);
    });

    it("can check the toggleOverFlow", () => {
        $store.commit("uiController/setUIStatus", {bodyOverflowState: false});
        expect(wrapper.vm._status).toBe(false);
    });

});
