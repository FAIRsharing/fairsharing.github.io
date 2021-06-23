import {createLocalVue, shallowMount} from "@vue/test-utils";
import Community from "./Community.vue";
import Vuetify from "vuetify"
import icons from "@/plugins/icons";
import linkify from "vue-linkify";

describe("Community.vue", function () {
    let wrapper;
    const localVue = createLocalVue();
    localVue.directive('linkified', linkify)
    const vuetify = new Vuetify({'icons': icons});
    beforeEach(() => {
        wrapper = shallowMount(Community,
            {
                localVue,
                vuetify,
                stubs: ['router-link']
            }
        );
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Community");
    });

});
