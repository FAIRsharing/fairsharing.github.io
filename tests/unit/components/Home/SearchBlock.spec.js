import { shallowMount } from "@vue/test-utils";
import SearchBlock from "@/components/Home/SearchBlock"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("BlockSearch.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SearchBlock, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchBlock");
    });

});
