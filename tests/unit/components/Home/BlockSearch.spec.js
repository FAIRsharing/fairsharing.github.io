import { shallowMount } from "@vue/test-utils";
import BlockSearch from "@/components/Home/BlockSearch"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("BlockSearch.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(BlockSearch, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("BlockSearch");
    });

});
