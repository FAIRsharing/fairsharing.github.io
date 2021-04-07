import {createLocalVue, shallowMount} from "@vue/test-utils";
import BlockInfo from "@/components/Home/BlockInfo"
import Vuetify from "vuetify"
import icons from "@/plugins/icons";
import Vuex from "vuex";
import searchFilters from "@/store/searchFilters";
const vuetify = new Vuetify({'icons':icons});
const localVue = new createLocalVue()

localVue.use(vuetify);
localVue.use(Vuex);

searchFilters.state.filtersStatistic = {
    subjects:{buckets:[{doc_count:12,key:'natural science'}]},
    fairsharing_registry:{buckets:[{doc_count:500,key:'standard'}]},
}
const $store = new Vuex.Store({
    modules: {
        searchFiltersStore: searchFilters,
    }
});

describe("BlockInfo.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(BlockInfo, {
            vuetify,
            mocks:{$store}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("BlockInfo");
    });

});
