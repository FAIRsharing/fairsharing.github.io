import { shallowMount } from "@vue/test-utils";
import TabContent from "@/components/Home/BlockTabs/TabContent"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("TabContent.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(TabContent, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("TabContent");
    });

});
