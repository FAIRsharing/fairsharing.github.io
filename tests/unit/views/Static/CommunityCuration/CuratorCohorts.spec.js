import {shallowMount} from "@vue/test-utils";
import CuratorCohorts from "@/views/Static/CommunityCuration/CuratorCohorts"
import Vuetify from "vuetify"
import VueRouter from "vue-router";

const vuetify = new Vuetify();
const router = new VueRouter(),

    $route = {
        path: "/",
        params: {year: 2022},
    };

// See also: '@/data/communityCurationCohorts.json'

describe("CuratorCohorts.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CuratorCohorts, {
            mocks: { $route },
            vuetify,
            router
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CuratorCohorts");
        expect(wrapper.vm.year).toBe(2022);
        expect(wrapper.vm.error).toBe(false);
    });

    it("shows a 404 message", () => {
        $route.params.year = 1912;
        wrapper = shallowMount(CuratorCohorts, {
            mocks: { $route },
            vuetify,
            router
        })
        expect(wrapper.vm.error).toBe(true);

    })
});