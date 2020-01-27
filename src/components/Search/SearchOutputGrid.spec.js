import {shallowMount} from "@vue/test-utils"
import OutputGrid from "./SearchOutputGrid.vue"

describe("SearchOutputGrid.vue", function(){
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(OutputGrid, {});
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchOutputGrid");
    });

});