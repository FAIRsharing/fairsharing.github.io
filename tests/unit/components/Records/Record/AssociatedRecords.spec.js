import {shallowMount} from "@vue/test-utils";
import AssociatedRecords from "@/components/Records/Record/AssociatedRecords.vue"
import recordAssociations from "@/../tests/fixtures/recordAssociations.json"


describe("AssociatedRecords.vue", function () {
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(AssociatedRecords, {
          propsData: recordAssociations.propsData
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AssociatedRecords");
        expect(wrapper.vm.recordAssociations[0].name).toMatch("Linking Record");
    });

});
