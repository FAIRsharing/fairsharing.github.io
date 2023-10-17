import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuetify from "vuetify"
import Vuex from "vuex";

import additionalInformationFixture from "@/../tests/fixtures/additionalInformation.json"
import EditAdditionalInfo from "@/components/Editor/AdditionalInformation/EditAdditionalInfo.vue"
import RestClient from "@/lib/Client/RESTClient.js"
import editorStore from "@/store/editor.js"
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
const sinon = require('sinon');
const VueScrollTo = require('vue-scrollto');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);

const $store = new Vuex.Store({modules: {
    record: recordStore,
    users: userStore,
    editor: editorStore
}});
$store.state.users.user = function(){return {credentials: {token: "123"}}};
$store.state.record.sections.additionalInformation = {
    data: additionalInformationFixture.data,
    initialData: JSON.parse(JSON.stringify(additionalInformationFixture.data)),
    error: false,
    message: null,
    changes: 0
};
let $route = {params: {id: "123"}};
const router = new VueRouter();
const $router = { push: jest.fn() };
const template = {
    url: {
        type: "string",
        format: "uri",
        minLength: 1,
        description: "The URL at which the named data process can be found."
    },
    anotherField: {}
};

let editAdditionalInfo;

describe("EditAdditionalInfo.vue", function() {
    let wrapper;

    beforeAll(() => {
        editAdditionalInfo = {
            render: () => {},
            methods: {
                validate: () => true,
            },
            data(){return {}}
        };
    });

    it("can be mounted without allowed fields", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        expect(wrapper.vm.$options.name).toMatch("EditAdditionalInfo");
    });

    it("can be mounted with allowed fields", () => {
        $store.state.editor.allowedFields = additionalInformationFixture.schema;
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        expect(wrapper.vm.$options.name).toMatch("EditAdditionalInfo");
    });

    it("can show/hide an overlay", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        wrapper.vm.showOverlay(1, "abc", {schema: "schema"}, template, []);
        expect(wrapper.vm.overlay).toStrictEqual({
            show: true,
            id: 1,
            fieldName: "abc",
            template: template,
            fields: {schema: "schema"},
            required: []
        });
        wrapper.vm.showOverlay(1, "abc", {schema: "schema"}, {abc: {}}, ['abc']);
        expect(wrapper.vm.rules('abc', ['abc']).length).toBe(1);
        wrapper.vm.hideOverlay();
        expect(wrapper.vm.overlay).toStrictEqual({
            show: false,
            id: null,
            fieldName: null,
            fields: null,
            template: null
        })
    });

    it("can create a new item", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        wrapper.vm.createItem("fieldName", template);
        expect(wrapper.vm.overlay.template).toStrictEqual(template);
        expect(JSON.stringify(wrapper.vm.overlay.fields)).toStrictEqual(JSON.stringify({url: null, anotherField: null}))
    });

    it("can add and remove an item", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        wrapper.vm.overlay.fieldName = "contacts";
        wrapper.vm.overlay.id = 1;
        wrapper.vm.fieldValue = null;
        wrapper.vm.addItem();
        expect(wrapper.vm.fields.contacts[1]).toBe(null);
        wrapper.vm.removeItem("contacts", 1);
        expect(wrapper.vm.fields.contacts[1]).toBe(undefined);
        wrapper.vm.overlay.fieldName = "testField";
        wrapper.vm.overlay.id = null;
        wrapper.vm.addItem();
        expect(wrapper.vm.fields['testField']).toStrictEqual([null]);
        wrapper.vm.overlay.fieldName = "contacts";
        wrapper.vm.addItem();
        expect(wrapper.vm.fields.contacts[1]).toBe(null);
    });

    it("can save the record", async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        $store.state.editor.allowedFields = additionalInformationFixture.schema;
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        let restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: "Hello !"});
        await wrapper.vm.saveRecord(true);
        expect(wrapper.vm.message.error).toBe(false);
        expect(wrapper.vm.message.value).toBe('Record successfully updated!');
        restStub.restore();

        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: {error: "I am an error"}});
        await wrapper.vm.saveRecord();
        expect($store.state.record.sections.additionalInformation.error).toBe(true);
        expect($store.state.record.sections.additionalInformation.message).toBe('I am an error');
        restStub.restore();

        jest.clearAllMocks();
    });

    it("can react to fields changing value", async () => {
        const vuetify = new Vuetify();
        wrapper = await shallowMount(EditAdditionalInfo, {
            localVue,
            vuetify,
            mocks: {$store},
            stubs: {'v-form': editAdditionalInfo}
        });
        wrapper.vm.fields.dataset_citation = "no";
        wrapper.vm.submitChanges(wrapper.vm.fields);
        expect($store.state.record.sections.additionalInformation.changes).toBe(1);
    })

    it('sorts object fields so URL is shown last', () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: {'router-link': true, 'v-form': editAdditionalInfo}
        });
        expect(wrapper.vm.sortObject(
            {url: 'fun', name: 'more fun'}
            )).toStrictEqual({name: 'more fun', url: 'fun'})
    });
});
