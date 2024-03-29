import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import additionalInformationFixture from "@/../tests/fixtures/additionalInformation.json"
import FieldInput from "@/components/Editor/AdditionalInformation/FieldInput.vue"
import recordStore from "@/store/recordData.js";

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({modules: {
    record: recordStore
}});
$store.state.record.sections.additionalInformation = {
    data: additionalInformationFixture.data,
    initialData: JSON.parse(JSON.stringify(additionalInformationFixture.data))
};

describe("FieldInput.vue", function() {
    let wrapper;

    it("can be mounted without a subfield name", () => {
        wrapper = shallowMount(FieldInput, {
            localVue,
            mocks: {$store},
            propsData: {
                fieldName: "dataset_deposition",
                fieldProps: additionalInformationFixture.schema.properties['dataset_deposition']
            }
        });
        expect(wrapper.vm.$options.name).toMatch("FieldInput");
    });

    it("can be mounted with a subfield name with value", () => {
        wrapper = shallowMount(FieldInput, {
            localVue,
            mocks: {$store},
            propsData: {
                fieldName: "data_processes",
                fieldProps: additionalInformationFixture.schema.definitions.data_process.properties.url,
                subfieldName: 'url',
                id: 0
            }
        });
        expect(wrapper.vm.$options.name).toMatch("FieldInput");
    });

    it("can be mounted with a switch", () => {
        wrapper = shallowMount(FieldInput, {
            localVue,
            mocks: {$store},
            propsData: {
                fieldName: "dataset_deposition",
                fieldProps: additionalInformationFixture.schema.properties['dataset_deposition'].properties['restrictions'],
                subfieldName: 'restrictions'
            }
        });
        expect(wrapper.vm.$options.name).toMatch("FieldInput");
    });

    it("can be mounted with a subfield name but without value", () => {
        wrapper = shallowMount(FieldInput, {
            localVue,
            mocks: {$store},
            propsData: {
                fieldName: "anewfield",
                fieldProps: additionalInformationFixture.schema.definitions.data_process.properties.url,
                subfieldName: 'url',
                id: 0
            }
        });
        expect(wrapper.vm.$options.name).toMatch("FieldInput");
    });

    it("can set a field value without a subfield", () => {
        wrapper = shallowMount(FieldInput, {
            localVue,
            mocks: {$store},
            propsData: {
                fieldName: "dataset_preservation",
                fieldProps: additionalInformationFixture.schema.properties['dataset_preservation']
            }
        });
        expect(wrapper.vm.$options.name).toMatch("FieldInput");
        wrapper.vm.setField("AbC");
        expect(wrapper.vm.fields['dataset_preservation']).toBe("AbC");
    });

    it("can set a field value with a subfield", () => {
        wrapper = shallowMount(FieldInput, {
            localVue,
            mocks: {$store},
            propsData: {
                fieldName: "data_processes",
                fieldProps: additionalInformationFixture.schema.definitions.data_process.properties.url,
                subfieldName: 'url',
                id: 0
            }
        });
        expect(wrapper.vm.$options.name).toMatch("FieldInput");
        wrapper.vm.setField("https://example.com");
        expect(wrapper.vm.fields['data_processes'].url).toBe("https://example.com");
    });
});
