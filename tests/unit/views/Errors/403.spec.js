import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";
import Error from "@/views/Errors/403.vue";

const localVue = createLocalVue();
localVue.use(VueMeta);


describe("403 unauthorized page", () => {
    let wrapper;

    it("can mount", () => {
        wrapper = shallowMount(Error, {
            localVue
        });
        expect(wrapper.name()).toBe("Error403");
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | Not Authorized");
    });

});
