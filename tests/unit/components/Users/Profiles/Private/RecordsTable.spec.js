import { shallowMount, createLocalVue } from "@vue/test-utils"
import RecordTable from "@/components/Users/Profiles/Private/RecordsTable"
const localVue = createLocalVue();


describe('RecordsTable.vue', () => {
    let wrapper;

    it("can be mounted with watched records", () => {
        wrapper = shallowMount(RecordTable, {
            localVue,
            propsData: {
                records: [],
                source: "watchedRecords"
            }
        });
        const title = "RecordsTable";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.perPage).toBe(7)
    });

    it("can be mounted with maintained records", () => {
        wrapper = shallowMount(RecordTable, {
            localVue,
            propsData: {
                records: [],
                source: "maintainedRecords"
            }
        });
        const title = "RecordsTable";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.perPage).toBe(5)
    });

    it("can be mounted with maintenance requests", () => {
        wrapper = shallowMount(RecordTable, {
            localVue,
            propsData: {
                source: "maintenanceRequests"
            }
        });
        const title = "RecordsTable";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.perPage).toBe(5);
    });

});
