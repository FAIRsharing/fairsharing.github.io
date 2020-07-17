import { shallowMount } from "@vue/test-utils";
import Support from "@/components/Records/Record/Support.vue"

describe("Support.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Support, {
            propsData: {
                contactData: [
                    {contact_name: "A Contact", contact_email: "contact@goatse.cx"},
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Support");
        expect(wrapper.vm.contactData[0].contact_name).toMatch("A Contact");
        expect(wrapper.vm.contactData[0].contact_email).toMatch("contact@goatse.cx");
    });


});