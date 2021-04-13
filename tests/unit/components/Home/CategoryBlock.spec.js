import {createLocalVue, shallowMount} from "@vue/test-utils";
import CategoryBlock from "@/components/Home/CategoryBlock"
import Vuetify from "vuetify"
import icons from "@/plugins/icons";
const vuetify = new Vuetify({'icons':icons});
const localVue = new createLocalVue()

localVue.use(vuetify);

describe("CategoryBlock.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CategoryBlock, {
            vuetify,
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CategoryBlock");
    });

});
