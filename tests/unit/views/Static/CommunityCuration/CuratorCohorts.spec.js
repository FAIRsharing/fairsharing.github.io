import Vue from "vue"
import {shallowMount} from "@vue/test-utils";
import CuratorCohorts from "@/views/Static/CommunityCuration/CuratorCohorts"
import Vuetify from "vuetify"
import fakeData from "@/../tests/fixtures/communityCurationCohortsMock.json"

const vuetify = new Vuetify();

const currentCuratorsList = [
    {
        "name": "Annie Elkjær Ørum-Kristensen",
        "id": 6182,
        "organisation": "GBIF",
        "id_organisation": 1166,
        "scope": "Biodiversity",
        "early_adopter" : true,
        "show_more" : false,
        "orcid": "0000-0002-8326-5789",
        "twitter": "",
        "linkedin" : "",
        "logo": "",
        "year_active": ["2022", "2023"]
    },
    {
        "name": "Lindsey Anderson",
        "id": 5015,
        "organisation": "PNNL",
        "id_organisation": 2284,
        "scope": "Omics",
        "early_adopter" : true,
        "show_more" : false,
        "orcid": "0000-0002-8741-7823",
        "twitter": "",
        "linkedin" : "",
        "logo": "",
        "year_active": ["2022", "2021"]
    },
    {
        "name": "Malin Sandström",
        "id": 464,
        "organisation": null,
        "id_organisation": null,
        "scope": "Neuroscience",
        "early_adopter" : true,
        "show_more" : false,
        "orcid": "0000-0002-8464-2494",
        "twitter": "",
        "linkedin" : "",
        "logo": "",
        "year_active": ["2022"]
    }
]

const alumniCuratorsList = [
    {
        "name": "Kyle Copas",
        "id": 5832,
        "organisation": "GBIF",
        "id_organisation": 1166,
        "scope": "Biodiversity",
        "early_adopter" : true,
        "show_more" : false,
        "orcid": "0000-0002-6590-599X",
        "twitter": "kylecopas",
        "linkedin" : "kylecopas",
        "logo": "",
        "year_active": ["2021", "2019"]
    },
    {
        "name": "Joe Miller",
        "id": 6118,
        "organisation": "GBIF",
        "id_organisation": 1166,
        "scope": "Biodiversity",
        "early_adopter" : true,
        "show_more" : false,
        "orcid": "0000-0002-5788-9010",
        "twitter": "",
        "linkedin" : "",
        "logo": "",
        "year_active": ["2011"]
    }
]

// See also: '@/data/communityCurationCohorts.json'

describe("CuratorCohorts.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CuratorCohorts, {
            vuetify,
        })
        wrapper.setData({
            communityCurationCohorts: fakeData
        })

    });
    afterEach(() => {
        wrapper.destroy();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CuratorCohorts");
        expect(wrapper.vm.communityCurationCohorts).toStrictEqual(fakeData);
        expect(wrapper.vm.currentCohort).toStrictEqual(currentCuratorsList);
        expect(wrapper.vm.year).toBe(new Date().getFullYear());
        expect(wrapper.vm.yearList).toStrictEqual(["2023", "2022", "2021", "2019", "2011"]);
        expect(wrapper.vm.error).toBe(false);
        expect(wrapper.vm.alumniCurator).toBe(false);
    });

    it("can alumniCurator is true on click", () => {
        wrapper.vm.alumniCurator = false;
        wrapper.vm.listAlumni()
        expect(wrapper.vm.alumniCurator).toBe(true)
        expect(wrapper.vm.currentCohort).toStrictEqual(alumniCuratorsList);
        expect(wrapper.vm.year).toBe(null);
    });

    it("can alumniCurator is false on click", () => {
        const getCuratorsList = jest.fn();
        getCuratorsList()
        wrapper.vm.alumniCurator = true;
        wrapper.vm.listAlumni()
        expect(wrapper.vm.alumniCurator).toBe(false)
        expect(wrapper.vm.year).toBe(new Date().getFullYear());
        expect(getCuratorsList).toHaveBeenCalled();
    });
});