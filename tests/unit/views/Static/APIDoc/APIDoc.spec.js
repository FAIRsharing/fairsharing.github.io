import {shallowMount} from "@vue/test-utils";
import VueCodeHighlight  from 'vue-code-highlight';
import APIDoc from "@/views/Static/APIDoc/APIDoc"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("APIDoc.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(APIDoc, {
            vuetify,
            components:{VueCodeHighlight}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("APIDoc");
    });
});
