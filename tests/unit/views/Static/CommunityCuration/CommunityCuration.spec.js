import {shallowMount} from "@vue/test-utils";
import VueCodeHighlight  from 'vue-code-highlight';
import CommunityCuration from "@/views/Static/CommunityCuration/CommunityCuration"
import Vuetify from "vuetify"

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
        expect(wrapper.name()).toMatch("CommunityCuration");
    });
});
