import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";
import Error from "@/views/Errors/500.vue";

const localVue = createLocalVue();
localVue.use(VueMeta);

describe("500 error page", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Error, {
            localVue
        });
    });

    it("can mount", () => {
        expect(wrapper.name()).toBe("Error500");
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | Server Error");
    });

});
