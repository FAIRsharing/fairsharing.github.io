import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import ListController from "@/components/Records/Search/Header/ListController.vue"
import recordsStore from "@/store/records.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
    }
});

describe("ListController.vue", function () {
    let wrapper;

    wrapper = shallowMount(ListController, {
        localVue,
        vuetify,
        mocks: {$store}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("ListController");
    });

    it("can check changeListType function", () => {
        wrapper.vm.changeListType('stackList');
        expect(wrapper.vm.isColumnList).toBe(false);
        wrapper.vm.changeListType('columnList');
        expect(wrapper.vm.isColumnList).toBe(true);
    });

});
