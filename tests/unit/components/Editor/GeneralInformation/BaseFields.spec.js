import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import BaseFields from "@/components/Editor/GeneralInformation/BaseFields.vue"
import recordStore from "@/store/record.js"
import editorStore from "@/store/editor.js"
import icons from "@/../tests/fixtures/icons.json"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.sections = {
    generalInformation: {
        data: {
            countries: [
                {label: 'France', id: 1},
                {label: 'UK', id: 2}
            ],
            metadata: {},
            type: {name: 'test'}
        }
    }
};
const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore
    }
});

let wrapper;

describe('Editor -> BaseFields.vue', () => {

    beforeAll( () => {
        wrapper = shallowMount(BaseFields, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("BaseFields");
        expect(wrapper.vm.icons()).toStrictEqual(icons);
    });

    it("can remove a country", () => {
        wrapper.vm.removeCountry({id: 1, label: 'France'});
        expect(wrapper.vm.fields.countries.length).toBe(1);
    })

});
