import {shallowMount} from "@vue/test-utils";
import DatasetArray from "@/components/Records/Record/AdditionalInfo/DatasetArray"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("DatasetArray.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(DatasetArray, {
            vuetify,
        });
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("DatasetArray");
    });

    it("can react to changes in currentKey prop", () => {
        expect(wrapper.vm.getUpdatedTypeTitle()).toMatch("Type");
        wrapper.setProps({currentKey: "data_curation"})
        expect(wrapper.vm.getUpdatedTypeTitle()).toMatch("Steps");
        wrapper.setProps({currentKey: "data_deposition_condition"})
        expect(wrapper.vm.getUpdatedTypeTitle()).toMatch("Restrictions");
        wrapper.setProps({})
        expect(wrapper.vm.getUpdatedNameTitle()).toMatch("Name");
        wrapper.setProps({currentKey: "resource_sustainability"})
        expect(wrapper.vm.getUpdatedNameTitle()).toMatch("Plan");
        let title = "cos top guidelines"
        expect(wrapper.vm.setTitle(title)).toMatch("COS TOP Guidelines");
        title = "anything else"
        expect(wrapper.vm.setTitle(title)).toMatch("anything else");
    });

});
