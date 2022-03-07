import { shallowMount } from "@vue/test-utils";
import RecordMenu from "@/components/Records/Record/RecordMenu.vue"

describe("RecordMenu.vue", function(){
    let wrapper;

    it("can be instantiated", () => {
        wrapper = shallowMount(RecordMenu, {});
        expect(wrapper.name()).toMatch("RecordMenu");
    });
});
