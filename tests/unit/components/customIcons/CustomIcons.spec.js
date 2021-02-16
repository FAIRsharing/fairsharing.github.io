import { shallowMount } from "@vue/test-utils";
import CustomIcons from "@/components/customIcons/CustomIcons.vue"
import Vuetify from "vuetify"

const vuetify = new Vuetify();

describe("CustomIcons.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CustomIcons, {
            vuetify,
            propsData:{
                iconSource:{source:"elixir.jpg"}
            }
        })
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("CustomIcons");
        wrapper.vm.getImgUrl('elixir.jpg');
    });

});
