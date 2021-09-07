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
    let wrapper;

    it("can be instantiated", () => {
            wrapper = shallowMount(PublicMessages, {
            localVue,
            vuetify,
            mocks:{$store}
        });
        expect(wrapper.name()).toMatch("PublicMessages");
    })

    it("can be check moment method", () => {
        const momentifiedDate = wrapper.vm.momentify('2021-08-26T14:24:46Z');
        expect(momentifiedDate).toBe('Thursday, August 26th 2021, 15:24')
    });

});
