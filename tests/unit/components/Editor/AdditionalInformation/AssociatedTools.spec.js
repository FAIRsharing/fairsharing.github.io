import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import associatedTools from "@/components/Editor/AdditionalInformation/AssociatedTools"
import recordStore from "@/store/record";
import userStore from "@/store/users";
import editorStore from "@/store/editor.js"
import accessPoints from "@/components/Editor/AdditionalInformation/AccessPoints";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let record = {
    associated_tools: [
        {
            name: 'wibble',
            url: 'http://wibble.com',
        }
    ]
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


describe("AssociatedTools", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(associatedTools, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AssociatedTools");
        expect(wrapper.vm.currentFields).toStrictEqual(wrapper.vm.initialFields);
        expect(wrapper.vm.section).toStrictEqual(recordStore.state.sections.additionalInformation);
    });

    it("can create new tools", () => {
        expect(wrapper.vm.newTool).toStrictEqual({});
        expect(wrapper.vm.openEditor).toBe(false);
        wrapper.vm.createTool();
        expect(wrapper.vm.newTool).toStrictEqual({
            name: null,
            url: null
        });
        expect(wrapper.vm.openEditor).toBe(true);
    });

    it("can add and remove tools", () => {
        let oldAt = wrapper.vm.currentFields.associated_tools[0];
        let newAt = {name: 'Badger Tool', url: 'http://badgerbadgerbadger.com'};
        expect(wrapper.vm.currentFields.associated_tools.length).toEqual(1);
        wrapper.vm.newTool = newAt;
        wrapper.vm.addTool();
        expect(wrapper.vm.currentFields.associated_tools.length).toEqual(2);
        expect(wrapper.vm.currentFields.associated_tools[1]).toStrictEqual(newAt);
        wrapper.vm.removeTool(newAt);
        expect(wrapper.vm.currentFields.associated_tools.length).toEqual(1);
        expect(wrapper.vm.currentFields.associated_tools[0]).toStrictEqual(oldAt);
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
        let newWrapper = shallowMount(accessPoints, {
            localVue,
            vuetify,
            mocks: {$store}
        });
        expect(newWrapper.vm.currentFields.associated_tools).toStrictEqual([]);

    });



})