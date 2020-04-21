import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import Toolbar from "@/components/Records/Search/searchToolbar.vue";
import records from "@/store/records";

const localVue = createLocalVue();
localVue.use(Vuex);


const $store = new Vuex.Store({
    modules: {
        records: records
    },
});

describe("SearchOutputGrid.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Toolbar, {
            mocks: {$store},
            localVue
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchToolbar");
    });

});

