import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditPublicProfile from "@/views/Users/EditPublicProfile"
import Vuetify from "vuetify"
import Vuex from "vuex";
const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(Vuex);

describe("EditPublicProfile.vue", function () {
    let wrapper;

    beforeEach( () => {
        wrapper =  shallowMount(EditPublicProfile, {
            vuetify,
            localVue,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditPublicProfile");
    });

});
