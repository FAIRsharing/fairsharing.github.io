import { shallowMount } from "@vue/test-utils";
import NoneFound from "@/components/Records/Record/NoneFound.vue"


describe("NoneFound.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(NoneFound, {
            propsData: {
                dataField: [
                    {"name": "some sort of object"},
                ],
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("NoneFound");
    });

    it("hide noneFound card when expected data type is not matched", () => {
        expect(wrapper.vm.displayData).toBe(false);
    });

    it("can be instantiated with Object data", () => {
        wrapper.setProps({ dataField: [],stringField : 'one doi' })
        expect(wrapper.vm.displayData).toEqual(true);
    });

});
