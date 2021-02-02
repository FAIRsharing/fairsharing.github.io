import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import accessPoints from "@/components/Editor/AdditionalInformation/AccessPoints"
import recordStore from "@/store/record";
import userStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        metadata: {
            access_points: [
                {
                    type: 'REST',
                    url: 'http://wibble.com',
                    documentation_url: 'http://wibble.com/docs',
                    example_url: 'http://wibble.com/example'
                }
            ]
        }
    }
};
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        record: recordStore,
        users: userStore
    }
});


describe("AccessPoints", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(accessPoints, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("AccessPoints");
    });
});