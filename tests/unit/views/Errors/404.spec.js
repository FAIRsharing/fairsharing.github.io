import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";
import Error from "@/views/Errors/404.vue";

const localVue = createLocalVue();
localVue.use(VueMeta);

let $route = {
    path: "/error/404",
    query: {
        source: '"http://localhost:8080/#/random/test"'
    }
};

describe("404 error page", () => {
    let wrapper;

    it("can mount", () => {
        wrapper = shallowMount(Error, {
            mocks: {$route},
            localVue
        });
        expect(wrapper.name()).toBe("Error404");
        expect(wrapper.vm.getSource).toBe('http://localhost:8080/#/random/test')
    });

    it("has it meta title dynamically set", () => {
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | Not Found");
    });

    it("can process no source", () => {
        $route.query = {};
        wrapper = shallowMount(Error, {
            mocks: {$route},
            localVue
        });
        expect(wrapper.name()).toBe("Error404");
        expect(wrapper.vm.getSource).toBe('Your page ');

    });

});
