import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import accessPoints from "@/components/Editor/AdditionalInformation/AccessPoints"
import recordStore from "@/store/record";
import userStore from "@/store/users";
import editorStore from "@/store/editor.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let record = {
    access_points: [
        {
            type: 'REST',
            url: 'http://wibble.com',
            documentation_url: 'http://wibble.com/docs',
            example_url: 'http://wibble.com/example'
        }
    ]
};
recordStore.state.sections = {
    additionalInformation: {
        error: false,
        data: record,
        initialData: JSON.parse(JSON.stringify(record)),
        changes: 0,
        message: null
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


describe("AccessPoints", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(accessPoints, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AccessPoints");
        expect(wrapper.vm.currentFields).toStrictEqual(wrapper.vm.initialFields);
        expect(wrapper.vm.section).toStrictEqual(recordStore.state.sections.additionalInformation);
        expect(wrapper.vm.message.type()).toBe("success");
        recordStore.state.sections.additionalInformation.error = true;
        expect(wrapper.vm.message.type()).toBe("error");
        recordStore.state.sections.additionalInformation.error = false;
    });

    it("can create new access points", () => {
        expect(wrapper.vm.newAccessPoint).toStrictEqual({});
        expect(wrapper.vm.openEditor).toBe(false);
        wrapper.vm.createAccessPoint();
        expect(wrapper.vm.newAccessPoint).toStrictEqual({
            type: null,
            url: null,
            documentation_url: null,
            example_url: null
        });
        expect(wrapper.vm.openEditor).toBe(true);
    });

    it("can add and remove access points", () => {
        let oldAp = wrapper.vm.currentFields.access_points[0];
        let newAp = {type: 'REST', url: 'http://badgerbadgerbadger.com'};
        expect(wrapper.vm.currentFields.access_points.length).toEqual(1);
        wrapper.vm.newAccessPoint = newAp;
        wrapper.vm.addAccessPoint();
        expect(wrapper.vm.currentFields.access_points.length).toEqual(2);
        expect(wrapper.vm.currentFields.access_points[1]).toStrictEqual(newAp);
        wrapper.vm.removeAccessPoint(newAp);
        expect(wrapper.vm.currentFields.access_points.length).toEqual(1);
        expect(wrapper.vm.currentFields.access_points[0]).toStrictEqual(oldAp);
    });

    it("returns an empty array if there's no section data", () => {
        recordStore.state.sections = {
            additionalInformation: {
                error: false,
                data: {},
                initialData: JSON.parse(JSON.stringify(record)),
                changes: 0,
                message: null
            }
        };
        let newWrapper = shallowMount(accessPoints, {
            localVue,
            vuetify,
            mocks: {$store}
        });
        expect(newWrapper.vm.currentFields.access_points).toStrictEqual([]);

    });

})