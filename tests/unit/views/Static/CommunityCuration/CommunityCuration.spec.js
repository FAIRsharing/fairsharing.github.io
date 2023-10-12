import {shallowMount} from "@vue/test-utils";
import VueCodeHighlight  from 'vue-code-highlight';
import Vuetify from "vuetify"

import CommunityCuration from "@/views/Static/CommunityCuration/CommunityCuration"

const vuetify = new Vuetify();

describe("CommunityCuration.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CommunityCuration, {
            vuetify,
            components:{VueCodeHighlight}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("CommunityCuration");
    });
});
