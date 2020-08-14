import { shallowMount } from "@vue/test-utils";
import SectionTitle from "@/components/Records/Record/SectionTitle.vue"

describe("SectionTitle.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(SectionTitle, {
          propsData: {
            title: "Exciting Title"
          }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SectionTitle");
        expect(wrapper.vm.title).toMatch("Exciting Title");
    });


});
