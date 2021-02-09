import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import AnyAllButton from "@/components/Records/Search/Input/AnyAllButton.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let $route = {
    name: "search",
    query: {}
};

const $router = {
    push: jest.fn(),
};

describe("AnyAllButton.vue", function () {
    let wrapper;

    wrapper = shallowMount(AnyAllButton, {
        localVue,
        vuetify,
        propsData: {
           searchAnd: true
        },
        mocks: {$router, $route}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AnyAllButton");
    });

    it("can change the value for searchAnd", () => {
        wrapper.vm.$route.query = {searchAnd: 'true'};
        wrapper.vm.applyFilter(true);
        expect(wrapper.vm.searchAnd).toEqual(true);
        expect(wrapper.vm.$route.query.searchAnd).toEqual("true");
        wrapper.vm.$route.query = {searchAnd: 'false'};
        wrapper.vm.applyFilter(false);
        expect(wrapper.vm.searchAnd).toEqual(false);
        expect(wrapper.vm.$route.query.searchAnd).toEqual("false");
    });

    it("changes route correctly", async () => {
        let $route = {
            name: "Standards",
            query: {
                searchAnd: 'false',
            }
        };
        wrapper = shallowMount(AnyAllButton, {
            mocks: {$route, $router},
        });
        expect($router.push).toHaveBeenCalledTimes(1);
        await wrapper.vm.applyFilter(false);
        expect($router.push).toHaveBeenCalledTimes(2);
        expect(wrapper.vm.searchAnd).toEqual(false);
        expect(wrapper.vm.$route.query.searchAnd).toEqual("false");
    });


});
