import { shallowMount } from "@vue/test-utils";
import Organisations from "@/components/Records/Record/Organisations.vue"

describe("Organisations.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Organisations, {
            propsData: {
                organisationData: [
                    {name: "Organisation One"},
                    {name: "Organisation Two"},
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Organisations");
        expect(wrapper.vm.organisationData[0].name).toMatch("Organisation One");
        expect(wrapper.vm.organisationData[1].name).toMatch("Organisation Two");
    });


});