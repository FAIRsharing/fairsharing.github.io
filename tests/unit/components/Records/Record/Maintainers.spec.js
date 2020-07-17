import { shallowMount } from "@vue/test-utils";
import Maintainers from "@/components/Records/Record/Maintainers.vue"

describe("Maintainers.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Maintainers, {
            propsData: {
                maintainerData: [
                    // TODO: Ask further about this data structure
                    {id: 100, contact_name: "Maintainer One", username: "Still M.O."}
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Maintainers");
        expect(wrapper.vm.maintainerData[0].contact_name).toMatch("Maintainer One");
        expect(wrapper.vm.maintainerData[0].id).toEqual(100);
    });


});