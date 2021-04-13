import { shallowMount } from "@vue/test-utils";
import TabsBlock from "@/components/Home/TabsBlock"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("BlockSearch.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(TabsBlock, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("TabsBlock");
    });

});
