import { shallowMount } from "@vue/test-utils";
import AssociatedRecords from "@/components/Records/Record/AssociatedRecords.vue"

describe("AssociatedRecords.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(AssociatedRecords, {
            propsData: {
                recordAssociations: [
                    {
                        name: "Linking Record",
                        registry: "Databases",
                        recordAssocLabel: "fiddles with",
                        subject: "Linked Record"
                    }
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AssociatedRecords");
        expect(wrapper.vm.recordAssociations[0].name).toMatch("Linking Record");
    });


});