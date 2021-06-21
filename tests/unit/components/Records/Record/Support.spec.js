import { shallowMount } from "@vue/test-utils";
// import Vuex from "vuex";
// import Record from "@/store/recordData.js"
import Support from "@/components/Records/Record/Support.vue"
import Vuetify from "vuetify"

// const localVue = createLocalVue();
// localVue.use(Vuex);
const vuetify = new Vuetify();

describe("Support.vue", function(){
    let wrapper;

    wrapper = shallowMount(Support, {
        vuetify,
    });
    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Support");
    });
});
