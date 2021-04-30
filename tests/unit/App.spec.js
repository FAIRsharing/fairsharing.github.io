import {shallowMount, createLocalVue} from "@vue/test-utils";
import App from "@/App.vue";
import Vuetify from "vuetify"
import uiControllerStore from "@/store/uiController.js";
import introspection from "@/store/introspector.js"
import Vuex from "vuex";
import jumboData from "@/data/jumbotronData.json"

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
        expect(wrapper.vm.getJumbotronData()).toStrictEqual(jumboData.home)
    });

    it("can handle sub-search routes", () => {
        $route = {
            path: "/search",
            name: "search",
            query: {
                fairsharingRegistry: "collection"
            }
        };
        wrapper = shallowMount(App, {
            localVue,
            vuetify,
            mocks: {$store, $route},
            stubs: ['router-link', 'router-view']
        });
        expect(wrapper.vm.getJumbotronData()).toStrictEqual(jumboData.collection)
    });

    it("can handle a no route case", () => {
        $route = {
            path: "",
            name: "",
        };
        wrapper = shallowMount(App, {
            localVue,
            vuetify,
            mocks: {$store, $route},
            stubs: ['router-link', 'router-view']
        });
        expect(wrapper.vm.getJumbotronData()).toBe(null)
    });

    it("can handle an unknown route case", () => {
        $route = {
            path: "/test",
            name: "test",
        };
        wrapper = shallowMount(App, {
            localVue,
            vuetify,
            mocks: {$store, $route},
            stubs: ['router-link', 'router-view']
        });
        expect(wrapper.vm.getJumbotronData()).toBe(null)
    });

});
