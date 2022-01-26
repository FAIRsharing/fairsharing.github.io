import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import DOITitle from "@/components/Records/Record/GeneralInfo/DOITitle.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
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
/*
         const blob = new Blob(['image/jpg']);
         const mFile = new File([blob], 'img.jpeg', {
             type: 'image/jpeg',
         });
         const fileContents       = {width:'100',height:'200'};
         const readAsDataURL      = jest.fn();
         const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
             target: fileContents} )});
         const dummyFileReader    = {addEventListener, readAsDataURL, target: fileContents};
         window.FileReader        = jest.fn(() => dummyFileReader);
*/
     })

    it("can be instantiated", async () => {
        wrapper = await shallowMount(DOITitle, {
            localVue,
            vuetify,
            mocks: {$store}
        })
        expect(wrapper.name()).toMatch("DOITitle");
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

        const fakeImage = {width: '200', height: '100'}
        await wrapper.vm.setImageAfterLoading(fakeImage)
        expect(wrapper.vm.finalImageWidth).toBe('300px');
    });

});

