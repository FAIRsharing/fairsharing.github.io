import {shallowMount} from "@vue/test-utils";
import VueCodeHighlight  from 'vue-code-highlight';
import License from "@/views/Static/License/License"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("License.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(License, {
            vuetify,
            components:{VueCodeHighlight}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("License");
    });
});
