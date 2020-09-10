import { shallowMount } from "@vue/test-utils";
import NoneFound from "@/components/Records/Record/NoneFound.vue"


describe("NoneFound.vue", function () {
    let wrapper;
    let otherWrapper;

    beforeEach(() => {
        wrapper = shallowMount(NoneFound, {
            propsData: {
                dataField: [
                    {"name": "some sort of object"}
                ]
            }
        });
    });

    it("can be instantiated with data", () => {
        expect(wrapper.name()).toMatch("NoneFound");
        expect(wrapper.vm.dataField[0].name).toMatch("some sort of object");
    });

    it("hidden when data are present", () => {
        // TODO: This should somehow be able to call the displaymessage function.
        expect(wrapper.vm.display).toEqual(false);
    });

    beforeEach(() => {
        otherWrapper = shallowMount(NoneFound, {
            propsData: {
                dataField: [],
                objectField: {},
                stringField: 'one doi',
            }
        });
    });

    it("can be instantiated without data", () => {
        expect(otherWrapper.name()).toMatch("NoneFound");
        expect(otherWrapper.vm.dataField.length).toEqual(0);
    });

    it("shown when data are not present", () => {
        // TODO: This should somehow be able to call the display function.
        expect(otherWrapper.vm.display).toEqual(true);
    });

    it("shown when no string data present", () => {
        // TODO: This should somehow be able to call the displayString function.
        expect(otherWrapper.vm.displayString).toEqual("one doi");
    });

});
