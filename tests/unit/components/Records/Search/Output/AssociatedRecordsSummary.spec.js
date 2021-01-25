import {shallowMount} from "@vue/test-utils";
import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary.vue"
import associatedRecords from "../../../../../fixtures/associatedRecords.json"

describe("AssociatedRecordsSummary.vue", function () {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(AssociatedRecordsSummary, {
            propsData: associatedRecords.propsData
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AssociatedRecordsSummary");
        expect(wrapper.vm.associatedRecords.registry).toMatch("standard");
    });

    it("can check setRecordLabels method", () => {
        wrapper.vm.associatedRecords.registry = "database"
        expect(wrapper.vm.setRecordLabels("standards")).toBe("Standards Implemented");
        expect(wrapper.vm.setRecordLabels("databases")).toBe("Related Databases");
        expect(wrapper.vm.setRecordLabels("policies")).toBe("Endorsing Policies");
        wrapper.vm.associatedRecords.registry = "collection"
        expect(wrapper.vm.setRecordLabels("standards")).toBe("Related Standards");
        expect(wrapper.vm.setRecordLabels("databases")).toBe("Related Databases");
        expect(wrapper.vm.setRecordLabels("policies")).toBe("Related Policies");
    });

});
