import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Header from "@/components/Navigation/Header.vue"
import uiControllerStore from "@/store/uiController.js";
import usersStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        uiController: uiControllerStore,
        users: usersStore,
    }
});

describe("Header.vue", function () {
    let wrapper;

    wrapper = shallowMount(Header, {
        localVue,
        vuetify,
        mocks: {$store}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch('Header');
    })

    it("can update the uiController store's UIGeneralStatus state", () => {
        const expectedData = {
            headerVisibilityState: true,
            drawerVisibilityState: true,
        };
        wrapper.vm.toggleDrawerLeft();
        expect($store.state.uiController.UIGeneralStatus).toStrictEqual(expectedData);
    });

    it("sets the closePopup value", () => {
        expect(wrapper.vm.closeMenuStatus).toStrictEqual(false);
        let status = false;
        wrapper.vm.closePopup(status);
        expect(wrapper.vm.closeMenuStatus).toStrictEqual(status);
        status = true;
        wrapper.vm.closePopup(status);
        expect(wrapper.vm.closeMenuStatus).toStrictEqual(status);
    })
});
