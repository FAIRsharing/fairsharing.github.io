import { shallowMount } from "@vue/test-utils";
import Grants from "@/components/Records/Record/Grants.vue"

describe("Grants.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Grants, {
            propsData: {
                grantData: [
                    {name: "Grant One"},
                    {name: "Grant Two"},
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Grants");
        expect(wrapper.vm.grantData[0].name).toMatch("Grant One");
        expect(wrapper.vm.grantData[1].name).toMatch("Grant Two");
    });


});