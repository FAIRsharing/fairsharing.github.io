import { shallowMount, createLocalVue } from "@vue/test-utils"
import PublicMessages from "@/components/Global/PublicMessages"
import Vuetify from 'vuetify'
import Vuex from "vuex";
import messages from "@/store/messages.js";
const vuetify = new Vuetify();
const localVue = createLocalVue();
import VueMoment from "vue-moment"

localVue.use(Vuex);
localVue.use(VueMoment);

const $store = new Vuex.Store({
    modules: {
        messages: messages
    }
});

describe("PublicMessages.vue", () => {
    it("can be instantiated", () => {
        const wrapper = shallowMount(PublicMessages, {
            localVue,
            vuetify,
            mocks:{$store}
        });
        expect(wrapper.name()).toMatch("PublicMessages");
    })
});
