import {shallowMount} from "@vue/test-utils";
import AssociatedRecordsTable from "@/components/Records/Record/AssociatedRecordsTable.vue"
import recordAssociations from "@/../tests/fixtures/recordAssociations.json"


describe("AssociatedRecordsTable.vue", function () {
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(AssociatedRecordsTable, {
          propsData: recordAssociations.propsData
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AssociatedRecordsTable");
        expect(wrapper.vm.recordAssociations[0].name).toMatch("Linking Record");
    });


});
