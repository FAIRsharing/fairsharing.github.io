import {createLocalVue, shallowMount} from "@vue/test-utils";
import VueCodeHighlight from 'vue-code-highlight';
import License from "@/views/Static/License/License"
import Vuetify from "vuetify"

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(VueCodeHighlight);

describe("License.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(License, {
            localVue,
            vuetify
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("License");
    });

    it("can check itemRowBackground", () => {
        expect(wrapper.vm.itemRowBackground({id:0})).toBe('grey lighten-3');
    });

});
