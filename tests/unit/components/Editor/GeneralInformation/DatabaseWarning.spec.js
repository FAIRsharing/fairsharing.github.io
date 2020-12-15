import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import DatabaseWarning from "@/components/Editor/GeneralInformation/DatabaseWarning.vue"
import recordStore from "@/store/record.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
recordStore.state.sections = {
    generalInformation: {
        data: {
            type: {
                name: "test"
            },
            registry: "unknown"
        }
    }
};

const $store = new Vuex.Store({
    modules: {
        record: recordStore
    }
});

let wrapper;

describe('Editor -> DatabaseWarning.vue', () => {

    beforeEach(() => {
        wrapper = shallowMount(DatabaseWarning, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("DatabaseWarning");
    });

    it("can watch the type", () => {
        recordStore.state.sections.generalInformation.data.type.name = "repository";
        expect(wrapper.vm.showOverlay).toBe(true);
        wrapper.vm.showOverlay = false;
        recordStore.state.sections.generalInformation.data.type.name = "test";
        expect(wrapper.vm.showOverlay).toBe(false);
    });

    it('has some stupid methods', () => {
        wrapper.vm.closeMenu();
        wrapper.vm.pressYes();
        expect(wrapper.vm.submitted).toBe(1);
    })
});
