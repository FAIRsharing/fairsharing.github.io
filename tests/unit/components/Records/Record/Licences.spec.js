import { shallowMount } from "@vue/test-utils";
import Licences from "@/components/Records/Record/Licences.vue"

// Name written as 'Licence' rather than 'License' to conform with API:
// https://oed.com/view/Entry/107943?rskey=cOk1xY&result=1&isAdvanced=false#eid
describe("Licences.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Licences, {
            propsData: {
                licenceData: [
                    {name: "Licence One"},
                    {name: "Licence Two"},
                ]
            }
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Licences");
        expect(wrapper.vm.licenceData[0].name).toMatch("Licence One");
        expect(wrapper.vm.licenceData[1].name).toMatch("Licence Two");
    });


});