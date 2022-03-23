import { shallowMount, createLocalVue } from "@vue/test-utils"
import AwardsTable from "@/components/Users/Profiles/Private/ViewAwards";
const localVue = createLocalVue();


describe('ViewAwards', () => {
    let wrapper;

    it("can be mounted", () => {
        wrapper = shallowMount(AwardsTable, {
            localVue,
            propsData: {
                organisations: [],
            }
        });
        const title = "ViewAwards";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.perPage).toBe(5)
    });

});
