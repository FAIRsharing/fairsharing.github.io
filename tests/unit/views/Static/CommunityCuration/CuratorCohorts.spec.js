import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"

import realData from "@/data/communityCurationCohorts.json"
import CuratorCohorts from "@/views/Static/CommunityCuration/CuratorCohorts"

const vuetify = new Vuetify();

describe("CuratorCohorts.vue", function(){
    let wrapper;
    realData.data.sort((a, b) => a.name.localeCompare(b.name))

    beforeEach(() => {
        wrapper = shallowMount(CuratorCohorts, {
            vuetify,
        })

    });
    afterEach(() => {
        wrapper.destroy();
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("CuratorCohorts");
        expect(wrapper.vm.communityCurationCohorts.data).toStrictEqual(realData.data);
        let currentCuratorsList = realData.data.filter(curator => {
          return curator.year_active.includes(new Date().getFullYear().toString()) && !curator.hidden
        })
        expect(wrapper.vm.currentCohort).toStrictEqual(currentCuratorsList);
        expect(wrapper.vm.year).toBe(new Date().getFullYear());
        //expect(wrapper.vm.yearList).toStrictEqual([ "2023", "2022"]);
        expect(wrapper.vm.error).toBe(false);
        expect(wrapper.vm.alumniCurator).toBe(false);
    });

    it("can alumniCurator is true on click", () => {
        wrapper.vm.alumniCurator = false;
        wrapper.vm.listAlumni()
        expect(wrapper.vm.alumniCurator).toBe(true)
        let currentCuratorsList = realData.data.filter(curator => {
          return curator.year_active.every(el => el < new Date().getFullYear())
        })
        expect(wrapper.vm.currentCohort).toStrictEqual(currentCuratorsList);
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
