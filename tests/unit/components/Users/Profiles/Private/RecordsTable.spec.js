import { shallowMount, createLocalVue } from "@vue/test-utils"
import RecordTable from "@/components/Users/Profiles/Private/RecordsTable"
const localVue = createLocalVue();
const $router = { push: jest.fn() };


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

    it("can show and hide the overlay", () => {
        wrapper = shallowMount(RecordTable, {
            localVue,
            propsData: {
                source: "maintenanceRequests"
            },
            mocks: {$router}
        });
        wrapper.vm.previewRecord(12);
        expect(wrapper.vm.targetID).toBe(12);
        expect(wrapper.vm.showOverlay ).toBe(true);
        wrapper.vm.hideOverlay(12);
        expect(wrapper.vm.targetID).toBe(null);
        expect(wrapper.vm.showOverlay ).toBe(false);
        wrapper.vm.goToEdit(12);
        expect($router.push).toHaveBeenCalledWith({path: "/12/edit"})
    });

});
