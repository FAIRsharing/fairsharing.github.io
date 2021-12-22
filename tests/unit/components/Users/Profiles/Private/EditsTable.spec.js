import {shallowMount, createLocalVue} from "@vue/test-utils"
import EditsTable from "@/components/Users/Profiles/Private/EditsTable"
const localVue = createLocalVue();
const $router = { push: jest.fn() };


describe('EditsTable.vue', () => {
    let wrapper;

    it("can be mounted", () => {
        wrapper = shallowMount(EditsTable, {
            localVue,
            propsData: {
                edits: [],
            }
        });
        const title = "EditsTable";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.perPage).toBe(10)
    });

    it("can show and hide the overlay", () => {
        wrapper = shallowMount(EditsTable, {
            localVue,
            propsData: { },
            mocks: {$router}
        });
        wrapper.vm.previewRecord(12);
        expect(wrapper.vm.targetID).toBe(12);
        expect(wrapper.vm.showOverlay ).toBe(true);
        wrapper.vm.hideOverlay(12);
        expect(wrapper.vm.targetID).toBe(null);
        expect(wrapper.vm.showOverlay ).toBe(false);
    });

    it("can open the record page", async () => {
        wrapper = shallowMount(EditsTable, {
            localVue,
            propsData: { },
            mocks: {$router}
        });
        const mockedOpen = jest.fn();
        const originalOpen = window.open;
        window.open = mockedOpen;
        wrapper.vm.goToRecord(12);
        expect(mockedOpen).toBeCalled();
        window.open = originalOpen;
    });

});
