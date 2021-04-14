import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import Citations from "@/components/Records/Record/GeneralInfo/Citations.vue"
import Vuetify from "vuetify"
import VueMoment from "vue-moment"

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMoment);
const vuetify = new Vuetify();


Record.state.currentRecord["fairsharingRecord"] = {
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[{label:'a'}],
    metadata: {citations: []},
    lastEditor:{username:"a user"}
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Citations.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Citations, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("Citations");
    });

});
