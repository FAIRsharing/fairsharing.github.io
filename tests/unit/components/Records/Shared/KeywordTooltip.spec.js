import {shallowMount} from "@vue/test-utils";
import KeywordTooltip from "@/components/Records/Shared/KeywordTooltip.vue"

describe('KeywordTooltip.vue', () => {
    let wrapper;
    let keyword = {
            label: 'ABC',
            synonyms: ["abc", "def:test"],
            definitions: ["first def"],
            expandedNames: []
    };

    it("can be mounted", () => {
        wrapper = shallowMount(KeywordTooltip, { propsData: { keyword: keyword } });
        expect(wrapper.name()).toMatch("KeywordTooltip");
        expect(wrapper.vm.processArray(wrapper.vm.keyword.synonyms)).toBe("abc, def: test.")
    });

    it ("can process empty synonyms", () => {
        keyword.synonyms = [];
        wrapper = shallowMount(KeywordTooltip, { propsData: { keyword: keyword  } });
        expect(wrapper.vm.processArray(wrapper.vm.keyword.synonyms)).toBe(null);
    })
});
