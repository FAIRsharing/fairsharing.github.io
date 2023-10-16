import {createLocalVue, shallowMount} from "@vue/test-utils";
import VueSanitize from "vue-sanitize";
import Vuetify from "vuetify"

import noDatasetsPlease from '@/data/noDatasetsPlease.json';
import icons from "@/plugins/icons";
import New from "@/views/Static/New/New"

const vuetify = new Vuetify({'icons':icons});
const localVue = createLocalVue();
localVue.use(VueSanitize)

describe("New.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(New, {
            vuetify,
            localVue
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("New");
    });

    it("translates text", () => {
        expect(wrapper.vm.showTranslation).toBe(false);
        expect(wrapper.vm.translatedText).toEqual('');
        expect(wrapper.vm.closeButton).toEqual('');
        wrapper.vm.translate('de')
        expect(wrapper.vm.showTranslation).toBe(true);
        expect(wrapper.vm.translatedText).toStrictEqual(noDatasetsPlease.de.text);
        expect(wrapper.vm.closeButton).toStrictEqual(noDatasetsPlease.de.close);
    });

});
