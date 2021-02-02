import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";
import Error from "@/views/Errors/404.vue";

const localVue = createLocalVue();
localVue.use(VueMeta);

describe("404 error page", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Error, {
            localVue
        });
    });

    it("can mount", () => {
        expect(wrapper.name()).toBe("Error404");
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | Not Found");
    });

});
