import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import Editor from "@/store/editor"
import DatasetBoolean from "@/components/Records/Record/AdditionalInfo/DatasetBoolean"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        record:Record,
        editor:Editor
    }});

describe("Citations.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(DatasetBoolean, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("DatasetBoolean");
    });

});
