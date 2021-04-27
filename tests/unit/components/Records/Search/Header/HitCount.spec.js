import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import HitCount from "@/components/Records/Search/Header/HitCount.vue"
import recordsStore from "@/store/recordSearch.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        records: recordsStore,
    }
});


describe("HitCount.vue", function () {
    let wrapper;

    wrapper = shallowMount(HitCount, {
        localVue,
        vuetify,
        mocks: {$store}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("HitCount");
    });

    it("sets maximum number of hits correctly", () => {
        let records = {hits: 90, perPage: 20, currentPage: 1};
        $store.state.records = records;
        expect(wrapper.vm.y).toBe(20);
        $store.state.records.currentPage = 5;
        expect(wrapper.vm.y).toBe(90);
    });
});
