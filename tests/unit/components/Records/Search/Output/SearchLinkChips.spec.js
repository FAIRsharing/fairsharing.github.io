import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips.vue"

let $route = {
    name: "search",
    query: {}
};

const $router = {
    push: jest.fn(),
};

describe("SearchLinkChips.vue", function () {
    let wrapper;
    const vuetify = new Vuetify();
    const localVue = createLocalVue();

    beforeEach(() => {
        wrapper = shallowMount(SearchLinkChips, {
            localVue,
            vuetify,
            propsData: {
                type: 'domains',
                chips: [
                    {
                        label: 'first chip',
                        active: false
                    }
                ]
            },
            mocks: {$route, $router}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchLinkChips");
    });

    it("can check updateSearchQuery function", () => {
        expect(wrapper.vm.chips[0].active).toBe(false);
        wrapper.vm.updateSearchQuery(wrapper.vm.chips[0]);
        expect(wrapper.vm.chips[0].active).toBe(true);
        let fakeChip = {label: 'fake', active: 'false'}
        wrapper.vm.updateSearchQuery(fakeChip);
        expect(wrapper.vm.chips[0].active).toBe(true);
    });

    it("updates the route properly", () => {
        expect($router.push).toHaveBeenCalledTimes(2);
        wrapper.vm.$route.query = {subjects: 'banana'};
        let chip = {label: 'orange', active: 'false'};
        wrapper.vm.updateSearchQuery(chip);
        expect($router.push).toHaveBeenCalledTimes(3);
    });


});