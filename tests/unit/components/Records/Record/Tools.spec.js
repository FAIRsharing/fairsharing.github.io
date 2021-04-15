import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import Tools from "@/components/Records/Record/Tools.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    metadata: {
        associated_tools: [{}]
    },
    taxonomies: [
        {label: "Turdus turdus"},
    ],
    subjects: [
        {label: "Javascript Fun"},
    ],
    domains: [
        {label: "Deneb"},
    ],
    userDefinedTags: [{label: 'a'}],
};
const $store = new Vuex.Store({
    modules: {
        record: Record
    }
});

describe("Tools.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Tools, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Tools");
    });

});
