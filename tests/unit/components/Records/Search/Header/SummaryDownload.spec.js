import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import SummaryDownload from "@/components/Records/Search/Header/SummaryDownload.vue"
import recordsStore from "@/store/recordSearch.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
    }
});


describe("SummaryDownload.vue", function () {
    let wrapper;

    wrapper = shallowMount(SummaryDownload, {
        localVue,
        vuetify,
        mocks: {$store}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SummaryDownload");
    });

});
