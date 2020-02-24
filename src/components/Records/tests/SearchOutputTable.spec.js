import {shallowMount} from "@vue/test-utils"
import OutputTable from "../SearchOutputTable.vue"

describe("SearchOutputTable.vue", function(){
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(OutputTable, {});
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchOutputTable");
    });

});