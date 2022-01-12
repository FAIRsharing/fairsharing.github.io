import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import StatusPills from "@/components/Records/Shared/StatusPills.vue"
import light from "@/plugins/theme";

const localVue = createLocalVue();
const vuetify = new Vuetify({
    theme: {
        themes: {light}
    }
});
let wrapper;

describe('StatusPills.vue', () => {

    beforeAll(() => {
        wrapper = shallowMount(StatusPills, {
            localVue,
            vuetify,
            props: {
                status: "ready"
            }
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("StatusPills");
    });
});
