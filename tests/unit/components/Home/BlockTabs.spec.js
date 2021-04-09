import { shallowMount } from "@vue/test-utils";
import BlockTabs from "@/components/Home/BlockTabs"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("BlockSearch.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(BlockTabs, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("BlockTabs");
    });

});
