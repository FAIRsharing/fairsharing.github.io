import {shallowMount} from "@vue/test-utils";
import OtherDatasetArray from "@/components/Records/Record/DataProcessesAndConditions/OtherDatasetArray"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("OtherDatasetArray.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(OtherDatasetArray, {
            vuetify,
        });
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("OtherDatasetArray");
    });

});