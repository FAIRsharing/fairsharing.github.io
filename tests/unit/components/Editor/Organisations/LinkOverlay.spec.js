import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import LinkOverlay from "@/components/Editor/Organisations/LinkOverlay.vue"
import recordStore from "@/store/record.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore,
        users: userStore
    }
});

describe("Edit -> LinkOverlay.vue", function() {
    let wrapper;

    beforeEach(async () => {
        wrapper = await shallowMount(LinkOverlay, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be mounted", async () => {
        expect(wrapper.name()).toMatch("LinkOverlay");
    });

});
