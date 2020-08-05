import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import SearchOutput from "@/components/Records/Search/Output/SearchOutput.vue"
import recordsStore from "@/store/records.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();


const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
    }
});


describe("SearchOutput.vue", function () {
    let wrapper;

    wrapper = shallowMount(SearchOutput, {
        localVue,
        vuetify,
        mocks: {$store}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchOutput");
    });

    it("can check changeListType function", () => {
        wrapper.vm.changeListType(true);
        expect(wrapper.vm.isColumnList).toBe(true);
    });

});
