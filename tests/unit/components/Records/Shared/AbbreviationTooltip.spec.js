import {shallowMount} from "@vue/test-utils";
import AbbreviationTooltip from "@/components/Records/Shared/AbbreviationTooltip.vue"

describe('AbbreviationTooltip.vue', () => {
    let wrapper;
    const abbreviation = "Inist Periodic Table of the Elements Trilingual Thesaurus"
    it("can be instantiated", () => {
        wrapper = shallowMount(AbbreviationTooltip,
            {
                propsData: {abbreviation: abbreviation}
            }
        );
        expect(wrapper.name()).toMatch("AbbreviationTooltip");
    });
});
