import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import searchCollection from "@/components/Records/Record/CollectionRecord/SearchCollection"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();


describe("searchCollection.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(searchCollection, {
            localVue,
            vuetify
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("searchCollection");
    });

});
