import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import crossReferences from "@/components/Editor/AdditionalInformation/CrossReferences"
import recordStore from "@/store/record";
import userStore from "@/store/users";
import editorStore from "@/store/editor.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let record = {
    cross_references: [
        {
            portal: 'Bioportal',
            name: 'Soylent Green',
            url: 'http://bioportal.org/soylent_green'
        }
    ],
};
recordStore.state.sections = {
    additionalInformation: {
        error: false,
        data: record,
        initialData: JSON.parse(JSON.stringify(record)),
        changes: 0,
    }
};
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        record: recordStore,
        users: userStore,
        editor: editorStore
    }
});


describe("CrossReferences", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(crossReferences, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CrossReferences");
        expect(wrapper.vm.currentFields).toStrictEqual(wrapper.vm.initialFields);
        expect(wrapper.vm.section).toStrictEqual(recordStore.state.sections.additionalInformation);
    });

    it("can create new cross references", () => {
        expect(wrapper.vm.newReference).toStrictEqual({});
        expect(wrapper.vm.openEditor).toBe(false);
        wrapper.vm.createReference();
        expect(wrapper.vm.newReference).toStrictEqual({
            portal: null,
            name: null,
            url: null
        });
        expect(wrapper.vm.openEditor).toBe(true);
    });

    it("can add and remove cross references", () => {
        let oldCr = wrapper.vm.currentFields.cross_references[0];
        let newCr = {portal: 'OBO', url: 'http://obo.org/badger', name: 'badger'};
        expect(wrapper.vm.currentFields.cross_references.length).toEqual(1);
        wrapper.vm.newReference = newCr;
        wrapper.vm.addReference();
        expect(wrapper.vm.currentFields.cross_references.length).toEqual(2);
        expect(wrapper.vm.currentFields.cross_references[1]).toStrictEqual(newCr);
        wrapper.vm.removeReference(newCr);
        expect(wrapper.vm.currentFields.cross_references.length).toEqual(1);
        expect(wrapper.vm.currentFields.cross_references[0]).toStrictEqual(oldCr);
    });

    it("returns an empty array if there's no section data", () => {
        recordStore.state.sections = {
            additionalInformation: {
                error: false,
                data: {},
                initialData: JSON.parse(JSON.stringify(record)),
                changes: 0,
            }
        };
        let newWrapper = shallowMount(crossReferences, {
            localVue,
            vuetify,
            mocks: {$store}
        });
        expect(newWrapper.vm.currentFields.cross_references).toStrictEqual([]);

    });

})