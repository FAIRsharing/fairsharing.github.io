import { shallowMount, createLocalVue } from "@vue/test-utils"
import PublicMessages from "@/components/Global/PublicMessages"
import Vuetify from 'vuetify'
import Vuex from "vuex";
import searchFilters from "@/store/searchFilters.js";
const vuetify = new Vuetify();
const localVue = createLocalVue();

localVue.use(Vuex);

const $store = new Vuex.Store({
    modules: {
        searchFilters: searchFilters
    }
});

describe("PublicMessages.vue", () => {
    it("can be instantiated", () => {
        const wrapper = shallowMount(PublicMessages, {
            vuetify,
            mocks:{$store}
        });
        expect(wrapper.name()).toMatch("PublicMessages");
    })
});
