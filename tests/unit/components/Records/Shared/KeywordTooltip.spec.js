import {shallowMount} from "@vue/test-utils";
import KeywordTooltip from "@/components/Records/Shared/KeywordTooltip.vue"

describe('KeywordTooltip.vue', () => {
    let wrapper;
    wrapper = shallowMount(KeywordTooltip, {
        propsData: {
            keyword: {
                label: 'ABC',
                synonyms: ["abc", "def:test"],
                definitions: ["first def"],
                expandedNames: []
            }
        }
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("KeywordTooltip");
        expect(wrapper.vm.processArray(wrapper.vm.keyword.synonyms)).toBe("abc, def: test.")
    });
});
