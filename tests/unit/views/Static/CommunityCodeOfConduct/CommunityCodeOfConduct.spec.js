import {shallowMount} from "@vue/test-utils";
import VueCodeHighlight  from 'vue-code-highlight';
import CommunityCodeOfConduct from "@/views/Static/CommunityCodeOfConduct/CommunityCodeOfConduct"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("CommunityCodeOfConduct.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CommunityCodeOfConduct, {
            vuetify,
            components:{VueCodeHighlight}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CommunityCodeOfConduct");
    });
});
