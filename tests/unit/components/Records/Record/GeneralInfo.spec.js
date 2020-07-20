import { shallowMount } from "@vue/test-utils";
import GeneralInfo from "@/components/Records/Record/GeneralInfo.vue"

describe("GeneralInfo.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(GeneralInfo, {
            propsData: {
                currentRecord: {
                    "metadata": {
                        "year_creation": 1912
                    },
                    "isRecommended": false,
                    "name": "RMS Titanic",
                    "abbreviation": "MGY",
                    "DOI": "FAIRsharing.MGY",
                    "type": "liner",
                    "registry": "gb",
                    "homepage": "https://whitestar.com/rms_titanic"
                }
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("GeneralInfo");
        expect(wrapper.vm.currentRecord.metadata.year_creation).toEqual(1912);
        expect(wrapper.vm.currentRecord.abbreviation).toMatch("MGY");
    });


});