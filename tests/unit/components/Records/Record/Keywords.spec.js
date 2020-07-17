import { shallowMount } from "@vue/test-utils";
import Keywords from "@/components/Records/Record/Keywords.vue"

describe("Keywords.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Keywords, {
            propsData: {
                taxonomies: [
                    {label: "Turdus turdus"}
                ],
                subjects: [
                    {label: "Javascript Fun"}
                ],
                domains: [
                    {label: "Deneb"}
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Keywords");
        expect(wrapper.vm.taxonomies[0].label).toMatch("Turdus turdus");
        expect(wrapper.vm.subjects[0].label).toMatch("Javascript Fun");
        expect(wrapper.vm.domains[0].label).toMatch("Deneb");
    });


});