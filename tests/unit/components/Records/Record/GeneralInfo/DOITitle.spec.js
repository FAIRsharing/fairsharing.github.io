import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import DOITitle from "@/components/Records/Record/GeneralInfo/DOITitle.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
    status: 'Ready',
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[{label:'a'}],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("DOITitle.vue", function(){
    let wrapper;


     beforeAll(()=>{
         const fileContents       = {width:'100',height:'200'};
         const readAsDataURL      = jest.fn();
         const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
             target: fileContents} )});
         const dummyFileReader    = {addEventListener, readAsDataURL, target: fileContents};
         window.Image        = jest.fn(() => dummyFileReader);
     })

    it("can be instantiated", async () => {
        wrapper = await shallowMount(DOITitle, {
            localVue,
            vuetify,
            mocks: {$store}
        })
        expect(wrapper.vm.$options.name).toMatch("DOITitle");
    });

    it("generates correct doi link", () => {
        let doiLink = `https://doi.org/${wrapper.vm.currentRecord['fairsharingRecord'].doi}`;
        expect(wrapper.vm.generateDoiLink(wrapper.vm.currentRecord['fairsharingRecord'].doi)).toEqual(doiLink);
    });

    it("can copy url correctly", () => {
        wrapper.vm.copyURL()
        expect(wrapper.vm.copyButtonStatus).toBe(true);
    });

    it("can check setImageAfterLoading", async () => {
        const fakeImage = {width: '300', height: '100'}
        await wrapper.vm.setImageAfterLoading(fakeImage)
        expect(wrapper.vm.finalImageWidth).toBe('300px');
    });

    it("can set DOI message", () => {
      expect(wrapper.vm.awaitingDoi()).toBe('Awaiting DOI');
    });

});

