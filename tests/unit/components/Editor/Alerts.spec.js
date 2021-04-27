import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import recordStore from "@/store/recordData.js"
import Alerts from "@/components/Editor/Alerts.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
recordStore.state.sections = {
    organisations: {
        error: true,
        message: {response:{ data: "I am en error"}}
    }
};
const $store = new Vuex.Store({
    modules: {
        record: recordStore,
    }
});
const vuetify = new Vuetify();


describe("Edit -> Alerts.vue", function() {
    let wrapper;

    it("can be mounted", () => {
        wrapper = shallowMount(Alerts, {
            localVue,
            vuetify,
            propsData: {
                target: "organisations"
            },
            mocks: {$store}
        });
        expect(wrapper.name()).toMatch("Alerts");
        recordStore.state.sections.organisations.error = false;
        expect(wrapper.vm.message.type()).toBe("success");
    });
});
