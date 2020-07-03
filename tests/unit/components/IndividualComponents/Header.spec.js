import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Header from "@/components/IndividualComponents/Header.vue"
import uiControllerStore from "@/store/uiController.js";
import usersStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        uiController: uiControllerStore,
        users: usersStore,
    }
});
const router = new VueRouter();
const $router = {push: jest.fn()};


describe("Header.vue", function () {
    let wrapper;

    wrapper = shallowMount(Header, {
        localVue,
        vuetify,
        router,
        mocks: {$store, $router}
    });

    it("can update the uiController store's UIGeneralStatus state", () => {
        const expectedData = {
            headerVisibilityState: true,
            drawerVisibilityState: true,
            bodyOverflowState: false,
        };
        wrapper.vm.toggleDrawerLeft();
        expect($store.state.uiController.UIGeneralStatus).toStrictEqual(expectedData);
    });
});
