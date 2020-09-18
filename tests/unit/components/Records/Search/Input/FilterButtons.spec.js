import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import FilterButtons from "@/components/Records/Search/Input/FilterButtons.vue"
import users from "@/store/users.js";
import searchFilters from "@/store/searchFilters.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();


const $store = new Vuex.Store({
    modules: {
        users: users,
        searchFilters: searchFilters
    }
});


describe("FilterButtons.vue", function () {
    let wrapper;

    wrapper = shallowMount(FilterButtons, {
        localVue,
        vuetify,
        mocks: {$store}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("FilterButtons");
    });

    it("shows everything to curators", () => {
        searchFilters.state.filterButtons = [
            {
                data: [],
                curator_only: true
            },
            {
                data: [],
                curator_only: false
            }
        ];
        users.state.user = function(){
            return { is_curator: true }
        };
        expect(wrapper.vm.allowedFilterButtons.length).toEqual(2);
        users.state.user = function(){
            return { is_curator: false }
        };
        expect(wrapper.vm.allowedFilterButtons.length).toEqual(1);
    });

/*

});

 */

});
