import {createLocalVue, shallowMount} from "@vue/test-utils";
import CommunityBlock from "@/components/Home/CommunityBlock"
import Vuetify from "vuetify"
import icons from "@/plugins/icons";
const vuetify = new Vuetify({'icons':icons});
const localVue = new createLocalVue()

localVue.use(vuetify);

describe("CategoryBlock.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CommunityBlock, {
            vuetify,
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CommunityBlock");
    });

});
