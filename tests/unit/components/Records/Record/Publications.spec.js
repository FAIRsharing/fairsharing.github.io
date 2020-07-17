import { shallowMount } from "@vue/test-utils";
import Publications from "@/components/Records/Record/Publications.vue"

describe("Publications.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Publications, {
            propsData: {
                publicationData: [
                    {title: "Publication One"},
                    {title: "Publication Two"},
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Publications");
        expect(wrapper.vm.publicationData[0].title).toMatch("Publication One");
        expect(wrapper.vm.publicationData[1].title).toMatch("Publication Two");
    });


});