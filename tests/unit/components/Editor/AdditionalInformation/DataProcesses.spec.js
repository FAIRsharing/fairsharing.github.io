import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import dataProcesses from "@/components/Editor/AdditionalInformation/DataProcesses"
import recordStore from "@/store/record";
import userStore from "@/store/users";
import editorStore from "@/store/editor.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let record = {
    data_processes: [
        {
            type: 'data access',
            url: 'http://wibble.com',
            name: 'how to get the data'
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


describe("DataProcesses", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(dataProcesses, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("DataProcesses");
        expect(wrapper.vm.currentFields).toStrictEqual(wrapper.vm.initialFields);
        expect(wrapper.vm.section).toStrictEqual(recordStore.state.sections.additionalInformation);
    });

    it("can create new data processes", () => {
        expect(wrapper.vm.newDataProcess).toStrictEqual({});
        expect(wrapper.vm.openEditor).toBe(false);
        wrapper.vm.createDataProcess();
        expect(wrapper.vm.newDataProcess).toStrictEqual({
            type: null,
            url: null,
            name: null
        });
        expect(wrapper.vm.openEditor).toBe(true);
    });

    it("can add and remove data processes", () => {
        let oldDp = wrapper.vm.currentFields.data_processes[0];
        let newDp = {type: 'data curation', url: 'http://badgerbadgerbadger.com', name: 'SNAKE!'};
        expect(wrapper.vm.currentFields.data_processes.length).toEqual(1);
        wrapper.vm.newDataProcess = newDp;
        wrapper.vm.addDataProcess();
        expect(wrapper.vm.currentFields.data_processes.length).toEqual(2);
        expect(wrapper.vm.currentFields.data_processes[1]).toStrictEqual(newDp);
        wrapper.vm.removeDataProcess(newDp);
        expect(wrapper.vm.currentFields.data_processes.length).toEqual(1);
        expect(wrapper.vm.currentFields.data_processes[0]).toStrictEqual(oldDp);
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
        let newWrapper = shallowMount(dataProcesses, {
            localVue,
            vuetify,
            mocks: {$store}
        });
        expect(newWrapper.vm.currentFields.data_processes).toStrictEqual([]);

    });

})