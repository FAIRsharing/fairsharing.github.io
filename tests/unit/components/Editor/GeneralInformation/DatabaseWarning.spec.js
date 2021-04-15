import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import DatabaseWarning from "@/components/Editor/GeneralInformation/DatabaseWarning.vue"
import recordStore from "@/store/recordData.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
recordStore.state.sections = {
    generalInformation: {
        data: {
            type: {
                name: "test"
            },
            registry: "unknown",
            is_dataset: false
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

    it('will set the submitted value', () => {
        wrapper.vm.closeMenu();
        wrapper.vm.pressYes();
        expect(wrapper.vm.submitted).toBe(1);
    })

    it('will pass the naughty flag to the api', () => {
        wrapper.vm.pressNo();
        expect(wrapper.vm.submitted).toBe(0);
        wrapper.vm.pressYes();
        wrapper.vm.pressNo();
        expect(recordStore.state.sections.generalInformation.data.is_dataset).toBe(true);
    })
});
