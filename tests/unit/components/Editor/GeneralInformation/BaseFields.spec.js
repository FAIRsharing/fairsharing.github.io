import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import BaseFields from "@/components/Editor/GeneralInformation/BaseFields.vue"
import recordStore from "@/store/record.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"
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

recordStore.state.newRecord = false;
userStore.state.user().is_curator = false;

const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore,
        users: userStore
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
    });

    it("disables type field except for new records and curators", () => {
        userStore.state.user = function(){
            return { is_curator: false }
        };
        expect(wrapper.vm.typeChangeDisabled()).toBe(true);
        recordStore.state.newRecord = true;
        expect(wrapper.vm.typeChangeDisabled()).toBe(false);

        userStore.state.user = function(){
            return { is_curator: true }
        };
        recordStore.state.newRecord = false;
        expect(wrapper.vm.typeChangeDisabled()).toBe(false);
    });

});
