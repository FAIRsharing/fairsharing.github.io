import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import EditAdditionalInfo from "@/components/Editor/AdditionalInformation/EditAdditionalInfo.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import editorStore from "@/store/editor.js"
import VueRouter from "vue-router";
import additionalInformationFixture from "@/../tests/fixtures/additionalInformation.json"

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({modules: {
    record: recordStore,
    users: userStore,
    editor: editorStore
}});
$store.state.users.user = function(){return {credentials: {token: "123"}}};
$store.state.record.sections.additionalInformation = {
    data: additionalInformationFixture.data,
    initialData: JSON.parse(JSON.stringify(additionalInformationFixture.data))
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
    }
};

describe("Editor.vue", function() {
    let wrapper;

    it("can be mounted without allowed fields", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: ['router-link']
        });
        expect(wrapper.name()).toMatch("EditAdditionalInfo");
    });

    it("can be mounted with allowed fields", () => {
        $store.state.editor.allowedFields = additionalInformationFixture.schema;
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: ['router-link']
        });
        expect(wrapper.name()).toMatch("EditAdditionalInfo");
    });

    it("can show/hide an overlay", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: ['router-link']
        });
        wrapper.vm.showOverlay(1, "abc", {schema: "schema"}, template);
        expect(wrapper.vm.overlay).toStrictEqual({
            show: true,
            id: 1,
            fieldName: "abc",
            template: template,
            fields: {schema: "schema"}
        });
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
            stubs: ['router-link']
        });
        wrapper.vm.createItem("fieldName", template);
        expect(wrapper.vm.overlay.template).toStrictEqual(template);
        expect(JSON.stringify(wrapper.vm.overlay.fields)).toStrictEqual(JSON.stringify({url: null}))
    });

    it("can add an item", () => {
        wrapper = shallowMount(EditAdditionalInfo, {
            localVue,
            router,
            mocks: {$store, $route, $router},
            stubs: ['router-link']
        });
        wrapper.vm.overlay.fieldName = "contacts";
        wrapper.vm.overlay.id = 1;
        wrapper.vm.fieldValue = null;
        wrapper.vm.addItem();
        expect(wrapper.vm.fields.contacts[1]).toBe(null);
    });
});
