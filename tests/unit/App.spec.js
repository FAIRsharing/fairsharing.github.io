import {shallowMount, createLocalVue} from "@vue/test-utils";
import VueRouter from "vue-router";
import App from "@/App.vue";
import Vuetify from "vuetify"
import uiControllerStore from "@/store/uiController.js";
import Vuex from "vuex";
import Vue from 'vue'

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(VueRouter)

const $store = new Vuex.Store({
    modules: {
        uiController: uiControllerStore,
    }
});


describe("App.vue", () => {
    let wrapper;
    const vuetify = new Vuetify();

    it("can be instantiated", () => {
        const title = "App";
        wrapper = shallowMount(App, {
            localVue,
            vuetify,
            mocks: { $store}
        });
        expect(wrapper.name()).toMatch(title);
    });


    it("can check the toggleOverFlow", () => {
        $store.state.uiController.UIGeneralStatus={
            bodyOverflowState: false,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        };
        $store.state.uiController.UIGeneralStatus={
            bodyOverflowState: true,
            drawerVisibilityState: false,
            headerVisibilityState: true,
        };
    });


});
