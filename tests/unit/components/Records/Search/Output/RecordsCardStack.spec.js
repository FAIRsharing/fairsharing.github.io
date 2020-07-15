import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardStack.vue"
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(VueRouter);
const vuetify = new Vuetify();

describe("RecordsCardStack.vue", function () {
    let wrapper;
    let record = {
        "id": 1325,
        "type": "model_and_format",
        "name": "StandardsRegExt: a VOResource Schema Extension for Describing IVOA Standards",
        "abbreviation": "StandardsRegExt",
        "registry": "standard",
        "description": "StandardsRegExt is an XML encoding standard for metadata about IVOA standards themselves, referred to as StandardsRegExt. It is intended to allow for the discovery of a standard via an IVOA identifier that refers to the standard. It also allows one to define concepts that are defined by the standard which can themselves be referred to via an IVOA identifier (augmented with a URL fragment identifier). Finally, it can also provide a machine interpretable description of a standard service interface. We describe the general model for the schema and explain its intended use by interoperable registries for discovering resources.",
        "domains": [
            {
                "label": "domains1"
            },
            {
                "label": "domains2"
            },
            {
                "label": "domains3"
            }
        ],
        "subjects": [
            {
                "label": "sub 1"
            },
            {
                "label": "sub 2"
            },
            {
                "label": "sub 3"
            },
            {
                "label": "sub 4"
            }
        ],
        "taxonomies": [
            {
                "label": "Not applicable"
            },
            {
                "label": "Tax 2"
            }
        ],
        "recordAssociations": [
            {
                "linkedRecord": {
                    "name": "SimpleDALRegExt - Describing Simple IVOA Data Access Services",
                    "id": 1393,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "VOResource - an XML Encoding Schema for IVOA Resource Metadata",
                    "id": 1402,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "VODataService: a VOResource Schema Extension for Describing Collections and Services",
                    "id": 1394,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "IVOA Registry Relational Schema",
                    "id": 1363,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "IVOA Registry Interfaces",
                    "id": 1401,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "Resource Metadata for the Virtual Observatory",
                    "id": 1392,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            }
        ],
        "reverseRecordAssociations": [
            {
                "fairsharingRecord": {
                    "name": "IVOA Identifier",
                    "id": 354,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "fairsharingRecord": {
                    "name": "Extensible Markup Language",
                    "id": 1305,
                    "registry": "standard"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "fairsharingRecord": {
                    "name": "heiDATA",
                    "id": 2633,
                    "registry": "database"
                },
                "recordAssocLabel": "implements"
            },
            {
                "fairsharingRecord": {
                    "name": "International Virtual Observatory Alliance (IVOA)",
                    "id": 3034,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            }
        ],
        "status": "ready",
        "isRecommended": false
    }

    wrapper = shallowMount(RecordsCardStack, {
        localVue,
        vuetify,
        propsData:{
          record:record
        }
    });


    it("can check changeActiveItem function", () => {
        const itemIndex=0
        wrapper.vm.changeActiveItem(itemIndex);
        expect(wrapper.vm.buttons[itemIndex].active).toBe(true);
    });


    it("can check toggleChipActiveness function", () => {
        wrapper.vm.currentActiveChips = 'domains'
        const chip={label:'domains1',active:false}
        wrapper.vm.toggleChipActiveness(chip);
        expect(wrapper.vm.Chips[wrapper.vm.currentActiveChips][0].active).toBe(true);
    });


});
