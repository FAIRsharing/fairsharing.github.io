import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";
import Maintenance from "@/views/Errors/Maintenance.vue";

const localVue = createLocalVue();
localVue.use(VueMeta);

describe("Maintenance page", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Maintenance, {
            localVue
        });
    });

    it("can mount", () => {
        expect(wrapper.name()).toBe("Maintenance");
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | Maintenance Mode");
    });

});
